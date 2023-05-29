import { Component } from '@angular/core';
import { MyService } from 'src/app/new.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-stu-register',
  templateUrl: './stu-register.component.html',
  styleUrls: ['./stu-register.component.css']
})
export class StuRegisterComponent {
  name: string='';
  email: string='';
  gender: string='';
  phone: string='';
  password: string='';
  confirmpassword: string='';

  constructor(private service: MyService,private router:Router) {}

  async put() {
    if (!this.name || !this.email || !this.gender || !this.phone || !this.password || !this.confirmpassword) {
      alert('Please fill all required fields');
      return;
    }
    
    if (this.password !== this.confirmpassword) {
      alert('Password and confirm password do not match');
      return;
    }
  
    try {
      const response = await this.service.registerStudent(this.name, this.email, this.gender, this.phone, this.password, this.confirmpassword).toPromise();
      if (response) {
        this.router.navigate(['/stulogin']);
        alert('Registration successful');
        console.log('successfully: ', response);

      }
    } catch (error) {
      console.error('Error registering: ', error);
    }
  }
  



  
  
  
}
