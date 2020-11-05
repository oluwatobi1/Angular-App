import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router  } from '@angular/router';
import { ScrumdataService } from '../scrumdata.service';
import { FormBuilder, Validators } from '@angular/forms';
import { transferArrayItem, moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-scrumboard',
  templateUrl: './scrumboard.component.html',
  styleUrls: ['./scrumboard.component.css']
})


export class ScrumboardComponent implements OnInit {

  projectId;
  participants = [];
  taskForTheDay = [];
  taskForTheWeek = [];
  taskVerified = [];
  taskDone = [];
  messages=[];
  myMessages = [];
  tasks = [{'hello': 'hi'},{'hello': 'hi'},{'hello': 'hi'}];
  loggedUser;
  authUserEmail;
  gotMessage;
  submit = false;
  chatForm;
  createGoal;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router:Router, private scrumDataService: ScrumdataService) {
    this.chatForm = this.formBuilder.group({
      chat: [null, Validators.required]
    });
    this.createGoal = this.formBuilder.group({
      goal: [null, Validators.required]
    })
    this.scrumDataService.getAllMessages().subscribe( data => {
        this.gotMessage = data;
        this.gotMessage.forEach( value => {
          this.messages.push(value);
        });
        });
   }

  ngOnInit() {
    // tslint:disable-next-line: radix
    this.loggedUser = this.scrumDataService.getUser();
    this.authUserEmail = JSON.parse(localStorage.getItem('AuthUser')).email
    this.projectId = parseInt(this.route.snapshot.paramMap.get('project_id'));
    this.getProjectGoals();
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

  sortGoals( goal ) {
    switch ( goal.status ) {
       case 0: this.taskForTheWeek.push(goal);
               return;
       case 1: this.taskForTheDay.push(goal);
               return;
       case 2: this.taskVerified.push(goal);
               return;
       case 3: this.taskDone.push(goal);
               return;
       default: return;
    }
  }

  calculateRole(val){
    val = val.split("-");
    if((val[3] % 4) === 3 ){
      return 3;
    }
    if((val[3] % 4) === 2 ){
      return 2;
    }
    if((val[3] % 4) === 1 ){
      return 1;
    }
    if((val[3] % 4) === 0 ){
      return 0;
    }
  }

  updateGoalStatus( goal, goalItem ) {
    switch ( goal ) {
       case 0: goalItem.status = 0;
               return;
       case 2: goalItem.status = 1;
               return;
       case 2: goalItem.status = 2;
               return;
       case 3: goalItem.status = 3;
               return;
       default: return;
    }
  }

  dropeddnotuse(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex)
    }

  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log(event.container);
      event.item.data.status = this.calculateRole(event.container.id);
      console.log('status' + event.item.data.status);
      this.scrumDataService.updateProject(event.item.data).subscribe(
        data => {
          console.log(data);
        },
        error => {
          console.log(error);
        }
      )
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  filterTasks() {
    this.participants.forEach(( participant ) => {
      participant.scrumgoal_set.forEach(element => {
       this.sortGoals(element);
      });
    });
  }

  addGoal() {
    this.submit = true;
    if ((this.submit && this.createGoal.untouched) || this.createGoal.invalid) {
      this.submit = false;
      return;
    }
    this.scrumDataService.createGoal(this.projectId, this.createGoal.controls.goal.value).subscribe(
      data => {
        console.log(data);
        this.getProjectGoals();
        this.createGoal.reset();
      },
      error => {
        console.log(error);
      }
    );
  }

  createSprint() {
    this.scrumDataService.createSprint(this.projectId).subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
      }
    )
  }

  getProjectGoals() {
    this.scrumDataService.allProjectGoals(this.projectId).subscribe(
      data => {
        this.participants = data.data;
        this.filterTasks();
      },
      error => {
        console.log(error);
      }

    )
  }

  logout() {
    if(this.scrumDataService.logout()){
      this.scrumDataService.myWebSocket.complete();
      this.router.navigate(['/login']);
    }else{
      console.log('error');
    }
  }

}