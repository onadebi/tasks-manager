import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateStackStatus } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private readonly taskService: TasksService) {}


  @Get()
  async getasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ):Promise<Task[]> {
    return await this.taskService.getTasksWithFilters(filterDto, user);
    //#region Old
    // const lengthValues = Object.keys(filterDto).length;
    // if (lengthValues) {
    //   return await this.taskService.getTasksWithFilters(filterDto);
    // } else {
    //   return await this.taskService.getAllTasks();
    // }
    //#endregion
  }

  @ApiOperation({
    summary:'Create new task'
  })
  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User
  ): Promise<Task>{
    return await this.taskService.createTask(createTaskDto, user);
  }


  @Get('/:id')
  async getTaskById(
    @Param('id') id: string,
    @GetUser() user: User
  ): Promise<Task> {
    return (await this.taskService.getTaskById(id, user)).Data;
  }

  @Delete('/:id')
  async deleteTaskById(@Param('id') id: string, @GetUser() user: User): Promise<string> {
    await this.taskService.deleteTaskById(id,user);
    return id;
  }

  @Patch('/:id/status')
  async updateTaskById(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateStackStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return await (await this.taskService.updateTaskById(id, status, user)).Data;
  }
}
