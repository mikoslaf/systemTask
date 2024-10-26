import { Component, Input } from '@angular/core';
import { Task } from '../task';

@Component({
  selector: 'app-taskitem',
  standalone: true,
  imports: [],
  templateUrl: './taskitem.component.html',
  styleUrl: './taskitem.component.scss'
})
export class TaskitemComponent {
  @Input() dane:Task = {id: -1, active: false, name: "", status: 0, taskEnd: new Date(), taskStart: new Date(), work:[]};
}