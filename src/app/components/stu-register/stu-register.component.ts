import { Component } from '@angular/core';
import { MyService } from 'src/app/new.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stu-register',
  templateUrl: './stu-register.component.html',
  styleUrls: ['./stu-register.component.css']
})
export class StuRegisterComponent {
  name = '';
  email = '';
  gender = '';
  phone = '';
  password = '';
  confirmpassword = '';
  img: File | undefined;
  imgPreview: string | ArrayBuffer | null = null;

  constructor(private service: MyService, private router: Router) {}
  handleImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.img = input.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.imgPreview = reader.result;
    };
    reader.readAsDataURL(this.img);
  }

  cancelImageUpload() {
    this.img = undefined;
    this.imgPreview = null;
  }
 
  put() {
    if (!this.name || !this.email || !this.gender || !this.phone || !this.password || !this.confirmpassword) {
      alert('Please fill all required fields');
      return;
    }

    if (this.password !== this.confirmpassword) {
      alert('Password and confirm password do not match');
      return;
    }

    if (!this.img) {
      alert('Please select an image');
      return;
    }
  
    this.service.registerStudent(this.img, this.name, this.email, this.gender, this.phone, this.password, this.confirmpassword)
      .subscribe(
        (response: any) => {
          this.router.navigate(['/stulogin']);
          alert('Registration successful');
          console.log('Successfully registered: ', response);
        },
        (error: any) => {
          console.error('Error registering: ', error);
        }
      );
  }
}
