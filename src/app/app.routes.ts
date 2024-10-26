import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { TasksComponent } from './tasks/tasks.component';
import { TaskitemComponent } from './taskitem/taskitem.component';

export const routes: Routes = [
    { path: "", component: MainComponent },
    { path: "add", component: AddTaskComponent },
    { path: "tasks", component: TasksComponent },
    { path: "taskitem", component: TaskitemComponent}
];
