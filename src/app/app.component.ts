import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'auth.service';
 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'project';
  loading = false;

  constructor(private authService: AuthService, private router: Router) { }

  getData() {
    this.loading = true;
    // make an HTTP request or load some data
    // once the data is loaded, set loading to false to hide the spinner
    this.loading = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/dashboard']);
  }
}
