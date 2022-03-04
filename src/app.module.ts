import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {appsettings} from './config/appsettings.config';

console.log(appsettings.DB_Connection)
@Module({
  imports: [TasksModule,
    TypeOrmModule.forRoot({
      type:'postgres',
      ...appsettings.DB_Connection
    })],
  controllers: [],
  providers: [],
})
export class AppModule {}
