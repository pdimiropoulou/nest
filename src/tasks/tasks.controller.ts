import { Body, Controller, Get, Param, Post, Delete, Patch, Query, UseGuards, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUSer } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { createTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');

  constructor(private tasksService: TasksService) {}
  @Get()
  getTasks(@Query() fiterDto: GetTaskFilterDto, @GetUSer() user: User): Promise<Task[]> {
    this.logger.verbose(`User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(fiterDto)}`)
    return this.tasksService.getTasks(fiterDto, user);
    
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUSer() user: User): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string, @GetUSer() user: User): Promise<void> {
    return this.tasksService.deleteTask(id, user);
    
  }

  @Post()
  createTask(@Body() createTaskDto: createTaskDto,@GetUSer() user: User): Promise<Task> {
      return this.tasksService.createTask(createTaskDto, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUSer() user: User
  ): Promise<Task>{
     const { status } = updateTaskStatusDto;
     return this.tasksService.updaTaskStatus(id, status, user);

  }
}
