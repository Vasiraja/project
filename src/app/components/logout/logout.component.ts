// logout.component.ts

import { Component, OnInit } from '@angular/core';
import { AuthService } from 'auth.service';
@Component({
  selector: 'app-logout',
  template: `
    <h2>Logout</h2>
    <p>Click to go back to the login page.</p>
  `
})
export class LogoutComponent implements OnInit {
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.logout();
    
  }
}
