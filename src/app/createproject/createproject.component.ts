import { FormBuilder, Validators } from '@angular/forms';
import { ScrumdataService } from './../scrumdata.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-createproject',
  templateUrl: './createproject.component.html',
  styleUrls: ['./createproject.component.css']
})
export class CreateprojectComponent implements OnInit {

  createProjectForm;
  submit;
  project = {};
  slacks;
  feedback = '';
  constructor(private scrrumDataService: ScrumdataService, private formBuilder: FormBuilder) {
    this.createProjectForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      fullname: ['', Validators.required],
      projectName: ['', Validators.required],
    });

    this.slacks = ['false', 'true'];
   }

  ngOnInit() {
  }

  get formControls() { return this.createProjectForm.controls; }

  setProject() {
    this.project = Object.assign(this.project, this.createProjectForm.value);
  }

  onCreateProjectSubmit() {
    this.submit = true;
    if ((this.submit && this.createProjectForm.untouched) || this.createProjectForm.invalid) {
      return;
    }
    this.setProject();
    this.scrrumDataService.createProject(this.project).subscribe(
      data => {
        console.log('Success', data);
        this.feedback = "Project Created Successfully";
      },
      error => {
        console.log('error', error);
        this.feedback = "Project Creation failed";
      }
    )
  }

}