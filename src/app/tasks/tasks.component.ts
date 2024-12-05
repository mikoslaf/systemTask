import { Component } from '@angular/core';
import { WorkingService } from '../working.service';
import { Router } from '@angular/router';
import { Task } from '../task';
import { NgFor } from '@angular/common';
import { Category } from '../category';
import { TaskitemComponent } from '../taskitem/taskitem.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [NgFor, TaskitemComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent {
  public tasks: Task[]= []; 
  public categories: Category[] = [];
  public removeItem:Task = WorkingService.getEmptyTask();
  

  public removeSelect(id: number): void {
    this.removeItem = this.serwis.getTask(id);
  }

  public remove(): void {
    this.serwis.remTask(this.removeItem.id);
    this.removeItem = WorkingService.getEmptyTask();
  }

  constructor(private serwis: WorkingService, private router: Router) {
    serwis.subTask().subscribe((tasks: Task[]) => {
      this.tasks = tasks;
    })

    serwis.subCategory().subscribe((categories: Category[]) => {
      this.categories = categories;
    })
  }
}
