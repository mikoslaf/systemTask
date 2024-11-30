import { Injectable } from '@angular/core';
import { Status } from './status';
import { Task } from './task';
import { BehaviorSubject, Observable } from 'rxjs';
import { Work } from './work';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class WorkingService {
  static lastID: number = 0;

  public static workStatusNew: number = 0;
  public static workStatusStart: number = 250;
  public static workStatusStop: number = 500;

  public static taskStatus: Status[] = [
    { id: WorkingService.workStatusNew, name: 'Do wykonania' },
    { id: WorkingService.workStatusStart, name: 'W trakcie' },
    { id: WorkingService.workStatusStop, name: 'Wykonane' },
  ];

  public static workStatus: Status[] = [
    { id: WorkingService.workStatusStart, name: 'Do trakcie' },
    { id: WorkingService.workStatusStop, name: 'Wykonane' },
  ];

  static getEmptyTask(): Task {
    return {id: -1, active: false, name: "", status: 0, taskEnd: new Date(), taskStart: new Date(), work:[], timeWorking: 0};
  }

  static workSelectStatus(id: number): Status {
    return WorkingService.workStatus.filter(e => e.id == id)[0];
  }

  static getEmptyWork(): Work {
    return {start: new Date(), stop: new Date(), status: WorkingService.workSelectStatus(this.workStatusStart)};
  }


  private tasks: Task[] = [];

  private rxdata: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>(
    this.tasks
  );

  public taskStatusStart(): Task | null {
    let workTask = this.tasks.filter(e => e.status == WorkingService.workStatusStart)[0];
    return workTask;
  }

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
    let newTask = WorkingService.getEmptyTask();
    newTask.active = true;
    return newTask;
  }

  public static getWorkTime(task: Task): string {
    let workTime = 0;
    if(task.status == WorkingService.workStatusStart){
      let work: Work | undefined = task.work.at(-1);
      workTime = (new Date()).getTime() - (new Date(work?.start??(new Date).getTime())).getTime();
    }
    let sumTime = task.timeWorking;
    if(!sumTime){
      sumTime = 0;
    }
    sumTime += workTime;

    let duration = moment.duration(sumTime);
    const day = duration.days();
    const hour = duration.hours().toString().padStart(2, "0");
    const minute = duration.minutes().toString().padStart(2, "0");
    const second = duration.seconds().toString().padStart(2, "0");
    if(day > 0){
      return `${day}:${hour}:${minute}:${second}`;
    }
    return `${hour}:${minute}:${second}`;
    
  }

  public addOrUpdate(task: Task): void {
    if (task.id < 0) {
      this.tasks.push(task);
      task.id = ++WorkingService.lastID;
    } else {
      let ind = this.tasks.findIndex((e) => (e.id == task.id));
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

  public updateWorkTime(task: Task) {
    let workList: Work[] = task.work.filter(e => e.status.id == WorkingService.workStatusStop);
    let sum = 0;
    workList.forEach(e => {
      sum += (new Date(e.stop).getTime() - new Date(e.start).getTime());
    });
    task.timeWorking = sum;
    console.log(workList);
    
    console.log(sum);
  }

  public lastTaskItem(): Task | undefined {
    let task = this.tasks.sort((a, b) => ((a.lastStatus??0) < (b.lastStatus??0)) ? 1 : -1);
    return task.at(-1); // sprawdzić czy jest źle
  }

  public statusChange(task: Task) {

    let work: Work | undefined = task.work.at(-1);

    if(work != undefined && work.status.id == WorkingService.workStatusStart) {
      work.status = WorkingService.workSelectStatus(WorkingService.workStatusStop);
      work.stop = new Date();
      task.status = WorkingService.workStatusStop
      this.updateWorkTime(task);
    } else {
      let activeTask = this.taskStatusStart();
      if(activeTask) {
        this.statusChange(activeTask);
      }
      work = WorkingService.getEmptyWork();
      task.work.push(work);
      task.status = WorkingService.workStatusStart;
      task.lastStatus = new Date();
    }
    
    this.addOrUpdate(task);
  }

  constructor() {
    this.load();
  }
}
