import {
  Body,
  Controller,
  Get,
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

  @Patch('/:id/status')
  public updateTaskStatus(
    @Param() param: FindOneParams,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    const task = this.findOneOrFailed(param.id);
    task.status = updateTaskStatusDto.status;
    return task;
  }

  private findOneOrFailed(id: string): ITask {
    const oneTask = this.tasksService.getOneTask(id);

    if (!oneTask) {
      throw new NotFoundException(`Task ${id} Not Found`);
    }

    return oneTask;
  }
}
