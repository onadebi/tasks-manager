import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {

    async getTasks(filterDto: GetTasksFilterDto,user: User): Promise<Task[]> {
        const{search,status} = filterDto;
        const taskQuery = this.createQueryBuilder('task').where({user});
        if(status){
            taskQuery.andWhere('task.status = :status',{status});
        }
        if(search){
            taskQuery.andWhere(`(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))`,{search: `%${search}%`})
        }
        const tasks =await taskQuery.getMany();
        return tasks;
    }
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task: Task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user
    });
    await this.save(task);
    return task;
  }
  
}
