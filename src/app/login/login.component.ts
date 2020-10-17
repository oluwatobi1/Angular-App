import { Component, OnInit } from '@angular/core';
import { ScrumdataService } from '../scrumdata.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  scrumUserLoginData = {
    'email': '',
    'password': '',
    'projname': ''
  }
  

  constructor(private _scrumdataService: ScrumdataService, private _router: Router) { }

  ngOnInit(): void {
  }

  feedbk = '';

  onLoginSubmit(){
    this._scrumdataService.login(this.scrumUserLoginData).subscribe(
      data => {
        console.log('Success!', data)
        localStorage.setItem('token', data.token)
        this._router.navigate(['/scrumboard', data['project_id']])
      },
      error => {
        console.log('Error!', error)
        this.feedbk = 'Invalid login credentials'
      }
    )
  }
}