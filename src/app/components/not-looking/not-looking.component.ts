import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MyService } from 'src/app/new.service';
import { minus } from './minus';

@Component({
  selector: 'app-not-looking',
  templateUrl: 'not-looking.component.html',
})
export class NotLookingComponent {
  facedetectCount: string = '';
  notLookingCount: string = '';
  voicecount: string = '';
  fluency: string = '';
  spell: string = '';
  grammer: string = '';
  stuid: string = '';
  userId: string = '';
  isloading: boolean = true;
  minus: minus | null = null;
  quizScore: number = 0;

  constructor(private route: ActivatedRoute, private service: MyService) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.stuid = params['stuid'];
      this.userId = params['compID'];
      console.log(this.userId);

     
      this.get();
      this.getminus();
    });
  }
  get() {
    this.service.getcloudresults(this.stuid).subscribe({
      next: (response: any) => {
        this.isloading = false;
        this.facedetectCount = response.facedetectCount;
        this.notLookingCount = response.notLookingCount;
        this.voicecount = response.noofvoices;
        this.fluency = response.fluency;
        this.spell = '4';
        this.grammer = '5';

        this.performCalculations();
      },
      error: (error) => {
        console.error('Error retrieving Python results:', error);
      },
    });
  }
  getminus() {
    this.service.getminus(this.userId).subscribe(
      (response: minus[]) => {
        if (response && response.length > 0) {
          this.minus = response[0];
          console.log('Minus Data:', this.minus);
          this.performCalculations();
        }
      },
      (error) => {
        console.error('Error retrieving minus data:', error);
      }
    );
  }

  
performCalculations() {
  console.log('perform');
  console.log(this.facedetectCount)
  console.log(this.notLookingCount)
  console.log(this.voicecount)
  console.log(this.fluency)
  console.log(this.minus)

  if (
    this.minus &&
    this.facedetectCount &&
    this.notLookingCount &&
    this.voicecount &&
    this.fluency
  ) {
    console.log(this.minus.facedetectminus);
    const faceMarks = parseInt(this.minus.facedetectminus) * parseInt(this.facedetectCount);
    const notLookingMarks = parseInt(this.minus.notlookcameraminus) * parseInt(this.notLookingCount);
    const voiceMarks = parseInt(this.minus.voicedetectminus) * parseInt(this.voicecount);
    const grammerMarks = parseInt(this.minus.gramminus) * parseInt(this.grammer);
    const spellmarks=parseInt(this.spell)
    const fluencyMarks = Math.floor(parseInt(this.fluency)) / 10;
    const total = 90 - (faceMarks + notLookingMarks + voiceMarks + grammerMarks);
    const grandTotal = total + fluencyMarks;
    this.quizScore = this.service.getQuizScore();

    console.log(
      'Face Marks:', faceMarks,
      'Not Looking Marks:', notLookingMarks,
      'Voice Marks:', voiceMarks,
      'Grammer Marks:', grammerMarks,
      'Fluency Marks:', fluencyMarks,
      'Total:', total,
      'Grand Total:', grandTotal,
      'AptiScore:', this.quizScore
    );

    const postData = {
      stuid: this.stuid,
      aptiscore: this.quizScore,
      fluency: fluencyMarks,
      compId: this.userId,
      totalmarks: grandTotal,
      facedetections: faceMarks,
      notlook: notLookingMarks,
      voice: voiceMarks,
      gram: grammerMarks,
      spell:spellmarks
    };

      this.service.postuser(postData).subscribe(
        (response: any) => {
          console.log('User details inserted successfully:', response);
        },
        (error) => {
          console.error('Error inserting user details:', error);
        }
      );
    }
  }
}
//________________________________________________________-
