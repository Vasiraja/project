import { Component, OnInit } from '@angular/core';
import { MyService } from 'src/app/new.service';
import { ActivatedRoute, Router } from '@angular/router';

import { tasks } from './stutask';

@Component({
  selector: 'app-stutask',
  templateUrl: './stutask.component.html',
  styleUrls: ['./stutask.component.css']
})
export class StutaskComponent implements OnInit {
  tasks: tasks[] = [];
  stuid = '';

  constructor(
    private myService: MyService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.stuid = params.get('stuid') || '';
      this.getTasks();
    });
  }

   

  getTasks(): void {
    this.myService.gettasks().subscribe((tasks) => {

      this.tasks = tasks;
    });
  }

  attendTask(task: tasks): void {
    const { challenge_id, no_ofReasoning, no_ofEnglish, no_ofmajor, comp_id,reasoningmark,englishmark,majormark,total } = task;
    if (this.stuid && challenge_id) {
      this.router.navigate(['/questions'], {
        queryParams: {
          stuid:this.stuid,
          challenge_id,
          no_ofReasoning,
          no_ofEnglish,
          no_ofmajor,
reasoningmark,
englishmark,majormark,  
total,        
          comp_id
        }
      });
    }
  }
}
