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
import { ITask } from './tasks.model';
import { CreateTaskDto } from './create-task.dto';
import { FindOneParams } from './find-one.params';
import { UpdateTaskStatusDto } from './update-task-status.dto';
import { UpdateTaskDto } from './update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  public findAllTasks(): ITask[] {
    return this.tasksService.getAllTasks();
  }

  @Get('/:id')
  public findOneTask(@Param() params: FindOneParams): ITask | undefined {
    return this.findOneOrFailed(params.id);
  }

  @Post()
  public createOneTask(@Body() createTaskDto: CreateTaskDto) {
    console.log('createTaskDto:', createTaskDto);
    return this.tasksService.createOneTask(createTaskDto);
  }

  // @Patch('/:id/status')
  // public updateTaskStatus(
  //   @Param() param: FindOneParams,
  //   @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  // ) {
  //   const task = this.findOneOrFailed(param.id);
  //   task.status = updateTaskStatusDto.status;
  //   return task;
  // }

  @Patch('/:id')
  public updateTask(
    @Param() param: FindOneParams,
    @Body() updateTaskDto: UpdateTaskDto,
  ): ITask {
    const task = this.findOneOrFailed(param.id);
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
  public deleteOneTask(@Param() param: FindOneParams) {
    const task = this.findOneOrFailed(param.id);
    this.tasksService.deleteOneTask(task);
  }

  private findOneOrFailed(id: string): ITask {
    const oneTask = this.tasksService.getOneTask(id);

    if (!oneTask) {
      throw new NotFoundException(`Task ${id} Not Found`);
    }

    return oneTask;
  }
}
