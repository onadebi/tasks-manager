import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { User } from 'src/auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './task-status.enum';

@Entity()
export class Task {
  @ApiProperty({
    description:'id'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description:'task title',
    example: 'A new task'
  })
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column()
  status: TaskStatus;

  @ApiProperty()
  @ManyToOne(() => User, (u) => u.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
