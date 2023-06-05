import { Component, OnInit } from '@angular/core';
import { MyService } from 'src/app/new.service';
import { user } from './user';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-userdetails',
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.css']
})
export class UserdetailsComponent implements OnInit {
 
  displayedColumns: string[] = ['stuId', 'video_link', 'fluency', 'notlook', 'aptiscore', 'gram', 'spell', 'facedetections', 'Totalmarks','compId'];
  user: user[] = [];
  userId:string='';
 
  constructor(private service: MyService,private route:ActivatedRoute) {}
 
  ngOnInit(): void {
    this.getUsers();
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId']; // set userId to the value of "userId" query parameter, or empty string if it is null
     this.getUsers();
   });
    
  }

  getUsers() {
    this.service.getdetails(this.userId).subscribe(
      (response: any) => {
        console.log(response);
        this.user = response;
        console.log(this.user);
      },
      (error: any) => {
        console.error('Error retrieving user details: ', error);
      }
    );

  }
}

 
