import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { TokenService } from '../token.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  //หน้าจอ
  innerHeight: any;
  innerWidth: any;

  //แสดงข้อมูล
  user_id: any;
  poseYourSelf: any;
  detallYourSelf: any;
  friend_all: any;
  token: any;
  profile: any;
  group: any;
  comment_all: any;

  //ข้อมูลชั่วคราว
  pose_temp = 0;
  comment_text: any;
  checkLike: any;
  mode_pose = false;

  //สำหรับตั้งค่า HTML
  setButTrue: boolean = true;
  setButFalse: boolean = false;



  constructor(private http: HttpClient, private router: Router, private MetforFacesArt: TokenService,cookieService: CookieService) {
    // if(localStorage.getItem("user_id") == null && localStorage.getItem("token") == null){
    //   this.router.navigateByUrl("");
    // }
    // this.user_id = localStorage.getItem("user_id")?.toString();
    // this.token = this.tokenUser(localStorage.getItem("token"));


    if(cookieService.check('user_id') == false || cookieService.check('token') == false){
      this.router.navigateByUrl("");
    }
    // this.user_id = localStorage.getItem("user_id")?.toString();
    // this.token = this.tokenUser(localStorage.getItem("token"));

    this.user_id = cookieService.get('user_id');
    this.token = this.tokenUser(cookieService.get('token'));
    console.log(this.user_id);
    console.log(this.token);

   }
  ngOnInit(): void {
    this.selectProfileYourself();
    this.selectProfileDetall();

  }




  async selectProfileYourself() {
    this.MetforFacesArt.setTokenAndUserId(this.user_id,this.token);
    await this.MetforFacesArt.selectPose("yourself");
    this.poseYourSelf = await this.MetforFacesArt.getdata();
  }
  selectProfileDetall(){
    let json = { user_id: this.user_id };
    this.http.post("http://203.154.83.62:1238/select/profile" , JSON.stringify(json),this.token ).subscribe( response =>  {
      this.detallYourSelf =  response;
    }, error => {
      console.log("fail");
    });
  }
  uploadedFiles: any[] = [];
  myUploader(even:any) {
    for(let files of even.files) {
      this.uploadedFiles.push(files);
    }
    const file = this.uploadedFiles[0];
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('userid',this.user_id);
    formData.append('folder',"profile");
    this.http.post("http://203.154.83.62:1238/del/kuy/small/file", formData)
    .subscribe(response => {
      this.uploadedFiles = [];
      window.location.reload();
    }, err => {
      //handle error
    });
  }

  //สำหรับตั้งค่า Temp
  setTempComment(index: any) {
    this.pose_temp = index;
  }

  //สำหรับแสดงผลทุกหน้าจอ
  setMyStyles() {
    let styles;
    if (this.innerWidth >= 1250) {
      styles = {
        'width': 1200 + 'px'
      }
    } else if (this.innerWidth >= 900) {
      styles = {
        'width': 900 + 'px'
      }
    } else if (this.innerWidth >= 600) {
      styles = {
        'width': 600 + 'px'
      }
    } else {
      styles = {
        'width': 104 + '%',
      }
    }
    return styles;
  }

  setMyStylestest() {
    let styles;
      styles = {
        'border-radius': 50 + '%',
        'width':22+'%',
        'height':50+'px'
      }
    return styles;
  }



  //สำหรับเชื่อม token webApi
  tokenUser(token:any){

    const headerDict = {
      'TOKEN': token
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict)
    };
    return requestOptions;
  }

}
