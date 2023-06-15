import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MyService } from 'src/app/new.service';

@Component({
  selector: 'app-stu-login',
  templateUrl: './stu-login.component.html',
  styleUrls: ['./stu-login.component.css']
})
export class StuLoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  stuid: string = '';
  isLoading = false;

  constructor(
    private service: MyService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = false;

    this.login();
  }

  login(): void {
    this.service.stulogin(this.email, this.password).subscribe({
        next: response => {
            console.log(response);
            if (response) {
              
                const stuid = this.email?.substring(0, this.email.indexOf('@')) ?? '';
                alert(`Login Successfull ${this.stuid}`);
                this.router.navigate(['/stutask'], { queryParams: { stuid } });
            }
        },
        error: error => {
            console.error(error);
        }
    });
}

}

 
