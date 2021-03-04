import { Component, NgZone, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { PoseComponent } from '../pose/pose.component';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  visibleSidebar4 = false;
  //หน้าจอ
  innerHeight: any;
  innerWidth: any;

  //แสดงข้อมูล
  user_id: any;
  token: any;
  pose_all: any;
  pose_all_re: any;
  comment_simple: any;

  friend_all: any;
  search_all: any;
  profile: any;
  group: any;
  comment_all: any;
  comment_allMapIndex: any = new Map();

  //ข้อมูลชั่วคราว
  pose_index_temp = 0;
  pose_id_temp = 0;
  comment_r = 0;
  pose_max = 0;
  working = 0;

  //input ข้อมูลชั่วคราว
  comment_text: any;
  getTextPose_Temp: any;
  upload_img: string = "";
  upload_video = null;
  lv_pose: any;
  group_id = null;
  fileNameForGetUrl: any;

  //สำหรับตั้งค่า HTML
  setButTrue: boolean = true;
  setButFalse: boolean = false;
  setUploadShowAndDrop: boolean = false;


  items: any[] = [];

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private ngZone: NgZone, private cookieService: CookieService) {

    if (cookieService.check('user_id') == false || cookieService.check('token') == false) {
      this.router.navigateByUrl("");
    }



    this.user_id = cookieService.get('user_id');
    this.token = this.tokenUser(cookieService.get('token'));

    console.log(this.user_id);
    console.log(this.token);

    //ทำให้เว็บรู้จักหน้าจอเริ่มต้นของอุปกรณ์ 
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

  
  //สำหรับเชื่อม token webApi
  tokenUser(token: any) {
    const headerDict = {
      'TOKEN': token
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    return requestOptions;
  }
}
