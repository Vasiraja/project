import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tasks } from './components/tasks/new';

@Injectable({
  providedIn: 'root',
})
export class MyService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  private quizScore: number = 0;

  private register = 'http://localhost:3000/api/register';
  private vidurl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getdetails(userId: string): Observable<any> {
    const url = `http://localhost:3000/userdetails/${userId}`;
    return this.http.get<any>(url);
  }
  getinformation(): Observable<any> {
    const url = 'http://localhost:3000/getinformation';
    return this.http.get<any>(url);
  }

  getprofile(stuid: string): Observable<any> {
    const url = `http://localhost:3000/userprofile/${stuid}`;
    return this.http.get<any>(url);
  }

  getValues(userId: string): Observable<tasks[]> {
    const apiUrl = `http://localhost:3000/api/challenges/${userId}`;
    return this.http.get<tasks[]>(apiUrl);
  }
  getchallenge(challenge_id: string): Observable<tasks[]> {
    const geturl = `http://localhost:3000/challenges/${challenge_id}`;
    return this.http.get<tasks[]>(geturl);
  }
  deleteTask(challenge_id: string): Observable<{}> {
    const url = `http://localhost:3000/api/challenges/${challenge_id}`;
    return this.http.delete(url, this.httpOptions);
  }

  createdata(data: any): Observable<any> {
    return this.http.post(`${this.register}`, data);
  }

  logindata(data: any): Observable<any> {
    const login = 'http://localhost:3000/api/login';
    return this.http.post(login, data);
  }

  publishdata(data: any, userId: string): Observable<any> {
    const apiUrl = `http://localhost:3000/api/update/${userId}`;
    return this.http.post(apiUrl, data);
  }

  edittask(task: any, challenge_id: string): Observable<any> {
    const editurl = `http://localhost:3000/api/challenges/${challenge_id}`;
    return this.http.put(editurl, task);
  }

  getText(textId: string): Observable<any> {
    const textUrl = `http://localhost:3000/transcribe/${textId}`;
    return this.http.get(textUrl);
  }

  minusdata(formData: any, userId: string): Observable<any> {
    const url = `http://localhost:3000/minus/${userId}`;
    return this.http.post(url, formData);
  }

  getminus(userId: string): Observable<any> {
    const url = `http://localhost:3000/getminus/${userId}`;
    return this.http.get(url);
  }

  setQuizScore(quizScore: number): void {
    this.quizScore = quizScore;
  }

  getQuizScore(): number {
    return this.quizScore;
  }
  //----------------------_______________students_________________-----------------------//

  registerStudent(
    name: string,
    email: string,
    gender: string,
    phone: string,
    password: string,
    confirmpassword: string
  ) {
    const url = 'http://localhost:3000/api/sturegister';
    const data = { name, email, gender, phone, password, confirmpassword };
    return this.http.post(url, data, { responseType: 'json' });
  }

  stulogin(email: string, password: string): Observable<any> {
    const login = 'http://localhost:3000/api/stulogin';
    return this.http.post(login, { email, password });
  }

  getProfile(stuid: string): Observable<any> {
    const url = `${this.vidurl}/api/getProfile?id=${stuid}`;
    return this.http.get(url);
  }

  gettasks(): Observable<tasks[]> {
    const geturl = `http://localhost:3000/api/challenges`;
    return this.http.get<tasks[]>(geturl);
  }

  uploadcloud(videoName: string, stuId: string) {
    const url = `${this.vidurl}/upload/${stuId}`;
    return this.http.post(url, { videoName }, { responseType: 'json' });
  }
  postaccess(
    bucket_name: string,
    secret_access_key: string,
    access_key: string,
    region: string
  ) {
    const url = `${this.vidurl}/postaccess`;
    const data = { bucket_name, secret_access_key, access_key, region };
    return this.http.post(url, data, { responseType: 'json' });
  }
  getReasoningQuestions(amount: number, difficulty: string): Observable<any> {
    const url = `https://opentdb.com/api.php?amount=${amount}&category=10&difficulty=${difficulty}&type=multiple`;
    return this.http.get(url);
  }

  getEnglishQuestions(amount: number, difficulty: string): Observable<any> {
    const url = `https://opentdb.com/api.php?amount=${amount}&category=23&difficulty=${difficulty}&type=multiple`;
    return this.http.get(url);
  }

  getComputerQuestions(amount: number, difficulty: string): Observable<any> {
    const url = `https://opentdb.com/api.php?amount=${amount}&category=18&difficulty=${difficulty}&type=multiple`;
    return this.http.get(url);
  }
  postuser(data: any): Observable<any> {
    const url = `http://localhost:3000/userdetails/${data.stuid}/${data.compId}`;
    return this.http.post(url, data);
  }

  getQuestions(
    subject: string,
    amount: number,
    difficulty: string
  ): Observable<any> {
    switch (subject) {
      case 'reasoning':
        return this.getReasoningQuestions(amount, difficulty);
      case 'english':
        return this.getEnglishQuestions(amount, difficulty);
      case 'computer':
        return this.getComputerQuestions(amount, difficulty);
      default:
        throw new Error(`Invalid subject: ${subject}`);
    }
  }

 
  gettextresult(stuid: string): Observable<any> {
    const url = `${this.vidurl}/transcribe-video/${stuid}`;
    return this.http.get(url);
  }

   
  getcloudresults(stuid: string): Observable<any> {
    const url = `${this.vidurl}/cloudresult/${stuid}`;
    return this.http.get(url);
  }
  getcloud(): Observable<any> {
    const url = `${this.vidurl}/getaccess`;
    return this.http.get(url);
  }
  //------------------------admin-------------------------//
  postinfo(infodata: any): Observable<any> {
    const url = 'http://localhost:3000/postinfo';
    return this.http.post(url, infodata);
  }

  deleteinfo(id: any): Observable<{}> {
    const url = `http://localhost:3000/deleteinfo/${id}`;
    return this.http.delete(url, this.httpOptions);
  }
}
