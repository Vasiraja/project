import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MyService } from 'src/app/new.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {
  stuid: string = '';
  name: string = '';
  gender: string = '';
  phone: null | string = null;
  email: string = '';
  previewSrc: string = '';

  constructor(
    private service: MyService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.stuid = params['stuid'];
      this.getProfile();
    });
  }

  getProfile() {
    this.service.getprofile(this.stuid).subscribe(
      (response) => {
        console.log(response);
        this.name = response[0].name;
        this.gender = response[0].gender;
        this.email = response[0].email;
        this.phone = response[0].phone;
        this.previewSrc = response[0].profilePic; // Assuming you have a 'profilePic' property in the response
      },
      (error) => {
        console.error(error);
      }
    );
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewSrc = e.target.result;
        this.uploadProfilePicture(file);
      };
      reader.readAsDataURL(file);
    }
  }

  uploadProfilePicture(file: File) {
    // Call your service method to upload the profile picture
    this.service.uploadProfilePicture(file).subscribe(
      (response) => {
        console.log('Profile picture uploaded successfully');
      },
      (error) => {
        console.error('Error uploading profile picture:', error);
      }
    );
  }
}
