import { Injectable } from '@nestjs/common';
import { TaskStatus } from './task.model';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskLabel } from './task-label.entity';
import { CreateTaskLabelDto } from './create-task-label.dto';
import { FindTaskParams } from './find-task.params';
import { PaginationParams } from 'src/common/pagination.params';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,

    @InjectRepository(TaskLabel)
    private readonly labelsRepository: Repository<TaskLabel>,
  ) {}

  public async getAllTasks(
    filters: FindTaskParams,
    pagination: PaginationParams,
    userId: string,
  ): Promise<[Task[], number]> {
    // const where: FindOptionsWhere<Task> = {};

    const query = this.tasksRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.labels', 'labels')
      .where('task.userId = :userId', { userId });

    if (filters.status) {
      // where.status = filters.status;
      query.andWhere('task.status = :status', { status: filters.status });
    }

    if (filters.search?.trim()) {
      // where.title = Like(`%${filters.search}%`);
      // where.description = Like(`%${filters.search}%`);
      query.andWhere(
        'task.title ILIKE :search OR task.description ILIKE :search',
        { search: `%${filters.search}%` },
      );
    }

    if (filters.labels?.length) {
      // query.andWhere('labels.name IN (:...labels)', { labels: filters.labels });
      const subQuery = query
        .subQuery()
        .select('labels.taskId')
        .from('task_label', 'labels')
        .where('labels.name IN (:...labels)', { labels: filters.labels })
        .getQuery();

      query.andWhere(`task.id IN ${subQuery}`);
    }

    // return await this.tasksRepository.findAndCount({
    //   // where: {
    //   //   status: filters.status,
    //   // },
    //   where,
    //   relations: ['labels'],
    //   skip: pagination.offset,
    //   take: pagination.limit,
    // });

    query.orderBy(`task.${filters.sortBy}`, filters.sortOrder);

    query.skip(pagination.offset).take(pagination.limit);
    return query.getManyAndCount();
  }

  public async getOneTask(id: string): Promise<Task | null> {
    return await this.tasksRepository.findOne({
      where: { id },
      relations: ['labels'],
    });
  }

  public async createOneTask(createTaskDto: CreateTaskDto): Promise<Task> {
    if (createTaskDto.labels) {
      createTaskDto.labels = this.getUniqueLabels(createTaskDto.labels);
    }
    return await this.tasksRepository.save(createTaskDto);
  }

  public async deleteOneTask(task: Task): Promise<void> {
    // await this.tasksRepository.delete(task.id);
    await this.tasksRepository.remove(task);
  }

  public async updateTask(
    task: Task,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    if (
      updateTaskDto?.status &&
      !this.isValidStatusTransition(task.status, updateTaskDto.status)
    ) {
      throw new WrongTaskStatusException();
    }

    if (updateTaskDto.labels) {
      updateTaskDto.labels = this.getUniqueLabels(updateTaskDto.labels);
    }
    Object.assign(task, updateTaskDto);
    return await this.tasksRepository.save(task);
  }

  public async addLabels(task: Task, labelDtos: CreateTaskLabelDto[]) {
    const existingLabels = task.labels.map((label) => label.name);
    const dtoLabels = this.getUniqueLabels(labelDtos)
      .filter((labelDto) => !existingLabels.includes(labelDto.name))
      .map((label) => this.labelsRepository.create(label));

    if (dtoLabels.length) {
      task.labels = [...task.labels, ...dtoLabels];
      return await this.tasksRepository.save(task);
    }

    return task;
  }

  public async deleteTaskLabels(task: Task, deleteLabels: string[]) {
    task.labels = task.labels.filter(
      (label) => !deleteLabels.includes(label.name),
    );
    this.tasksRepository.save(task);
  }

  private getUniqueLabels(
    labelDtos: CreateTaskLabelDto[],
  ): CreateTaskLabelDto[] {
    const uniqueNames = [...new Set(labelDtos.map((label) => label.name))];
    return uniqueNames.map((name) => ({ name }));
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
