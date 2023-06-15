import { Component } from '@angular/core';
import { MyService } from 'src/app/new.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stu-register',
  templateUrl: './stu-register.component.html',
  styleUrls: ['./stu-register.component.css']
})
export class StuRegisterComponent {
  name: string = '';
  email: string = '';
  gender: string = '';
  phone: string = '';
  password: string = '';
  confirmpassword: string = '';

  constructor(private service: MyService, private router: Router) {}

  put() {
    if (!this.name || !this.email || !this.gender || !this.phone || !this.password || !this.confirmpassword) {
      alert('Please fill all required fields');
      return;
    }

    if (this.password !== this.confirmpassword) {
      alert('Password and confirm password do not match');
      return;
    }

    this.service.registerStudent(this.name, this.email, this.gender, this.phone, this.password, this.confirmpassword)
      .subscribe(
        (response: any) => {
          this.router.navigate(['/stulogin']);
          alert('Registration successful');
          console.log('Successfully registered: ', response);
        },
        (error: any) => {
          if (error.error.code === 'ER_DUP_ENTRY') {
            alert('Username already exists');
          } else {
            console.error('Error registering: ', error);
          }
        }
      );
  }
}
