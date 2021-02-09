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
  poseYourSelfText: any;
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
    if(cookieService.check('user_id') == false || cookieService.check('token') == false){
      this.router.navigateByUrl("");
    }
    this.user_id = cookieService.get('user_id');
    this.token = this.tokenUser(cookieService.get('token'));
    this.selectProfileYourself("photo");

   }
  ngOnInit(): void {
    this.selectProfileDetall();
    this.selectProfileYourself("photo");
    
  }

  async selectProfileYourself(mode:any) {

    let json = { user_id: this.user_id,working: 0,mode:mode};
    this.http.post("http://203.154.83.62:1238/select/profile/yourself", JSON.stringify(json),this.token).subscribe(async response => {
      var array = Object.values(response);
      array.forEach((value, index) => {
       //like
        this.http.get("http://203.154.83.62:1238/select/like/" + value["pose_id"], this.token)
         .subscribe( re =>  {
           var liker =  Object.values(re);
           array[index].liked_but = false;
           liker.forEach(element => {
             if (element["user_id_like"] == this.user_id) {
               array[index].liked_but = true;
             }
           });
           array[index].like = liker.length;
         }, err => {
           console.log("re" + JSON.stringify(err));
         });

       //comment
       this.http.get("http://203.154.83.62:1238/select/comment_all/" + value["pose_id"],this.token)
         .subscribe(async re => {
           var comment = Object.values(re);
           var array0index = await comment[comment.length-1];
           
             if(array0index == null)
             {
               array[index].comment_Text = null;
               array[index].comment_c_id = null;
               array[index].comment_comment_length = null;
               array[index].comment_name = null;
               array[index].comment_pose_id_fk = null;
               array[index].comment_user_comment_fk = null;
             }
             else
             {
               array[index].comment_Text = array0index.Text;
               array[index].comment_c_id = array0index.c_id;
               array[index].comment_comment_length = comment.length;
               array[index].comment_name = array0index.name;
               array[index].comment_pose_id_fk = array0index.pose_id_fk;
               array[index].comment_user_comment_fk = array0index.user_comment_fk;
             }

         }, err => {
           console.log("re" + JSON.stringify(err));
         });

     });
      
      
    if(mode == "photo"){
      this.poseYourSelf = array;
    }else if(mode == "text"){
      this.poseYourSelfText = array;
    }

   }, error => {
     console.log(error);
   });

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
