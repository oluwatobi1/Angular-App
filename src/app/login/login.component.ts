import { Component, OnInit } from '@angular/core';
import { Scrumuser } from '../scrumuser';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  scrumFormModel = new Scrumuser('','','','', '');

  constructor() { }

  ngOnInit(): void { 
  
  }

    
  }

