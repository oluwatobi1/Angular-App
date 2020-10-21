import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScrumdataService } from '../scrumdata.service';
import { transferArrayItem, moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-scrumboard',
  templateUrl: './scrumboard.component.html',
  styleUrls: ['./scrumboard.component.css']
})
export class ScrumboardComponent implements OnInit {
  project_id = 0
  _participants = []
  list = []

  todo = ['Learn Python', 'Learn Django', 'Learn PHP'];
  doing = ["Learn Design"];
  done = ["Learn Linux", "Learn Ansible"];

  constructor(private _route: ActivatedRoute,
    private _scrumdataService:ScrumdataService) { }

  ngOnInit() {
    this.project_id = parseInt((this._route.snapshot.paramMap.get('project_id')));
    this.getProjectGoals();
  }

  drop(event: CdkDragDrop<string[]>){

  }


  getProjectGoals(){
    this._scrumdataService.allProjectGoals(this.project_id).subscribe(
      data=>{ 
        console.log(data);
        this._participants=data['data']
        
      },
      error=>{
        console.log(error);
        
      }
    )
    
  }

}
