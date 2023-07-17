import { Component, OnInit } from '@angular/core';
import { MyService } from 'src/app/new.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { error } from 'console';
@Component({
  selector: 'app-videoupload',
  templateUrl: './videoupload.component.html',
  styleUrls: ['./videoupload.component.css'],
})
export class VideouploadComponent implements OnInit {
  videoName: string = '';
  stuid: string = '';
  transcription: string = '';
  compID = '';
  spellingErrors: any[] | undefined;
  grammaticalErrors: any[] | undefined;
  constructor(
    private service: MyService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.stuid = params['stuid'];
      this.compID = params['id'];
      console.log(this.stuid); // Check if the value is printed in the console
    });
  }

  onSubmit() {
    this.service.uploadcloud(this.videoName, this.stuid).subscribe({
      next: (response: any) => {
        console.log(response);
            if (response) {
            
          alert('Submitted successfully');
          this.submitting = false;
          this.transcription = response.transcription;
                console.log(response);
                console.log(this.transcription)

          this.router.navigate(['/notlook'], {
            queryParams: { stuid: this.stuid, compID: this.compID },
          });
        } else {
          alert('Not submitted');
        }
      },
      error: (error) => {
          console.error(error);
          alert("Ensure that your video name holds that video located in your local desktop path")
      },
    });
  }

  submitting: boolean = false;

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

  jump() {
    this.router.navigate(['/detect'], { queryParams: { stuid: this.stuid } });
  }
}
