import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MyService } from 'src/app/new.service';

 
@Component({
  selector: 'app-updation',
  templateUrl: './updation.component.html',
  styleUrls: ['./updation.component.css']
})
export class UpdationComponent {
  userId: string | undefined; // define a userId property and initialize it to null
  //  name:string | undefined|null=null;
  //  challenge_id:string | undefined|null=null;
  input1: number = 0;
  input2: number = 0;
  input3: number = 0;
  input4: number = 0;
  input5: number = 0;
  input6: number = 0;
  input7: number = 0;
  input8: number = 0;
  result1: number = 0;
  result2: number = 0;
  result3: number = 0;
  result4: number = 0;
  totals: number | undefined;

   challenge_id: string | undefined;
  Institute: string | undefined;
  AptbeginTime: string | undefined;
  AptendTime: string | undefined;
  no_ofReasoning: string | undefined;
  no_ofEnglish: string | undefined;
  no_ofmajor: string | undefined;
  no_ofothers: string | undefined;
  reasoningmark: string | undefined;
  englishmark: string | undefined;
  majormark: string | undefined;
  othermarks: string | undefined;
  comp_id: string | undefined;
  total:string|undefined;
  totalmarks:string|undefined;
  taskId:string='';
  router: any;

    
  constructor(private service:MyService,private route: ActivatedRoute) {}
 


  
  



  ngOnInit() {
    this.route.params.subscribe(params => {
      this.taskId = params['comp_id'];  
     });
  }
   oninput1(event: Event) {
    this.input1 = +(event.target as HTMLInputElement).value;
    this.compute1();
    this.totalval();
  }
  
  oninput2(event: Event) {
    this.input2 = +(event.target as HTMLInputElement).value;
    this.compute1();
    this.totalval();
  }
  
  compute1() {
    this.result1 = this.input1 * this.input2;
  }
  
  oninput3(event: Event) {
    this.input3 = +(event.target as HTMLInputElement).value;
    this.compute2();
    this.totalval();
  }
  
  oninput4(event: Event) {
    this.input4 = +(event.target as HTMLInputElement).value;
    this.compute2();
    this.totalval();
  }
  
  compute2() {
    this.result2 = this.input3 * this.input4;
  }
  
  oninput5(event: Event) {
    this.input5 = +(event.target as HTMLInputElement).value;
    this.compute3();
    this.totalval();
  }
  
  oninput6(event: Event) {
    this.input6 = +(event.target as HTMLInputElement).value;
    this.compute3();
    this.totalval();
  }
  
  compute3() {
    this.result3 = this.input5 * this.input6;
  }
  
  oninput7(event: Event) {
    this.input7 = +(event.target as HTMLInputElement).value;
    this.compute4();
    this.totalval();
  }
  
  oninput8(event: Event) {
    this.input8 = +(event.target as HTMLInputElement).value;
    this.compute4();
    this.totalval();
  }
  
  compute4() {
    this.result4 = this.input7 * this.input8;
  }

  totalval() {
    this.totals = this.result1 + this.result2 + this.result3 + this.result4;
   }
   
 
   publish() {
     const data = {
       challenge_id: this.challenge_id,
       Institute: this.Institute,
       AptbeginTime: this.AptbeginTime,
       AptendTime: this.AptendTime,
       no_ofReasoning: this.no_ofReasoning,
       no_ofEnglish: this.no_ofEnglish,
       no_ofmajor: this.no_ofmajor,
       no_ofothers: this.no_ofothers,
       reasoningmark: this.reasoningmark,
       englishmark: this.englishmark,
       majormark: this.majormark,
       othermarks: this.othermarks,
        total:this.total,
       totalmarks:this.totalmarks
     };
     this.service.publishdata(data, this.taskId).subscribe(response => {
      console.log(this.taskId);
       console.log(response);
     });
   }
 }