import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: any;
  password: any;
  todayNumber: number = Date.now();
  todayDate : Date = new Date();

  constructor(private http: HttpClient, private router: Router) {

   }
    
    
  ngOnInit(): void {
  }

  login(){

    console.log(this.todayNumber);
    console.log(this.todayDate);
    this.username = "oza1238";
    this.password = "123";
    let json = { username: this.username,password: this.password };
    this.http.post("http://203.154.83.62:1238/user/login", JSON.stringify(json)).subscribe(response => {

      var array = Object.values(response);
      console.log(array[0]["check"]);
    
      if(array[0]["check"] == "True"){
        this.router.navigateByUrl("/home/"+array[0]["user_id"]);
      }
    }, error => {
      console.log("fail");
    });

  }


}
