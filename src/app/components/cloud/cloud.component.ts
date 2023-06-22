import { Component, OnInit, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MyService } from 'src/app/new.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
@Component({
  selector: 'app-cloud',
  templateUrl:'./cloud.component.html',
  styleUrls: ['./cloud.component.css'],
})
export class CloudComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  
}
//   selectedVideo: File | undefined;
//   userid = '';
//   constructor(private service: MyService, private route:ActivatedRoute) {}
//   ngOnInit(): void {
//     this.route.queryParams.subscribe(params => {
//       this.userid = params["userid"];
// })
//    }

//   onFileSelected(event: any) {
//     const file = event.target.files?.[0];
//     if (file) {
//       this.selectedVideo = file;
//     } else {
//       console.log('No file selected.');
//     }
//   }

//   onUpload() {
//     if (this.selectedVideo) {
//       this.service.uploadcloud(this.selectedVideo,this.userid).subscribe(
//         (response) => {
//           console.log('Video uploaded successfully:', response);
//           // Handle successful upload response here
//         },
//         (error) => {
//           console.error('Error uploading video:', error);
//           // Handle error response here
//         }
//       );
//     } else {
//       console.log('No video selected.');
//     }
//   }
// }
