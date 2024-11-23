import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../task';
import { Router } from '@angular/router';
import { WorkingService } from '../working.service';
import { NgClass } from '@angular/common';
import { Work } from '../work';

@Component({
  selector: 'app-taskitem',
  standalone: true,
  imports: [NgClass],
  templateUrl: './taskitem.component.html',
  styleUrl: './taskitem.component.scss'
})
export class TaskitemComponent {
  @Input() dane:Task = WorkingService.getEmptyTask();
  @Output() delete = new EventEmitter<number>();

  constructor(private router: Router, private serv: WorkingService){}

  public edit(id: number) {
    this.router.navigate(['/add', id]);
  }

  public status(): boolean {
    let status = false;
    if(this.dane.work.length > 0){
      let lastWork = this.dane.work.at(-1);
      status = lastWork?.status.id == WorkingService.workStatusStart;
    }

    return status;
  }

  public statusChange() {
    let work: Work | undefined = this.dane.work.at(-1);

    if(work != undefined && work.status.id == WorkingService.workStatusStart) {
      work.status = WorkingService.workSelectStatus(WorkingService.workStatusStop);
      work.stop = new Date();
    } else {
      work = WorkingService.getEmptyWork();
      this.dane.work.push(work);
    }
    
    this.serv.addOrUpdate(this.dane);
  }

  public removeSelect(id: number){
    this.delete.emit(id);
    console.log(id); // coś tu jest źle, removeID definitywnie nie działa
  }
}
