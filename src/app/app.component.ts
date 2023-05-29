import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'project';
  loading = false;

  getData() {
    this.loading = true;
    // make an HTTP request or load some data
    // once the data is loaded, set loading to false to hide the spinner
    this.loading = false;
  }
}
