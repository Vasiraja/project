// auth.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;

  constructor() { }

  login() {
    // Perform the login logic here
    this.loggedIn = true;
  }

  logout() {
    // Perform the logout logic here
    this.loggedIn = false;
  }

  isLoggedIn() {
    return this.loggedIn;
  }
}
