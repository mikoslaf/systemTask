import { Injectable } from '@angular/core';
import { Status } from './status';
import { Task } from './task';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorkingService {
  static lastID: number = 0;

  public static taskStatus: Status[] = [
    { id: 0, name: 'Do wykonania' },
    { id: 250, name: 'W trakcie' },
    { id: 500, name: 'Wykonane' },
  ];

  public static workStatus: Status[] = [
    { id: 250, name: 'Do trakcie' },
    { id: 500, name: 'Wykonane' },
  ];

  private tasks: Task[] = [];

  private rxdata: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>(
    this.tasks
  );

  public sub(): Observable<Task[]> {
    return this.rxdata.asObservable();
  }

  public refresh(): void {
    this.rxdata.next(this.tasks);
  }

  getTask(id: number): Task {
    let indexTask = this.tasks.findIndex((e) => e.id == id);
    console.log(indexTask);

    if (indexTask >= 0) return this.tasks[indexTask];
    return {
      id: -1,
      name: '',
      active: true,
      status: 0,
      taskEnd: new Date(),
      taskStart: new Date(),
      work: [],
    };
  }

  public addOrUpdate(task: Task): void {
    if (task.id < 0) {
      this.tasks.push(task);
      task.id = ++WorkingService.lastID;
    } else {
      let ind = this.tasks.findIndex((e) => (e.id = task.id));
      if (ind >= 0) {
        this.tasks[ind] = task;
      }
    }
    this.save();
    this.refresh();
  }

  save(): void {
    localStorage.setItem('sem3_apl_int', JSON.stringify(this.tasks));
  }

  load(): void {
    let dane = localStorage.getItem('sem3_apl_int');
    if (!dane) dane = '[]';
    this.tasks = JSON.parse(dane) as Task[];
    this.tasks.forEach((e) => {
      e.taskStart = new Date(e.taskStart);
      e.taskEnd = new Date(e.taskEnd);
    });

    if (this.tasks.length)
      WorkingService.lastID = Math.max(...this.tasks.map((e) => e.id));
    this.refresh();
  }

  public remTask(id: number): void {
    this.tasks = this.tasks.filter((e) => e.id != id);
    this.save();
    this.refresh();
  }

  constructor() {
    this.load();
  }
}
