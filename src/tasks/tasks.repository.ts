import { filter } from "rxjs";
import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { createTaskDto } from "./dto/create-task.dto";
import { GetTaskFilterDto } from "./dto/get-tasks-filter.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";

@EntityRepository(Task)
export class TasksRepository extends Repository<Task>{
 async getTasks (filterDto: GetTaskFilterDto, user: User): Promise<Task[]>{
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where({user})

    if (status) {
        query.andWhere('task.status = :status', {status});
    }

    if (search) {
        query.andWhere(
            '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))', {search: `%${search}%`}
        )
    }

    const tasks = await query.getMany();
    return tasks;
 }

 async createTask (createTaskDto: createTaskDto, user: User): Promise<Task>{
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user
    })
    
    await this.save(task);
    return task;
 }

}