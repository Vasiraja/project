import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MyService } from 'src/app/new.service';
@Component({
  selector: 'app-admininput',
  templateUrl: './admininput.component.html',
  styleUrls: ['./admininput.component.css']
})
export class AdmininputComponent implements OnInit {
facedetectminus: any;
voicedetectminus: any;
notlookcameraminus: any;
 gramminus: any;
userId:any;
 

constructor(private service:MyService,private route:ActivatedRoute,private router:Router){}
  ngOnInit(): void {


    this.route.queryParams.subscribe(params=>{
this.userId=params['userId'];
   
    })
   }





submitForm() {
  const formData = {
    facedetectminus: this.facedetectminus,
    voicedetectminus: this.voicedetectminus,
    notlookcameraminus: this.notlookcameraminus,
     gramminus: this.gramminus
  };




  this.service.minusdata(formData,this.userId)
    .subscribe(
      (response) => {
        console.log('Form submitted successfully');
        alert("updated successfully");
        this.router.navigate(['/tasks'], {queryParams: {userId:this.userId}});
 
        // Handle any additional logic or UI updates after form submission
      },
      (error) => {
        console.error('Error submitting form:', error);

        // Handle error and display error message to the user
      }
    );
}
}