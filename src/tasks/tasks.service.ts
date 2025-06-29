import { Injectable } from '@nestjs/common';
import { TaskStatus } from './tasks.model';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';
import { Repository } from 'typeorm';
import { Tasks } from './tasks.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Tasks)
    private readonly tasksRepository: Repository<Tasks>,
  ) {}

  public async getAllTasks() {
    return await this.tasksRepository.find();
  }

  public async getOneTask(id: string): Promise<Tasks | null> {
    return await this.tasksRepository.findOneBy({ id });
  }

  public async createOneTask(createTaskDto: CreateTaskDto): Promise<Tasks> {
    return await this.tasksRepository.save(createTaskDto);
  }

  public async deleteOneTask(task: Tasks): Promise<void> {
    await this.tasksRepository.delete(task);
  }

  public async updateTask(
    task: Tasks,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Tasks> {
    if (
      updateTaskDto?.status &&
      !this.isValidStatusTransition(task.status, updateTaskDto.status)
    ) {
      throw new WrongTaskStatusException();
    }
    Object.assign(task, updateTaskDto);
    return await this.tasksRepository.save(task);
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
