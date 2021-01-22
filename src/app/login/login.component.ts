import { Component, NgZone, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenService } from '../token.service';
import * as bcrypt from 'bcryptjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


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

  //สำหรับสมัคร
  usernameSignin: any;
  passwordSignin: any;
  name_idSignin: any;
  nameSignin: any;

  //รหัส
  salt: any;
  verifyCaptcha: any;

  visibleSidebar2: any;
  siteKey: string;
  dis = false;
  constructor(private http: HttpClient, private router: Router, private ngZone: NgZone, private tokens: TokenService,private formBuilder: FormBuilder) {
    this.innerHeight = window.innerHeight;
    this.innerWidth = window.innerWidth;
    this.salt = bcrypt.genSaltSync(10);
    this.siteKey ="6LemRTcaAAAAAICg9BYjszAhjHqjXRv1B4pMlx3i";
    //ตรวจจับความกว้างยาวของหน้าจอ //ตลอดเวลา//
    window.onresize = () => {
      this.ngZone.run(() => {
        this.innerHeight = window.innerHeight;
        this.innerWidth = window.innerWidth;
        console.log(this.innerWidth);
      });
    };
  }
  

  handleSuccess($event: any){
    this.dis = true;
  }

  ngOnInit(): void {
  
  }

  getResponceCapcha(captchaResponse: string) {
    this.verifyCaptcha(captchaResponse);
 }

  login() {

    let json = {username: this.username};
    this.http.post("http://203.154.83.62:1238/user/login", JSON.stringify(json)).subscribe(response => {

      var array = Object.values(response);
      this.tokens.token = array[0]["token"];
      this.tokens.user_id = array[0]["user_id"];
      var hash = bcrypt.compareSync(this.password, array[0]["password"]);
      console.log(hash);
      if (hash) {
        localStorage.setItem("user_id",array[0]["user_id"]);
        localStorage.setItem("token",array[0]["token"]);
        this.router.navigateByUrl("/home");
      }
    }, () => {
      console.log("fail");
    });
  }
   Signin(){
    
    var hash = bcrypt.hashSync(this.passwordSignin, this.salt);
    let json = { username: this.usernameSignin, password: hash,name_id: this.name_idSignin,name: this.nameSignin};
    console.log(json);
    this.http.post("http://203.154.83.62:1238/user/register", JSON.stringify(json)).subscribe(response => {
    
    }, () => {
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
