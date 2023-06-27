import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MyService } from 'src/app/new.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css'],
})
export class UserprofileComponent implements OnInit {
  stuid: string = '';
  name: string = '';
  gender: string = '';
  phone: null | string = null;
  email: string = '';
  selectedFile: File | null = null;
  profileImageUrl: string = '';

  constructor(
    private service: MyService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.stuid = params['stuid'];
      this.getProfile();
    });
  }

  getProfile() {
    this.service.getprofile(this.stuid).subscribe(
      (response: any) => {
        console.log(response);
        this.name = response[0].name;
        this.gender = response[0].gender;
        this.email = response[0].email;
        this.phone = response[0].phone;
        this.profileImageUrl = response[0].profilePic;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  onSelectFile(event: any) {
    if (event.target?.files?.length) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event) => {
        this.profileImageUrl = event.target?.result as string;
      };
    }
  }

  uploadProfileImage() {
    if (!this.selectedFile) {
      console.error('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', this.selectedFile);

    this.http.post<any>(`/uploadprofile/${this.stuid}`, formData).subscribe(
      (response: any) => {
        console.log('Image uploaded successfully');
      },
      (error: any) => {
        console.error('Error uploading image:', error);
      }
    );
  }
}
