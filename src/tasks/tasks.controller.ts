import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import GenResponse from 'src/config/GenResponse';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateStackStatus } from './dto/update-task-status.dto';
import { ITask, TaskStatus } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  async getasks(@Query() filterDto: GetTasksFilterDto): Promise<ITask[]> {
    const lengthValues = Object.keys(filterDto).length;
    if (lengthValues) {
      return await this.taskService.getTasksWithFilters(filterDto);
    } else {
      return await this.taskService.getAllTasks();
    }
  }

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<ITask> {
    return await this.taskService.createTask(createTaskDto);
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: string): Promise<GenResponse<ITask>> {
    const objResult = await this.taskService.getTaskById(id);
    return objResult;
  }

  @Delete('/:id')
  async deleteTaskById(@Param('id') id: string): Promise<string> {
    await this.taskService.deletTaskById(id);
    return id;
  }

  @Patch('/:id/status')
  async updateTaskById(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateStackStatus,
  ):Promise<GenResponse<ITask>> {
    const {status} = updateTaskStatusDto;
    return await this.taskService.updateTaskById(id, status);
  }
}
