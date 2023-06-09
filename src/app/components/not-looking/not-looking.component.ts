import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MyService } from 'src/app/new.service';
 

@Component({
  selector: 'app-not-looking',
  templateUrl: 'not-looking.component.html',
})
export class NotLookingComponent {
//   notLookingCount: number =0;
//   stuid: any = '';

//   constructor(private route: ActivatedRoute, private service: MyService) {}

//   ngOnInit() {
    
//     this.route.queryParams.subscribe(params=>{
//       this.stuid=params["stuid"];
//       this.fetchNotLookingCount();

//     })
 
//       console.log(this.stuid)

  
//   }
 
//  fetchNotLookingCount(): void {
//   this.service.getNotLookingCount(this.stuid).subscribe({
//     next: (response: any) => {
//        this.notLookingCount = response.notLookingCount;
//       console.log('Not Looking Count:', this.notLookingCount);
//       // Do further processing or display the value in your Angular template
//     },
//     error: (error) => {
//       console.error('Error retrieving not looking count:', error);
//       // Handle the error case
//     }
//   });
// }




facedetectCount: string = '';
notLookingCount: string = '';
voicecount:string='';
fluency:string='';
spell:string='';
grammer:string='';
stuid:string='';

isloading:boolean=true;
constructor(private route: ActivatedRoute, private service: MyService) {}

  ngOnInit() {
    
    this.route.queryParams.subscribe(params=>{
      this.stuid=params["stuid"];
      this.getPythonResults();

      

    })
  }
 
getPythonResults() {

  this.service.getPythonResults(this.stuid).subscribe({    

  next: (response:any) => {
      this.isloading=false;
      this.facedetectCount = response.facedetectCount;
      this.notLookingCount = response.notLookingCount;
      this.voicecount=response.noofvoices;
      this.fluency=response.fluency;
      // this.spell=response.spell;
      // this.grammer=response.grammer;
      this.spell="4";
      this.grammer="5";






      
    
    },
    error: (error) => {
      console.error('Error retrieving Python results:', error);
    }
  });



  
}






}

function calcee() {
  throw new Error('Function not implemented.');
}
