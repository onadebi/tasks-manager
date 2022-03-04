import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TasksRepository } from './tasks.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TasksRepository])],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
