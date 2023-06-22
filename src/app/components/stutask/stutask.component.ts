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
  tasks:any= [];
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
    const { challenge_id, no_ofReasoning, no_ofEnglish, no_ofmajor, comp_id, reasoningmark, englishmark, majormark,totalmarks, AptbeginTime, AptendTime } = task;
  
    if (this.stuid && challenge_id) {
      const beginTimeParts = AptbeginTime.split(':');
      const endTimeParts = AptendTime.split(':');
  
      const beginTime = new Date();
      beginTime.setHours(parseInt(beginTimeParts[0], 10));
      beginTime.setMinutes(parseInt(beginTimeParts[1], 10));
      const endTime = new Date();
      endTime.setHours(parseInt(endTimeParts[0], 10));
      endTime.setMinutes(parseInt(endTimeParts[1], 10));
  
      const duration = endTime.getTime() - beginTime.getTime();
      console.log(duration);
  
      if (!isNaN(duration) && duration > 0) {
        this.router.navigate(['/questions'], {
          queryParams: {
            stuid: this.stuid,
            challenge_id,
            no_ofReasoning,
            no_ofEnglish,
            no_ofmajor,
            reasoningmark,
            englishmark,
            majormark,
            
            totalmarks,
            comp_id,
            duration
          }
        });
      } else {
        console.error('Invalid duration:', duration);
      }
    }
  }
}
