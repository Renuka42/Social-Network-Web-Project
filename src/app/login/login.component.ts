import { Component, NgZone, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenService } from '../token.service';
import { CookieService } from 'ngx-cookie-service';


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

  siteKey: any;
  dis= false;
  visibleSidebar2: any;
  constructor(private http: HttpClient, private router: Router, private ngZone: NgZone, private tokens: TokenService,private cookieService: CookieService) {
    // if(cookieService.check('user_id') == true || cookieService.check('token') == true){
    //   this.router.navigateByUrl("/home");
    // }
    this.innerHeight = window.innerHeight;
    this.innerWidth = window.innerWidth;
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

    let json = {username: this.username,password: this.password};
    this.http.post("http://203.154.83.62:1238/user/login", JSON.stringify(json)).subscribe(response => {
    var array = Object.values(response);
    if(array != null){
      this.tokens.token = array[0]["token"];
      var tokenUserID = this.tokens.token.split("."); 
      let strToJSONUserid = JSON.parse(atob(tokenUserID[1]));
      let superId = Object.values(strToJSONUserid)[0];
      console.log(superId);


      this.cookieService.set( 'user_id', superId+"" );
      this.cookieService.set( "token",this.tokens.token );
      
      // localStorage.setItem("user_id",superId+"");
      // localStorage.setItem("token",this.tokens.token);
      this.router.navigateByUrl("/home");
    }
    }, () => {
      console.log("fail");
    });
  }
   Signin(){
    
    
    let json = { username: this.usernameSignin, password: this.passwordSignin,name_id: this.name_idSignin,name: this.nameSignin};
    console.log(json);
    this.http.post("http://203.154.83.62:1238/user/register", JSON.stringify(json)).subscribe(response => {
      location.reload();
    }, () => {
      console.log("fail");
    });
  }

  showResponse(event:any) {
    
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
