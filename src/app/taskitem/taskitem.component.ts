import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../task';
import { Router } from '@angular/router';
import { WorkingService } from '../working.service';
import { NgClass } from '@angular/common';
import moment from 'moment';
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

  public workTime: string = "00:00:00";

  constructor(private router: Router, private serv: WorkingService){
    setInterval(() => {
      this.workTime = WorkingService.getWorkTime(this.dane);
    }, 500);
  }

  public edit(id: number) {
    this.router.navigate(['/add', id]);
  }

  public status(): boolean {
    let status: boolean = false;
    if(this.dane.work.length > 0){
      let lastWork = this.dane.work.at(-1);
      status = lastWork?.status.id == WorkingService.workStatusStart;
    }

    return status;
  }

  public statusChange() {
    this.serv.statusChange(this.dane);
  }

  public removeSelect(id: number){
    this.delete.emit(id);
    console.log(id); // coś tu jest źle, removeID definitywnie nie działa, chyba już nieaktualne
  }
}
