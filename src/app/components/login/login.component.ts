import { Component, OnInit } from '@angular/core';
import { MyService } from 'src/app/new.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string | undefined;
  password: string | undefined;
  Inst_name: string = "";

  constructor(private service: MyService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.Inst_name = params['Inst_name'];
    });
  }

  login(): void {
    if (!this.email || !this.password) {
      console.error('Email and password are required.');
      return;
    }

    const data = {
      email: this.email,
      password: this.password
    };

    this.service.logindata(data).subscribe(
      response => {
        console.log(response);
        if (response && response.message === 'Login successful') {
          const userId = this.email?.substring(0, this.email.indexOf('@')) ?? '';
          this.router.navigate(['/tasks'], { queryParams: { userId } });
        } else {
          console.error('Invalid credentials');
        }
      },
      error => {
        console.error(error);
        if (error.status === 401) {
          console.error('Invalid credentials');
        } else {
          console.error('An error occurred during login.');
        }
      }
    );
  }
}
