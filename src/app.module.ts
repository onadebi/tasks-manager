import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {appsettings} from './config/appsettings.config';
import { AuthModule } from './auth/auth.module';

console.log(appsettings.DB_Connection)
@Module({
  imports: [TasksModule,
    TypeOrmModule.forRoot({
      type:'postgres',
      ...appsettings.DB_Connection
    }),
    AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
