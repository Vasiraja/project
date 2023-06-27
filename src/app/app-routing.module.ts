import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewComponent } from './components/tasks/new.component';
import { UpdationComponent } from './components/updation/updation.component';
import { InstRegisterComponent } from './components/inst-register/inst-register.component';
import { LoginComponent } from './components/login/login.component';
import { MergeComponent } from './components/merge/merge.component';
import { PhotoInputComponent } from './components/photo-input/photo-input.component';
import { TranscriptionComponent } from './components/transcription/transcription.component';
import { StuRegisterComponent } from './components/stu-register/stu-register.component';
import { StuLoginComponent } from './components/stu-login/stu-login.component';
import { StutaskComponent } from './components/stutask/stutask.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { NotEligibleComponent } from './components/not-eligible/not-eligible.component';
import { VideouploadComponent } from './components/videoupload/videoupload.component';
import { NotLookingComponent } from './components/not-looking/not-looking.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserdetailsComponent } from './components/userdetails/userdetails.component';
import { LogoutComponent } from './components/logout/logout.component';
import { UserprofileComponent } from './components/userprofile/userprofile.component';
import { AdmininputComponent } from './components/admininput/admininput.component';
import { UserdashboardComponent } from './components/userdashboard/userdashboard.component';
import { GenerateresumeComponent } from './components/generateresume/generateresume.component';
import { CloudComponent } from './components/cloud/cloud.component';
    const routes: Routes = [
{path:"tasks", component:NewComponent},
{path: "update", component:UpdationComponent},
{path: "register", component:InstRegisterComponent},
      { path: "login", component: LoginComponent },

{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
{path:"photoanalyze",component:PhotoInputComponent},
{ path: 'transcribe/:textId', component: TranscriptionComponent },
// {path:'tasks/:stuid',component:NewComponent},  

 {path:"update/:userId",component:UpdationComponent},
// { path: '', pathMatch: 'full', redirectTo: 'register' },
// { path: 'login/:Inst_name', component: LoginComponent },
{path: 'update-tasks' ,component:MergeComponent},
// {path:'tasks/:challenge_id', redirectTo:'/tasks' ,pathMatch:'full'},
{path:'dashboard',component:DashboardComponent},
{path:'admin',component:AdmininputComponent},
 
{path:'userprofile',component:UserprofileComponent},
{path:'admininput',component:AdmininputComponent},

 //_______________________________Student Routes________________________________________//
 {path:'sturegister',component:StuRegisterComponent},
{path:'stulogin', component:StuLoginComponent},         
{path:'stutask',component:StutaskComponent },
{path:'questions',component:QuestionsComponent,},
{path:'not-eligible',component:NotEligibleComponent},
{path:'photo-input',component:PhotoInputComponent},
{path:'videoupload',component:VideouploadComponent},
{path:'notlook',component:NotLookingComponent},
{path:'logout',component:LogoutComponent},
{path:'userdetails',component:UserdetailsComponent},
{path:'userdashboard',component:UserdashboardComponent},
      { path: 'generateresume', component: GenerateresumeComponent },
{path:'cloud',component:CloudComponent},
//   path: 'test/:stuid/question/:challenge_id',
//   component: QuestionsComponent
// },

// { path: 'tasks/:stuid', component: NewComponent, pathMatch: 'full', data: { title: 'Tasks Page' } }

 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
