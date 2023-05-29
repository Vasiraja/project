
// ---------------------------------------------
import { Component } from '@angular/core';
import { tasks } from './stutask';
import { MyService } from 'src/app/new.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-stutask',
  templateUrl: './stutask.component.html',
  styleUrls: ['./stutask.component.css']
})
export class StutaskComponent {
  tasks: tasks[] = [];
  dec = 2;
  isLoading = false;
   stuid = '';
no_ofReasoning:string='';
no_ofEnglish:string='';
no_ofmajor:string='';
  constructor(
    private myService: MyService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {  
    this.route.queryParamMap.subscribe(params => {
      this.stuid = params.get('stuid') || '';
       this.gettasks();
    });
  }

  gettasks(): void {
    this.myService.gettasks().subscribe(tasks => this.tasks = tasks);     
  }

  attendtask(stuid: string, challenge_id: any,no_ofReasoning:number,no_ofEnglish:number,no_ofmajor:number): void {
    if (this.stuid && challenge_id) {
      this.router.navigate(['/questions'], {
        queryParams: { stuid: this.stuid, challenge_id: challenge_id ,no_ofReasoning:no_ofReasoning,no_ofEnglish:no_ofEnglish,no_ofmajor:no_ofmajor}
       });
    }
  }
  
}
