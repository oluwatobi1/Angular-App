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

  tftw = [];
  tftd = [];
  verify = [];
  done = [];

  constructor(private _route: ActivatedRoute,
    private _scrumdataService: ScrumdataService) { }

  ngOnInit() {
    this.project_id = parseInt((this._route.snapshot.paramMap.get('project_id')));
    this.getProjectGoals();

  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex)
    }

  }


  getProjectGoals() {
    this._scrumdataService.allProjectGoals(this.project_id).subscribe(
      data => {
        console.log(data);
        this._participants = data['data']
        this.sortdata(this._participants)
      },
      error => {
        console.log(error);
      }
    )

  }
  sortdata(arr) {
    for (const each of arr) {
      for (const goal of each.scrumgoal_set) {
        if (goal.status === 0) {
          this.tftw.push(goal)
        } else if (goal.status === 1) {
          this.tftd.push(goal)
        } else if (goal.status === 2) {
          this.verify.push(goal)
        } else if (goal.status === 3) {
          this.done.push(goal)
        } else {
          console.log('Error on ', goal);

        }

      }

    }
};


}