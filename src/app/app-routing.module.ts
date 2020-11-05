import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { ChangeroleComponent } from './changerole/changerole.component';
import { ChatComponent } from './chat/chat.component';
import { CreateprojectComponent } from './createproject/createproject.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { ScrumboardComponent } from './scrumboard/scrumboard.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  {path:'', component:HomepageComponent},
  {path: 'home', component:HomepageComponent},
  {path: 'login', component:LoginComponent},
  {path: 'signup', component:SignupComponent},
  {path: 'scrumboard/:project_id', component:ScrumboardComponent, canActivate:[AuthGuard]}, 
  {path: 'chat', component:ChatComponent},
  {path: 'createproject', component:CreateprojectComponent}, 
  {path: 'changerole/:project_id', component:ChangeroleComponent, canActivate:[AuthGuard] },
  {path: '**', redirectTo: '/home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
