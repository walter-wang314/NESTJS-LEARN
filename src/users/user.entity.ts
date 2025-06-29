import { Task } from 'src/tasks/task.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @CreateDateColumn()
  CreatedAt: Date;

  @UpdateDateColumn()
  UpdatedAt: Date;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task;
}
