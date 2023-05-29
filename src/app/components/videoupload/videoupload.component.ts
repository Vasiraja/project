import { Component, OnInit } from '@angular/core';
import { MyService } from 'src/app/new.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-videoupload',
  templateUrl: './videoupload.component.html',
  styleUrls: ['./videoupload.component.css']
})
export class VideouploadComponent implements OnInit {
  gitlink: string = '';  
  stuid: string = '';
  transcription: string = '';
  
   spellingErrors: any[] | undefined;
  grammaticalErrors: any[] | undefined;
  constructor(
    private service: MyService,
    private route: ActivatedRoute,
    private router:Router
  ) {}

  ngOnInit() {
     this.route.queryParams.subscribe(params => {
      this.stuid = params['stuid'];
      console.log(this.stuid); // Check if the value is printed in the console
     });
  }
  

  onSubmit() {
    this.service.uploadVideo(this.gitlink, this.stuid).subscribe({
      next: response => {
         if (response) {
          console.log(response);
          if(this.gitlink && this.stuid){
          alert("submitted successfully")
          }else{
            alert("not submitted")
          }
         }
      },
      error: error => {
        console.error(error);
      }
    });
  }

  

  submitting: boolean = false;

  

      submit() {
        this.submitting=true;
        this.service.gettextresult(this.stuid).subscribe({
          next: (response:any) => {
            this.submitting=false;
            this.transcription = response.transcription;
            console.log(response)
            alert("Uploaded Successfully..")
            
              this.router.navigate(['/notlook'], { queryParams: { stuid: this.stuid } });
            
            
           },
          error: (error) => {
            this
            console.error('Error retrieving Python results:', error);
          }
        });
      }
      // fetchNotLookingCount() {
      //   if (this.stuid) {
      //     this.service.getNotLookingCount(this.stuid).subscribe({
      //       next: (response: any) => {
      //         this.notLookingCount = response.notLookingCount;
      //       },
      //       error: (error: any) => {
      //         console.error('Error fetching not looking count:', error);       
       
      //       }
      //     });
      //   }
      // }
      
        




    
  jump(){
    this.router.navigate(['/detect'],{ queryParams:{stuid:this.stuid}});

  }
}  
