import { Component, OnInit } from '@angular/core';
import { MyService } from 'src/app/new.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css']
})
export class UserdashboardComponent implements OnInit {
  headerInformation: any[] = []; // Define the headerInformation property
  adminid: any;
  header: any;
  content: any;
  link: any;

  constructor(
    private service: MyService,
    private route: ActivatedRoute,
    private router: Router
  ) {} // Inject the data service

  ngOnInit(): void {
    this.fetchHeaderInformation();
    this.route.queryParams.subscribe(params => {
      this.adminid = params['adminid'];
    });
  }

  fetchHeaderInformation(): void {
    this.service.getinformation().subscribe(
      (data: any[]) => {
        this.headerInformation = data;
      },
      (error) => {
        console.error('Error fetching header information:', error);
      }
    );
  }

  addinformation(): void {
    const infodata = {
      header: this.header,
      content: this.content,
      link: this.link
    };
    this.service.postinfo(infodata).subscribe(
      (res) => {
        console.log(res);
        this.router.navigate(['/userdashboard'],{queryParams:{adminid:this.adminid}})

        this.fetchHeaderInformation();
        
      },
      (error) => {
        console.error('Error adding information:', error);
      }
    );
  }

  delinfo(id: any): void {
    this.service.deleteinfo(id).subscribe(
      () => {
        console.log('Info deleted successfully');
        // Reload the same page
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/userdashboard'], { queryParams: { adminid: this.adminid } });
        });
      },
      (error) => {
        console.error('Error deleting information:', error);
      }
    );
  }
}
