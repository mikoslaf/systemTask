import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../task';
import { Router } from '@angular/router';
import { WorkingService } from '../working.service';

@Component({
  selector: 'app-taskitem',
  standalone: true,
  imports: [],
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

  public removeSelect(id: number){
    this.delete.emit(id);
    console.log(id); // coś tu jest źle, removeID definitywnie nie działa
  }
}
