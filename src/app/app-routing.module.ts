import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AssessComponent } from './assess/assess.component';

const routes: Routes = [
  {
    'path': '',
    'component': HomeComponent
  },
  {
    'path': 'assess',
    'component': AssessComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
