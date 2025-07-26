import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './create-task.dto';
import { FindOneParams } from './find-one.params';
import { UpdateTaskDto } from './update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';
import { Task } from './task.entity';
import { CreateTaskLabelDto } from './create-task-label.dto';
import { FindTaskParams } from './find-task.params';
import { PaginationParams } from 'src/common/pagination.params';
import { PaginationResponse } from 'src/common/pagination.response';
import { CurrentUserId } from 'src/users/decorators/current-user-id.decorator';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  public async findAllTasks(
    @Query() filters: FindTaskParams,
    @Query() pagination: PaginationParams,
    @CurrentUserId() userId: string,
  ): Promise<PaginationResponse<Task>> {
    const [tasks, total] = await this.tasksService.getAllTasks(
      filters,
      pagination,
      userId,
    );
    return {
      data: tasks,
      meta: {
        total: total,
        ...pagination,
        // offset: pagination.offset,
        // limit: pagination.limit,
      },
    };
  }

  @Get('/:id')
  public async findOneTask(
    @Param() params: FindOneParams,
    @CurrentUserId() userId: string,
  ): Promise<Task> {
    const task = await this.findOneOrFailed(params.id);
    this.checkTaskOwnership(task, userId);
    return task;
  }

  @Post()
  public async createOneTask(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUserId() userId: string,
  ) {
    return await this.tasksService.createOneTask({
      ...createTaskDto,
      userId,
    });
  }

  @Patch('/:id')
  public async updateTask(
    @Param() param: FindOneParams,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUserId() userId: string,
  ): Promise<Task> {
    const task = await this.findOneOrFailed(param.id);
    this.checkTaskOwnership(task, userId);
    try {
      return this.tasksService.updateTask(task, updateTaskDto);
    } catch (error) {
      if (error instanceof WrongTaskStatusException) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteOneTask(
    @Param() param: FindOneParams,
    @CurrentUserId() userId: string,
  ) {
    const task = await this.findOneOrFailed(param.id);
    this.checkTaskOwnership(task, userId);
    await this.tasksService.deleteOneTask(task);
  }

  @Post('/:id/labels')
  public async addLabels(
    @Param() param: FindOneParams,
    @Body() labels: CreateTaskLabelDto[],
    @CurrentUserId() userId: string,
  ): Promise<Task> {
    console.log('addLabels -> labels:', labels);
    const task = await this.findOneOrFailed(param.id);
    this.checkTaskOwnership(task, userId);
    return await this.tasksService.addLabels(task, labels);
  }

  private async findOneOrFailed(id: string): Promise<Task> {
    const task = await this.tasksService.getOneTask(id);

    if (!task) {
      throw new NotFoundException();
    }

    return task;
  }

  @Delete('/:id/labels')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteLabels(
    @Param() param: FindOneParams,
    @Body() deleteLabels: string[],
    @CurrentUserId() userId: string,
  ): Promise<void> {
    const task = await this.findOneOrFailed(param.id);
    this.checkTaskOwnership(task, userId);
    this.tasksService.deleteTaskLabels(task, deleteLabels);
  }

  private checkTaskOwnership(task: Task, userId: string): void {
    if (task.id !== userId) {
      throw new ForbiddenException('You can only access your own tasks');
    }
  }
}
