import { Injectable, NotFoundException } from '@nestjs/common';
import { ITask, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import GenResponse, { StatusCode } from 'src/config/GenResponse';

@Injectable()
export class TasksService {
  private tasks: ITask[] = [];

  async getAllTasks(): Promise<ITask[]> {
    return this.tasks;
  }

  async getTasksWithFilters(filterDto: GetTasksFilterDto): Promise<ITask[]> {
    let tasks = await this.getAllTasks();
    const { search, status } = filterDto;

    if (status) {
      tasks = (await tasks).filter(
        (t) => t.status.toLowerCase() === status.toLowerCase(),
      );
    }
    if (search) {
      tasks = (await tasks).filter((t) => {
        if (
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.description.toLowerCase().includes(search.toLowerCase())
        ) {
          return true;
        }
        return false;
      });
    }
    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<ITask> {
    const { title, description } = createTaskDto;
    const task: ITask = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  async getTaskById(id: string): Promise<GenResponse<ITask>> {
    const task =this.tasks.find((p) => p.id === id);
    if(!task){
      throw new NotFoundException(GenResponse.Result<null>(null,false,StatusCode.NotFound,`Task with id ${id} not found.`));
    }
    return GenResponse.Result<ITask>(task,true,StatusCode.OK)
  }

  async deletTaskById(id: string): Promise<void> {
    const task= await this.getTaskById(id);
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }

  async updateTaskById(id: string, status: TaskStatus): Promise<GenResponse<ITask>> {
    const task= await this.getTaskById(id);
    this.tasks.find((t) => t.id === id).status = status;
    return task;
  }
}
