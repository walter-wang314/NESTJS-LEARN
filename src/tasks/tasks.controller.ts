import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './create-task.dto';
import { FindOneParams } from './find-one.params';
import { UpdateTaskDto } from './update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';
import { Task } from './task.entity';
import { CreateTaskLabelDto } from './create-task-label.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  public async findAllTasks(): Promise<Task[]> {
    return await this.tasksService.getAllTasks();
  }

  @Get('/:id')
  public async findOneTask(@Param() params: FindOneParams): Promise<Task> {
    return await this.findOneOrFailed(params.id);
  }

  @Post()
  public async createOneTask(@Body() createTaskDto: CreateTaskDto) {
    console.log('createTaskDto:', createTaskDto);
    return await this.tasksService.createOneTask(createTaskDto);
  }

  @Patch('/:id')
  public async updateTask(
    @Param() param: FindOneParams,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.findOneOrFailed(param.id);
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
  public async deleteOneTask(@Param() param: FindOneParams) {
    const task = await this.findOneOrFailed(param.id);
    await this.tasksService.deleteOneTask(task);
  }

  @Post('/:id/labels')
  public async addLabels(
    @Param() param: FindOneParams,
    @Body() labels: CreateTaskLabelDto[],
  ): Promise<Task> {
    console.log('addLabels -> labels:', labels);
    const task = await this.findOneOrFailed(param.id);
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
  ): Promise<void> {
    const task = await this.findOneOrFailed(param.id);
    this.tasksService.deleteTaskLabels(task, deleteLabels);
  }
}
