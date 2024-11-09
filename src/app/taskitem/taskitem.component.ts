import { Component, Input } from '@angular/core';
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
  private removeId: number = -1;
  @Input() dane:Task = {id: -1, active: false, name: "", status: 0, taskEnd: new Date(), taskStart: new Date(), work:[]};
  constructor(private router: Router, private serv: WorkingService){}

  public edit(id: number) {
    this.router.navigate(['/add', id]);
  }

  public removeSelect(id: number){
    this.removeId = id;
    console.log(id); // coś tu jest źle, removeID definitywnie nie działa
  }

  public remove() {
    if(this.removeId > 0)
      this.serv.remTask(this.removeId);
    this.removeId = 0;
  }

  public getinfo(): string {
    return this.serv.getTask(this.removeId).name;
  }
}
