import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  showLoginCard: boolean = false;

  toggleLoginCard() {
    this.showLoginCard = !this.showLoginCard;
  }
}
