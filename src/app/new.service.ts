import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tasks } from './components/tasks/new';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class MyService {
 
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private register = "http://localhost:3000/api/register";
  // private assigntask = "http://localhost:3000/api/challenges/update/:userId";
private vidurl='http://localhost:3000';
  constructor(private http: HttpClient) {}





  
  getValues(userId: string): Observable<tasks[]> {
    const apiUrl = `http://localhost:3000/api/challenges/${userId}`;
    return this.http.get<tasks[]>(apiUrl);
  }
 

  deleteTask(challenge_id: string): Observable<{}> {
    const url = `http://localhost:3000/api/challenges/${challenge_id}`;
    return this.http.delete(url, this.httpOptions);
  }

  createdata(data: any): Observable<any> {
    return this.http.post(`${this.register}`, data);
  }

  logindata(data: any, Inst_name: string): Observable<any> {
    const login = `http://localhost:3000/api/login/${Inst_name}`;
    return this.http.post(login, data);
  }

  publishdata(data: any, taskId: string): Observable<any> {
    const apiUrl = `http://localhost:3000/api/update/'${taskId}'`;
    return this.http.post(apiUrl, data);
  
  }
  edittask(task: any,challenge_id:any){
    const editurl=`http://localhost:3000/api/challenges/:'${challenge_id}'`;
    return this.http.put(editurl,task);
  }

  getText(textId: string): Observable<any> {
    const textUrl = `http://localhost:3000/transcribe/${textId}`;
    return this.http.get(textUrl);
  }


  //----------------------_______________students_________________-----------------------//

  
  registerStudent(name: string, email: string, gender: string, phone: string, password: string, confirmpassword: string) {
    const url = 'http://localhost:3000/api/sturegister';
    const data = { name, email, gender, phone, password, confirmpassword };
    return this.http.post(url, data, { responseType: 'json' });
  }
 
  


  stulogin(email: string, password: string): Observable<any> {
    const login = 'http://localhost:3000/api/stulogin';
    return this.http.post(login, { email, password });
}

gettasks():Observable<tasks[]>{
  const geturl=`http://localhost:3000/api/challenges`;
  return this.http.get<tasks[]>(geturl);
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

uploadVideo(gitlink: string, stuid: string): Observable<any> {
  const url = `${this.vidurl}/videoupload/${stuid}`;
  return this.http.post(url, { gitlink });
}

gettextresult(stuid: string): Observable<any> {
  const url = `${this.vidurl}/transcribe-video/${stuid}`;
  return this.http.get(url);
}

getPythonResults(stuid: string) {
  const url=`${this.vidurl}/results/${stuid}`
  return this.http.get(url);
}

 

}
  




