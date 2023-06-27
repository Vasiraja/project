import { Component, OnInit } from '@angular/core';
import { tasks } from './new';
import { MyService } from '../../new.service';
import { ActivatedRoute, Router } from '@angular/router';
 

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css'],
})
export class NewComponent implements OnInit {
  tasks: tasks[] = [];
  

   // set default value to empty string
  userId = '';
  edit = '';
  task: any = {};

  constructor(
    private myService: MyService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.userId = params['userId']; // set userId to the value of "userId" query parameter, or empty string if it is null
      this.getValues();
    });
  }

  getValues(): void {
    this.myService
      .getValues(this.userId)
      .subscribe((tasks) => (this.tasks = tasks));
  }

  deleteTask(challenge_id: string): void {
    this.myService.deleteTask(challenge_id).subscribe({
      next: () => {
        console.log('Task deleted successfully');
        // reload the same page
        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => {
            this.router.navigate(['/tasks'], {
              queryParams: { userId: this.userId },
            });
          });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  jump(challenge_id: string): void {
    this.router.navigate(['/update'], {
      queryParams: { challenge_id: challenge_id, userId: this.userId },
    });
  }
  openinput(userId: string): void {
    this.router.navigate(['/admininput'], { queryParams: { userId: userId } });
  }
  jumpuser(userId: string): void {
    this.router.navigate(['/update'], { queryParams: { userId: userId } });
  }
  openUserInfoModal(userId: string) {
    this.router.navigate(['userdetails'], { queryParams: { userId: userId } });
  }
}
