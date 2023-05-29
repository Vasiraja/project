import { Component,OnInit } from '@angular/core';
import { MyService } from 'src/app/new.service';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string | undefined;
  password: string | undefined;
  Inst_name:string="";

  constructor(private service: MyService, private route: ActivatedRoute, private router:Router) {}
  ngOnInit(): void {

this.route.queryParams.subscribe(params => {
    this.Inst_name = params['Inst_name'];
    this.login();
  });

   }
  
  login() {
    this.service.logindata({
      username: this.username,
      password: this.password,
      
    },this.Inst_name).subscribe({
      next: response => {
        console.log(response);
        if(response){
        const userId = this.username?.substring(0, this.username.indexOf('@')) ?? '';
        this.router.navigate(['/tasks'],{ queryParams:{userId}});
      } // redirect to NewComponent with userId as a query parameter
      },
      error: error => {
        console.error(error);
       }
    });
  }
}
