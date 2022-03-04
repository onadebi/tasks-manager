import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import GenResponse, { StatusCode } from 'src/config/GenResponse';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private readonly taskRepository: TasksRepository,
  ) {}

  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async getTasksWithFilters(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return await this.taskRepository.getTasks(filterDto);
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

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const task: Task = await this.taskRepository.createTask(createTaskDto);
    return task;
  }

  async getTaskById(id: string): Promise<GenResponse<Task>> {
    let task: Task;
    try {
      task = await this.taskRepository.findOne(id);
      if (!task) {
        throw new NotFoundException(
          GenResponse.Result<null>(
            null,
            false,
            StatusCode.NotFound,
            `Task with id ${id} not found.`,
          ),
        );
      }
    } catch (error) {
      throw new NotFoundException(
        GenResponse.Result<null>(
          null,
          false,
          StatusCode.NotFound,
          `Task with id ${id} not found.`,
        ),
      );
    }

    return GenResponse.Result<Task>(task, true, StatusCode.OK);
  }

  async deleteTaskById(id: string): Promise<void> {
    const task = await this.taskRepository.delete(id);
    if (task.affected === 0) {
      throw new NotFoundException(
        GenResponse.Result<null>(
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
  ): Promise<GenResponse<Task>> {
    const task = await this.getTaskById(id);
    task.Data.status = status;
    await this.taskRepository.save(task.Data);
    return task;
  }
}
