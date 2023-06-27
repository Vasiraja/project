import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MyService } from 'src/app/new.service';

@Component({
  selector: 'app-updation',
  templateUrl: './updation.component.html',
  styleUrls: ['./updation.component.css'],
})
export class UpdationComponent implements OnInit {
  userId: string | undefined;
  Institute: string | undefined;
  AptbeginTime: string | undefined;
  AptendTime: string | undefined;
  no_ofReasoning: number | null = null;
  no_ofEnglish: number | null = null;
  no_ofmajor: number | null = null;
  reasoningmark: number | null = null;
  englishmark: number | null = null;
  majormark: number | null = null;
  result1 = 0;
  result2 = 0;
  result3 = 0;
  result4 = 0;
  total = 0;
  challenge_id: string | undefined;

  constructor(
    private service: MyService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.challenge_id = params['challenge_id'];
      this.userId = params['userId'];
      if (this.challenge_id) {

        this.getchal(this.challenge_id);
       }
    });
  }

  calculateTotal() {
    this.compute1();
    this.compute2();
    this.compute3();
    this.totalval();
  }

  compute1() {
    this.result1 = (this.no_ofReasoning || 0) * (this.reasoningmark || 0);
  }

  compute2() {
    this.result2 = (this.no_ofEnglish || 0) * (this.englishmark || 0);
  }

  compute3() {
    this.result3 = (this.no_ofmajor || 0) * (this.majormark || 0);
  }

  totalval() {
    this.total = this.result1 + this.result2 + this.result3 + this.result4;
  }

  publish(userId: string): void {
    console.log('publish clicked', userId);

    const data = {
      Institute: this.Institute,
      AptbeginTime: this.AptbeginTime,
      AptendTime: this.AptendTime,
      no_ofReasoning: this.no_ofReasoning,
      no_ofEnglish: this.no_ofEnglish,
      no_ofmajor: this.no_ofmajor,
      reasoningmark: this.reasoningmark,
      englishmark: this.englishmark,
      majormark: this.majormark,
      total: this.total,
    };

    this.service.publishdata(data, userId).subscribe((res) => {
      console.log(res);
      alert('Task Added Successfully');

      this.router.navigate(['/tasks'], {
        queryParams: { userId: this.userId },
      });
    });
  }

  getchal(challenge_id:string) {
    this.service.getchallenge(challenge_id).subscribe((res) => {
      console.log(res);
          this.AptbeginTime = res[0].AptbeginTime;
          this.AptendTime = res[0].AptendTime;
          this.Institute = res[0].Institute;
          this.no_ofReasoning = res[0].no_ofReasoning;
          this.no_ofEnglish = res[0].no_ofEnglish;
          this.no_ofmajor = res[0].no_ofmajor;
          this.reasoningmark = res[0].reasoningmark;
          this.englishmark = res[0].englishmark;
      this.majormark = res[0].majormark;
      this.total = res[0].total;
  
    });
  }

  update(challenge_id: string): void {
    const task = {
      challenge_id: this.challenge_id,
      Institute: this.Institute,
      AptbeginTime: this.AptbeginTime,
      AptendTime: this.AptendTime,
      no_ofReasoning: this.no_ofReasoning,
      no_ofEnglish: this.no_ofEnglish,
      no_ofmajor: this.no_ofmajor,
      reasoningmark: this.reasoningmark,
      englishmark: this.englishmark,
      majormark: this.majormark,
    };

    this.service.edittask(task, challenge_id).subscribe((res) => {
      console.log(res);
      alert(`Task: ${challenge_id} ${this.userId} Updated Successfully`);

      this.router.navigate(['/tasks'], {
        queryParams: { userId: this.userId },
      });
    });
  }
}
