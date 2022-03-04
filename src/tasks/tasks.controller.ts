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
import {TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  async getasks(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
    return await this.taskService.getTasksWithFilters(filterDto);
    //#region Old
    // const lengthValues = Object.keys(filterDto).length;
    // if (lengthValues) {
    //   return await this.taskService.getTasksWithFilters(filterDto);
    // } else {
    //   return await this.taskService.getAllTasks();
    // }
    //#endregion
  }

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskService.createTask(createTaskDto);
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: string): Promise<GenResponse<Task>> {
    const objResult = await this.taskService.getTaskById(id);
    return objResult;
  }

  @Delete('/:id')
  async deleteTaskById(@Param('id') id: string): Promise<string> {
    await this.taskService.deleteTaskById(id);
    return id;
  }

  @Patch('/:id/status')
  async updateTaskById(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateStackStatus,
  ):Promise<GenResponse<Task>> {
    const {status} = updateTaskStatusDto;
    return await this.taskService.updateTaskById(id, status);
  }
}
