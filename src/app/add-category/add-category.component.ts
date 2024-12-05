import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category } from '../category';
import { WorkingService } from '../working.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss'
})
export class AddCategoryComponent {
  public dane: Category =  WorkingService.getEmptyCategory();

  constructor(public serv: WorkingService, private activeRouter: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    let id = this.activeRouter.snapshot.paramMap.get("id");
    this.dane = this.serv.getCategory(id != null ? parseInt(id) : -1);    
  }

  save(){
    this.serv.addOrUpdateCategory(this.dane);
    alert("Zapisano");
  }
}
