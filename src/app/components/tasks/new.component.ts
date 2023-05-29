import { Component, OnInit } from '@angular/core';
import { tasks } from './new';
import { MyService } from '../../new.service';
import { ActivatedRoute ,Router} from '@angular/router';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {
  tasks: tasks[] = [];
  dec = 2;
  userId = ''; // set default value to empty string
  challenge_id = '';
  edit='';
   task:any={};
  constructor(private myService: MyService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.challenge_id=params['challenge_id'];
      this.userId = params['userId']; // set userId to the value of "userId" query parameter, or empty string if it is null
      this.getValues();
    });
  
 }

  getValues(): void {
    this.myService.getValues(this.userId).subscribe(tasks => this.tasks = tasks);
  }

  deleteTask(challenge_id: string): void {
    this.myService.deleteTask(challenge_id).subscribe({
      next: () => {
        console.log('Task deleted successfully');
        // reload the same page
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate(['/tasks'], {queryParams: {userId: this.userId}});
        });
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

 edittasks(challenge_id:string): void {
  challenge_id=this.task.challenge_id;
    this.myService.edittask(this.tasks,this.challenge_id).subscribe(() => {
      console.log('Task updated successfully');
      this.router.navigate(['/tasks']);
    });
  }
  
  
}
