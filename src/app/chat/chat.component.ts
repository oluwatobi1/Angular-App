import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ScrumdataService } from '../scrumdata.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  projectId;
  
  messages=[];
  myMessages = [];
  tasks = [{'hello': 'hi'},{'hello': 'hi'},{'hello': 'hi'}];
  loggedUser;
  authUserEmail;
  gotMessage;
  submit = false;
  chatForm;
  

  constructor(private formBuilder: FormBuilder,   private scrumDataService: ScrumdataService) {
    this.chatForm = this.formBuilder.group({
      chat: [null, Validators.required]
    });
    
    this.scrumDataService.getAllMessages().subscribe( data => {
        this.gotMessage = data;
        this.gotMessage.forEach( value => {
          this.messages.push(value);
        });
        });
   }

  ngOnInit() {
    this.loggedUser = this.scrumDataService.getUser();
    this.authUserEmail = JSON.parse(localStorage.getItem('AuthUser')).email

    this.scrumDataService.myWebSocket.asObservable().subscribe(    
      msg => {
        new Promise(resolve => {
          resolve(msg);
        }).then(msg => {
        
          this.myMessages = [];
          this.myMessages.push(JSON.parse(JSON.stringify(msg)));
          this.myMessages.forEach(value => this.messages.push(JSON.parse(value)));
        });
       } , 
      // Called whenever there is a message from the server    
      err => console.log(err), 
      // Called if WebSocket API signals some kind of error    
      () => console.log('complete')
      // Called when connection is closed (for whatever reason)  
   );
  }

  send() {
    this.submit = true;
    if ((this.submit && this.chatForm.untouched) || this.chatForm.invalid) {
      this.submit = false;
      return;
    }
    this.scrumDataService.sendToDb(this.scrumDataService.getUser().name, JSON.parse(localStorage.getItem('AuthUser')).email, this.chatForm.controls.chat.value ).subscribe( data => {
      console.log(data);      
    });
    
    this.scrumDataService.myWebSocket.next({action:"sendmessage", data: {name:`${this.scrumDataService.getUser().name}`, email:`${JSON.parse(localStorage.getItem('AuthUser')).email}`, message:`${this.chatForm.controls.chat.value}`}})
    this.chatForm.reset();
  }

  logout() {
    if(this.scrumDataService.logout()){
      this.scrumDataService.myWebSocket.complete();
    }else{
      console.log('error');
    }
  }

}
