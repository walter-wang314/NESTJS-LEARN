import { Injectable } from '@nestjs/common';
import { ITask, TaskStatus } from './tasks.model';
import { CreateTaskDto } from './create-task.dto';
import { randomUUID } from 'crypto';
import { UpdateTaskDto } from './update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';

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

  public deleteOneTask(task: ITask) {
    this.tasks = this.tasks.filter(
      (filteredTask) => filteredTask.id !== task.id,
    );
  }

  public updateTask(task: ITask, updateTaskDto: UpdateTaskDto) {
    if (
      updateTaskDto?.status &&
      !this.isValidStatusTransition(task.status, updateTaskDto.status)
    ) {
      throw new WrongTaskStatusException();
    }
    Object.assign(task, updateTaskDto);
    return task;
  }

  private isValidStatusTransition(
    currentStatus: TaskStatus,
    newStatus: TaskStatus,
  ): boolean {
    const statusOrder = [
      TaskStatus.OPEN,
      TaskStatus.IN_PROGRESS,
      TaskStatus.DONE,
    ];
    return statusOrder.indexOf(currentStatus) < statusOrder.indexOf(newStatus);
  }
}
