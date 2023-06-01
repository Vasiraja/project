import { Component, OnInit } from '@angular/core';
import { MyService } from 'src/app/new.service';
import { user } from './user';

@Component({
  selector: 'app-userdetails',
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.css']
})
export class UserdetailsComponent implements OnInit {
 
  displayedColumns: string[] = ['stuId', 'video_link', 'fluency', 'notlook', 'aptiscore', 'gram', 'spell', 'facedetections', 'Totalmarks','compId'];
  user: user[] = [];
 
  constructor(private service: MyService) {}
 
  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.service.getdetails().subscribe(
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
