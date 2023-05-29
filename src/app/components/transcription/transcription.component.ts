import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MyService } from 'src/app/new.service';

@Component({
  selector: 'app-transcription',
  templateUrl: './transcription.component.html'
})
export class TranscriptionComponent {
  text: string='';
  textId: string='';

  constructor(private route: ActivatedRoute, private service: MyService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['textId']) {
        this.textId = params['textId'];
        this.get();
      }
    });
  }
  

  get() {
    if (!this.textId) return;
    this.service.getText(this.textId).subscribe(data => {
      this.text = data;
    });
  }
}
