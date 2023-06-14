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
   constructor(
    private service: MyService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
name:string=''
gender:string=''
phone:null=null
email:string=''
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
        this.name=response[0].name;
        this.gender=response[0].gender;
        this.email=response[0].email;
        this.phone=response[0].phone;
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
