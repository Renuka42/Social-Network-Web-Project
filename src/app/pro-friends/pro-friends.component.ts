import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { TokenService } from '../token.service';

@Component({
  selector: 'app-pro-friends',
  templateUrl: './pro-friends.component.html',
  styleUrls: ['./pro-friends.component.css']
})
export class ProFriendsComponent implements OnInit {



  //หน้าจอ
  innerHeight: any;
  innerWidth: any;

  //แสดงข้อมูล
  user_id: any;
  detallYourSelf: any;
  token: any;

  friend_id: any;

  //ข้อมูลชั่วคราว
  pose_temp = 0;
  comment_text: any;
  checkLike: any;
  mode_pose = false;
  poseLoadAddData = 0;

  //สำหรับตั้งค่า HTML
  setButTrue: boolean = true;
  setButFalse: boolean = false;



  constructor(private http: HttpClient, private router: Router, private MetforFacesArt: TokenService, cookieService: CookieService,private route: ActivatedRoute) {
    if (cookieService.check('user_id') == false || cookieService.check('token') == false) {
      this.router.navigateByUrl("");
    }
    this.user_id = cookieService.get('user_id');
    this.token = this.tokenUser(cookieService.get('token'));
    
    this.friend_id = this.route.snapshot.paramMap.get('id');
    console.log(this.friend_id);

  }
  ngOnInit(): void {
    this.selectProfileDetall();
  }
  selectProfileDetall() {
    let json = { user_id: this.user_id,friend_id: this.friend_id };
    this.http.post("http://203.154.83.62:1238/select/friend/detail", JSON.stringify(json), this.token).subscribe(response => {
      this.detallYourSelf = response;
    }, error => {
      console.log("fail");
    });
  }

  
  //สำหรับเชื่อม token webApi
  tokenUser(token: any) {

    const headerDict = {
      'TOKEN': token
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict)
    };
    return requestOptions;
  }


}
