import { Component, OnInit } from '@angular/core';
import { ScrumdataService } from '../scrumdata.service';
import { Scrumuser } from '../scrumuser';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  scrumFormData = new Scrumuser('','','','', '');
  public data: any;
  public error: any;


  constructor(private _scrumdataservice: ScrumdataService) { }

  ngOnInit(): void {   
  }
  onLoginSubmit(){
    this._scrumdataservice.login(this.scrumFormData).subscribe(
      data=>{
        console.log("Success: ", data);
        this.data = data},
      error=>{
        console.log("Error! ", error);
        this.error = error        
      }
        
       )
  }

    
  }

