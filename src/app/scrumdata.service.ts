import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Scrumuser } from './scrumuser';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ScrumdataService {

  constructor(private http : HttpClient) {}
  

  signupApiUrl = 'https://liveapi.chatscrum.com/scrum/api/scrumusers/';
  loginApiUrl = 'https://liveapi.chatscrum.com/scrum/api-token-auth/';
  scrumProjectUrl = 'https://liveapi.chatscrum.com/scrum/api/scrumprojects/';
  updateProjectUrl = 'https://liveapi.chatscrum.com/scrum/api/scrumgoals/';
  updateRoleUrl = 'https://liveapi.chatscrum.com/scrum/api/scrumprojectroles/';
  messagesUrl = "https://promise-scrum.herokuapp.com/message";
  startSprint = "https://liveapi.chatscrum.com/scrum/api/scrumsprint/";
  
  //messagesUrl = "http://localhost:3000/message"
  myWebSocket = webSocket({
    url : 'wss://7e0gtxz63i.execute-api.us-east-2.amazonaws.com/Dev',
    deserializer: ({data}) => data,
    //serializer: msg => JSON.stringify({action: "sendmessage", data: msg})
  });

  token;
  encode;
  public httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  allProjectGoals(projectId): Observable<any>{
    return this.http.get(this.scrumProjectUrl + projectId, this.httpOptions);
  }

  signup(user: Scrumuser): Observable<any> {
    return this.http.post(this.signupApiUrl, {
      email: user.email, password: user.password, full_name: user.fullname,
      usertype: user.userType, projname: user.projectName,
    }, this.httpOptions);
  }

  connect(){
    this.myWebSocket.asObservable().subscribe(
      msg => console.log('subscribed: ' + msg), 
      // Called whenever there is a message from the server    
      err => console.log(err), 
      // Called if WebSocket API signals some kind of error    
      () => console.log('complete') 
      // Called when connection is closed (for whatever reason)  
    );
  }

  chatmsg;
  myChat;

  sendMessage(mesg: string) {
    this.myWebSocket.next({action:"sendmessage", data:`${mesg}`});
    this.myChat = this.myWebSocket.subscribe(    
      msg => {
        new Promise(resolve => {
          resolve(msg);
        }).then(msg => {
          this.chatmsg = msg;
          return this.chatmsg;
        });
       } , 
      // Called whenever there is a message from the server    
      err => console.log(err), 
      // Called if WebSocket API signals some kind of error    
      () => this.myWebSocket.subscribe() 
      // Called when connection is closed (for whatever reason)  
   );
   return this.myChat;
  }

  createSprint(project_id){
    this.token = this.getUser().token;
    this.encode = JSON.parse(localStorage.getItem('AuthUser'));
    this.encode = btoa(`${this.encode.email}:${this.encode.password}`);
    return this.http.post(this.startSprint + '?' + 'goal_project_id=' + project_id,{project_id: project_id}, {headers: new HttpHeaders() 
      .set('Authorization', `Basic ${this.encode}==`).append('Content-Type','application/json')
      });
  }

  loggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  updateUser(user): Observable<any> {
    this.token = this.getUser().token;
    this.encode = JSON.parse(localStorage.getItem('AuthUser'));
    this.encode = btoa(`${this.encode.email}:${this.encode.password}`);
    console.log(user.role);
    return this.http.patch(this.updateRoleUrl + user.id +'/',{role: user.role}, {headers: new HttpHeaders() 
      .set('Authorization', `Basic ${this.encode}==`)
      });
  }

  updateProject(project): Observable<any> {
     this.token = this.getUser().token;
     this.encode = JSON.parse(localStorage.getItem('AuthUser'));
    this.encode = btoa(`${this.encode.email}:${this.encode.password}`);
    return this.http.patch(this.updateProjectUrl + project.id +'/',{status: project.status}, {headers: new HttpHeaders() 
      .set('Authorization', `Basic ${this.encode}==`)
      });
  }

  createGoal(project_id, goal): Observable<any> {
    this.token = this.getUser().token;
    this.encode = JSON.parse(localStorage.getItem('AuthUser'));
   this.encode = btoa(`${this.encode.email}:${this.encode.password}`);
   return this.http.post(this.updateProjectUrl,{project_id: project_id, user: 'm' + this.getUser().role_id, name: goal}, {headers: new HttpHeaders() 
     .set('Authorization', `Basic ${this.encode}==`)
     });
 }

  createProject(project): Observable<any> {
    return this.http.post(this.signupApiUrl, {email: project.email, full_name: project.fullname, usertype:'Owner', projname: project.projectName}, this.httpOptions);
  }

  login(user): Observable<any> {
    return this.http.post(this.loginApiUrl, { username: user.email, password: user.password, project: user.projectName}, this.httpOptions);
  }

  getAllMessages(){
    return this.http.get(this.messagesUrl, this.httpOptions);
  }

  sendToDb(user, email, message){
    return this.http.post(this.messagesUrl, {user: user, email: email, message: message}, this.httpOptions);
  }

  logout(): boolean {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('AuthUser');
    return true;
  }

  getUser(): any {
    return JSON.parse(localStorage.getItem('user'));
  }
}