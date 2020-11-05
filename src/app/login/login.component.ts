import { ScrumdataService } from './../scrumdata.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  feedback;
  loginForm;
  user;
  submit = false;

  constructor(private formBuilder: FormBuilder, private scrumDataService: ScrumdataService,
              private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
      projectName: [null, Validators.required],
    });
      }

  ngOnInit() {
    
  }

  get formControls() { return this.loginForm.controls; }

  setUserData() {
    return this.user = Object.assign({}, this.loginForm.value);
  }

  onLoginSubmit() {
    this.submit = true;
    if ((this.submit && this.loginForm.untouched) || this.loginForm.invalid) {
      return;
    }
    this.setUserData();
    this.scrumDataService.login(this.user).subscribe(
      data => {
        console.log('Success!', data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('AuthUser', JSON.stringify(this.user));
        this.scrumDataService.connect();
        this.router.navigate(['/scrumboard', data.project_id]);
      },
      error => {
        console.error('Error!', error);
        this.feedback = 'Username or Password doesn\'t match';
      }
    );
  }
}