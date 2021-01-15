import { Component, NgZone, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenService } from '../token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: any;
  password: any;
  todayNumber: number = Date.now();
  todayDate: Date = new Date();
  innerHeight: any;
  innerWidth: any;

  constructor(private http: HttpClient, private router: Router, private ngZone: NgZone,private tokens: TokenService) {
    this.innerHeight = window.innerHeight;
    this.innerWidth = window.innerWidth;

    //ตรวจจับความกว้างยาวของหน้าจอ //ตลอดเวลา//
    window.onresize = (e: any) => {
      this.ngZone.run(() => {
        this.innerHeight = window.innerHeight;
        this.innerWidth = window.innerWidth;
        console.log(this.innerWidth);
      });
    };
  }


  ngOnInit(): void {
  }

  login() {

    console.log(this.todayNumber);
    console.log(this.todayDate);
    this.username = "oza1238";
    this.password = "123";
    let json = { username: this.username, password: this.password };
    this.http.post("http://203.154.83.62:1238/user/login", JSON.stringify(json)).subscribe(response => {

      var array = Object.values(response);
      this.tokens.token = array[0]["token"];
      this.tokens.user_id = array[0]["user_id"];

      if (array[0]["check"] == "True") {
        this.router.navigateByUrl("/home");
      }
    }, error => {
      console.log("fail");
    });

  }

  setMyClass() {
    let Class;
    if (this.innerWidth >= 1200) {
      Class = "p-col-5"
    } else {
      Class = "p-col-12"
    }
    return Class;
  }
  setMyStyles() {
    let styles;
    if (this.innerWidth >= 1200) {
      styles = {
        'margin-top': 50 + '%'
      }
    } else if(this.innerWidth >= 750){
      styles = {
        'margin-top': 20 + '%',
      }
    }else{
      styles = {
        'margin-top': 35 + '%',
      }
    }
    return styles;
  }
  setUrlImg() {
    let styles = {};
    if (this.innerWidth < 1200) {
      styles = {
        'background': "url(https://image.freepik.com/free-vector/winter-background-with-pastel-color-brushes-leaves_220290-42.jpg)",
        'background-repeat': ' no-repeat',
        'background-size': '300' + "%"
      }
    } 
    return styles;
  }
  visibleSidebar1: any;


}
