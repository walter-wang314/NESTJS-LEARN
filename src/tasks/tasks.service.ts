import { Injectable } from '@nestjs/common';
import { ITask } from './tasks.model';
import { CreateTaskDto } from './create-task.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class TasksService {
  private tasks: ITask[] = [];

  public getAllTasks() {
    return this.tasks;
  }

  public getOneTask(id: string): ITask | undefined {
    return this.tasks.find((task) => task.id === id);
  }

  public createOneTask(createTaskDto: CreateTaskDto): ITask {
    const task: ITask = {
      id: randomUUID(),
      ...createTaskDto,
    };

    this.tasks.push(task);

    return task;
  }
}
