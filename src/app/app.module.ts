import { ContentChild, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatTabsModule } from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
 import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewComponent } from './components/tasks/new.component';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { MyService } from './new.service';
import { UpdationComponent } from './components/updation/updation.component';
import { InstRegisterComponent } from './components/inst-register/inst-register.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { MergeComponent } from './components/merge/merge.component';
import { PhotoInputComponent } from './components/photo-input/photo-input.component';
import { WebcamModule } from 'ngx-webcam';
import { TranscriptionComponent } from './components/transcription/transcription.component';
import { StuRegisterComponent } from './components/stu-register/stu-register.component';
import { StuLoginComponent } from './components/stu-login/stu-login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StutaskComponent } from './components/stutask/stutask.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QuestionsComponent } from './components/questions/questions.component';
import { NotEligibleComponent } from './components/not-eligible/not-eligible.component';
import { VideouploadComponent } from './components/videoupload/videoupload.component';
import { MatInputModule } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card'
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NotLookingComponent } from './components/not-looking/not-looking.component';
import { CardComponent } from './components/card/card.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserdetailsComponent } from './components/userdetails/userdetails.component';
import {MatTableModule} from '@angular/material/table';

 @NgModule({
  declarations: [
     AppComponent,
    NewComponent,
    UpdationComponent,
    InstRegisterComponent,
    LoginComponent,
    MergeComponent,
    PhotoInputComponent,
    TranscriptionComponent,
    StuRegisterComponent,
    StuLoginComponent,
    StutaskComponent,
    QuestionsComponent,
    NotEligibleComponent,
    NotLookingComponent,
     VideouploadComponent,
     CardComponent,
     DashboardComponent,
     UserdetailsComponent],
  imports: [
     BrowserModule,
     AppRoutingModule,
     HttpClientModule,
      FormsModule,
    WebcamModule,
  MatTabsModule,
  MatIconModule,
  MatInputModule,
  MatButtonModule,
  MatCardModule,
  MatTableModule,
   
 
  MatProgressSpinnerModule,
  BrowserAnimationsModule  ],
  providers: [MyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
