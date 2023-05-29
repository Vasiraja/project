import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MyService } from 'src/app/new.service';


@Component({
  selector: 'app-not-eligible',
  templateUrl: './not-eligible.component.html',
  styleUrls: ['./not-eligible.component.css']
})
export class NotEligibleComponent implements OnInit{

  stuid:string|undefined;


  constructor(private service:MyService,private route:ActivatedRoute){}
  ngOnInit(): void { 
    this.route.queryParams.subscribe(params => {
    this.stuid = params['stuid'];
  })
   }

   

  
 
}
