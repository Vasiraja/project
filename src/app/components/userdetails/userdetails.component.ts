import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { MyService } from 'src/app/new.service';
import { User } from './user';

@Component({
  selector: 'app-userdetails',
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.css']
})
export class UserdetailsComponent implements OnInit {
  displayedColumns: string[] = [
    'stuid',
    'fluency',
    'notlook',
    'aptiscore',
    'gram',
    'spell',
    'facedetections',
    'totalmarks',
    'userId'
  ];
  user: User[] = [];
  userId: string = '';

  constructor(private service: MyService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'] || '';
      this.getUsers();
    });
  }

  getUsers() {
    this.service.getdetails(this.userId).subscribe(
      (response: User[]) => {
        console.log(response);
        this.user = response;
        console.log(this.user);
      },
      (error: any) => {
        console.error('Error retrieving user details: ', error);
      }
    );
  }

  isLinkColumn(column: string): boolean {
    return column === 'stuid';
  }

  navigateToUserProfile(stuid: string): void {
    this.router.navigate(['/userprofile'], { queryParams: { stuid } });
  }

  downloadData(): void {
    // Convert the table data to Excel workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(this.user, { header: this.displayedColumns });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Generate a Blob object from the workbook
    const excelBlob = this.workbookToExcelBlob(workbook);

    // Save the Blob as a file
    saveAs(excelBlob, `${this.userId}.xlsx`);
  }

  private workbookToExcelBlob(workbook: XLSX.WorkBook): Blob {
    // Convert workbook to binary string
    const excelData = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

    // Convert binary string to ArrayBuffer
    const buffer = new ArrayBuffer(excelData.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < excelData.length; i++) {
      view[i] = excelData.charCodeAt(i) & 0xff;
    }

    // Create a Blob object from the ArrayBuffer
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
}
