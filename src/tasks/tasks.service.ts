import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import GenResponseDto, { StatusCode } from 'src/config/GenResponse.dto';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksRepository } from './tasks.repository';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private readonly taskRepository: TasksRepository,
  ) {}

  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async getTasksWithFilters(filterDto: GetTasksFilterDto,user: User): Promise<Task[]> {
    return await this.taskRepository.getTasks(filterDto,user);
    //#region Old
    // let tasks = await this.getAllTasks();
    // const { search, status } = filterDto;
    
    // if (status) {
    //   tasks = (await tasks).filter(
    //     (t) => t.status.toLowerCase() === status.toLowerCase(),
    //     );
    //   }
    //   if (search) {
    //   tasks = (await tasks).filter((t) => {
    //     if (
    //       t.title.toLowerCase().includes(search.toLowerCase()) ||
    //       t.description.toLowerCase().includes(search.toLowerCase())
    //       ) {
    //         return true;
    //       }
    //       return false;
    //     });
    //   }
    //   return tasks;
      //#endregion
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task: Task = await this.taskRepository.createTask(createTaskDto, user);
    return task;
  }

  async getTaskById(id: string,user: User): Promise<GenResponseDto<Task>> {
    let task: Task;
    try {
      task = await this.taskRepository.findOne({where:{id, user}});
      if (!task) {
        throw new NotFoundException(
          GenResponseDto.Result<null>(
            null,
            false,
            StatusCode.NotFound,
            `Task with id ${id} not found.`,
          ),
        );
      }
    } catch (error) {
      throw new NotFoundException(
        GenResponseDto.Result<null>(
          null,
          false,
          StatusCode.NotFound,
          `Task with id ${id} not found.`,
        ),
      );
    }

    return GenResponseDto.Result<Task>(task, true, StatusCode.OK);
  }

  async deleteTaskById(id: string,user: User): Promise<void> {
    const task = await this.taskRepository.delete({id,user});
    if (task.affected === 0) {
      throw new NotFoundException(
        GenResponseDto.Result<null>(
          null,
          false,
          StatusCode.NotFound,
          `Task with id ${id} not found.`,
        ),
      );
    }
  }

  async updateTaskById(
    id: string,
    status: TaskStatus,
    user: User
  ): Promise<GenResponseDto<Task>> {
    const task = await this.getTaskById(id,user);
    task.Data.status = status;
    await this.taskRepository.save(task.Data);
    return task;
  }
}
