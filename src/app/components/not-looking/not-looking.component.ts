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
      console.log(this.userId) ;
           this.performCalculations();

            this.getminus();

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
        // this.spell = response.spell;
        // this.grammer = response.grammer;
        this.spell = '4';
        this.grammer = '5';
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
          // Perform calculations using the values
         

        }
      },
      (error) => {
        console.error('Error retrieving minus data:', error);
      }
    );
 
   }

   performCalculations() {
    console.log("perform");

    if (
      this.minus &&
      this.facedetectCount &&
      this.notLookingCount &&
      this.voicecount &&
      this.fluency
    ) {
      const faceMinus = parseInt(this.minus.faceminus);
      const notLookingMinus = parseInt(this.minus.notlookminus);
      const voiceminus = parseInt(this.minus.voiceminus);
      const gramMinus = parseInt(this.minus.gramminus);

      const facetotal = faceMinus * parseInt(this.facedetectCount);
      const notlooktotal = notLookingMinus * parseInt(this.notLookingCount);
      const voicetotal = voiceminus * parseInt(this.voicecount);
      const gramtotal = gramMinus * parseInt(this.grammer);
      const fluencymark = Math.floor(parseInt(this.fluency));
      const total = 90 - (facetotal + notlooktotal + voicetotal + gramtotal);
      const grandtotal = total + fluencymark;

      console.log(
        'Face Total:', facetotal,
        'Not Looking Total:', notlooktotal,
        'Voice Total:', voicetotal,
        'Gram Total:', gramtotal,
        'Fluency Mark:', fluencymark,
        'Total:', total
      );
    }
  }
}
