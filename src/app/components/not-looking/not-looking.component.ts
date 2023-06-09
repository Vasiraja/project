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

  constructor(private route: ActivatedRoute, private service: MyService) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.stuid = params['stuid'];
      this.userId = params['compID'];
      console.log(this.userId);

      this.getminus();
      this.getPythonResults();
    });
  }

  getPythonResults() {
    this.service.getPythonResults(this.stuid).subscribe({
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

    if (
      this.minus &&
      this.facedetectCount &&
      this.notLookingCount &&
      this.voicecount &&
      this.fluency
    ) {
      console.log(this.minus.facedetectminus);
      const faceMinus = parseInt(this.minus.facedetectminus);
      const notLookingMinus = parseInt(this.minus.notlookcameraminus);
      const voiceminus = parseInt(this.minus.voicedetectminus);
      const gramMinus = parseInt(this.minus.gramminus);

      const facetotal = faceMinus * parseInt(this.facedetectCount);
      const notlooktotal = notLookingMinus * parseInt(this.notLookingCount);
      const voicetotal = voiceminus * parseInt(this.voicecount);
      const gramtotal = gramMinus * parseInt(this.grammer);
      const fluencymark = (Math.floor(parseInt(this.fluency)))/10;
      const total =
        90 - (facetotal + notlooktotal + voicetotal + gramtotal);
      const grandtotal = total + fluencymark;

      console.log(
        'Face Total:', facetotal,
        'Not Looking Total:', notlooktotal,
        'Voice Total:', voicetotal,
        'Gram Total:', gramtotal,
        'Fluency Mark:', fluencymark,
        'Total:', total,
        "finaltotal",grandtotal
      );
    }
  }
}
