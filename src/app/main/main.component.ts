import { Component } from '@angular/core';
import { WorkingService } from '../working.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

  constructor(public working: WorkingService) {
    working.subTask().subscribe( tasks => {
      console.log(tasks);
    })
  }

}
