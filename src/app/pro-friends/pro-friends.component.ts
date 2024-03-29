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
  poseYourSelf: any;




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
    this.selectProfileYourself("photo");
    window.addEventListener('scroll', this.scroll, true);
  }
  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
  }
  showDivLoading = true;
  stopLoading = false;
  scroll = (event:any): void => {
    if (event.target.scrollingElement.offsetHeight + event.target.scrollingElement.scrollTop >= (event.target.scrollingElement.scrollHeight-80) && this.showDivLoading == true) {
      // console.log("end");
      // this.showDivLoading = false;
      // this.poseLoadAddData = this.poseLoadAddData + 9;
      // this.selectProfileYourself('photo');
    }
  };

  loadposed(){
    this.poseLoadAddData = this.poseLoadAddData + 9;
    this.selectProfileYourself('photo');
  }
 
  

  selectProfileDetall() {
    let json = { user_id: this.user_id,friend_id: this.friend_id };
    this.http.post("http://203.154.83.62:1238/select/friend/detail", JSON.stringify(json), this.token).subscribe(response => {
      this.detallYourSelf = response;
    }, error => {
      console.log("fail");
    });
  }

    //สำหรับ select ข้อมูล
    async selectProfileYourself(mode: any) {
      //สำหรับ select โพสต์โดยเริ่มต้น
      let json = { user_id: this.user_id, working: this.poseLoadAddData, mode: mode ,friend_id: this.friend_id};
      this.http.post("http://203.154.83.62:1238/select/profile/friend", JSON.stringify(json), this.token).subscribe(async response => {
        var array = Object.values(response);
  
        array.forEach((value, index) => {
          //like
          this.http.get("http://203.154.83.62:1238/select/like/" + value["pose_id"], this.token)
            .subscribe(re => {
              var liker = Object.values(re);
              array[index].like = liker.length;
            }, err => {
              console.log("re" + JSON.stringify(err));
            });
  
          //comment
          this.http.get("http://203.154.83.62:1238/select/commentCount/" + value["pose_id"], this.token)
            .subscribe(async re => {
              var comment = Object.values(re);
              array[index].comment_comment_length = comment[0]["count"];
            }, err => {
              console.log("re" + JSON.stringify(err));
            });
  
        });
  
         
        if(this.poseLoadAddData > 1){
          var poseNow = Object.values(this.poseYourSelf);
          let index = poseNow.length;
          array.forEach(element => {
            poseNow.push(element);
          });
            if(index == poseNow.length){
              this.showDivLoading = false;
              this.stopLoading = true;
            }else{
              this.showDivLoading = true;
            }
          this.poseYourSelf = poseNow;
        }else{
          this.poseYourSelf = array;
        }
        
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
