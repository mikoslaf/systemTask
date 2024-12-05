import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../task';
import { Router } from '@angular/router';
import { WorkingService } from '../working.service';
import { NgClass } from '@angular/common';

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
  public categories = [WorkingService.getBasicCategory()];

  constructor(private router: Router, private serv: WorkingService){
    this.categories = this.serv.getCategories();
    setInterval(() => {
      this.workTime = WorkingService.getWorkTime(this.dane);
    }, 500);
  }

  public getCategoryName(id: number): string {
    return this.categories.filter(e => e.id == id)[0].name
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
