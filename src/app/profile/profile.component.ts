import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ArrayType } from '@angular/compiler';
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
  pose_allMapIndex: any = new Map();
  user_id: any;
  poseYourSelf:any;
  poseYourSelfMapIndex: any = new Map();
  comment_allMapIndex: any = new Map();
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
  poseLoadAddData = 0;

  //สำหรับตั้งค่า HTML
  setButTrue: boolean = true;
  setButFalse: boolean = false;

  displayResponsive: boolean = false;
  PoseSelete = false;
  itemsComment: any;
  itemsPose: any;

  constructor(private http: HttpClient, private router: Router, private MetforFacesArt: TokenService, cookieService: CookieService) {
    
    if (cookieService.check('user_id') == false || cookieService.check('token') == false) {
      this.router.navigateByUrl("");
    }
    this.user_id = cookieService.get('user_id');
    this.token = this.tokenUser(cookieService.get('token'));
    this.selectProfileYourself("photo");


    

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
  //   if (event.target.scrollingElement.offsetHeight + event.target.scrollingElement.scrollTop >= (event.target.scrollingElement.scrollHeight-80) && this.showDivLoading == true) {
  //     console.log("end");
  //     this.showDivLoading = false;
  //     this.poseLoadAddData = this.poseLoadAddData + 9;
  //     this.selectProfileYourself('photo');
  //   }
   };

   loadposed(){
     this.poseLoadAddData = this.poseLoadAddData + 9;
     this.selectProfileYourself('photo');
   }
  
  selectIndexComment : any;
  memuCom(index:any,indexPose:any) {
    this.selectIndexComment = index;
    // this.selectIndexPose = indexPose;
    this.itemsComment = [
      {
        label: 'Update', icon: 'pi pi-refresh', command: () => {

        }
      },
      {
        label: 'Delete', icon: 'pi pi-times', command: () => {
          this.showDialogCom();
        }
      },
    ];
  }


  selectIndexPose : any;
  memuPose(index:any) {
    // this.selectIndexPose = index;
    this.selectIndexComment = null;
    this.itemsPose = [
      {
        label: 'Update', icon: 'pi pi-refresh', command: () => {

        }
      },
      {
        label: 'Delete', icon: 'pi pi-times', command: () => {
          this.showDialogDelete();
        }
      },
    ];
  }

  displayDelete: boolean = false;
  showDialogDelete() {
    this.displayDelete = true;
  }

  displayCom: boolean = false;
  showDialogCom() {
    this.displayCom = true;
  }
  deletePose(){
    let json = { user_id: this.user_id ,pose_id:this.selectIndexPose};
    this.http.post("http://203.154.83.62:1238/delete/pose_delete", JSON.stringify(json), this.token).subscribe(response => {
      window.location.reload();
    }, error => {
      console.log("fail");
    });
  }
  deleteCom(){
    let json = { user_id: this.user_id ,c_id:this.selectIndexComment};
    this.http.post("http://203.154.83.62:1238/delete/com_delete", JSON.stringify(json), this.token).subscribe(response => {
      this.selectComment(this.selectIndexPose,"new");
      this.array[0]["comment_comment_length"] = this.array[0]["comment_comment_length"] - 1;
    }, error => {
      console.log("fail");
    });
  
  }
   

  //สำหรับ select ข้อมูล
  async selectProfileYourself(mode: any) {
    //สำหรับ select โพสต์โดยเริ่มต้น
    let json = { user_id: this.user_id, working: this.poseLoadAddData, mode: mode };
    this.http.post("http://203.154.83.62:1238/select/profile/yourself", JSON.stringify(json), this.token).subscribe(async response => {
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
      console.log(this.poseYourSelf);
      
    }, error => {
      console.log("fail");
    });
  }
  array: any;
  async selectPose() {

      
        //comment
        this.http.get("http://203.154.83.62:1238/select/pose_all/" + this.selectIndexPose, this.token)
        .subscribe(async re => { 
          this.array = Object.values(re);

        //like
        this.http.get("http://203.154.83.62:1238/select/like/" + this.selectIndexPose, this.token)
        .subscribe(re => {
          var liker = Object.values(re);
          this.array[0].liked_but = false;
          liker.forEach(element => {
            if (element["user_id_like"] == this.user_id) {
              this.array[0].liked_but = true;
            }
          });
          this.array[0].like = liker.length;
        
          //comment
        this.http.get("http://203.154.83.62:1238/select/commentCount/" + this.selectIndexPose, this.token)
        .subscribe(async re => {
          var comment = Object.values(re);
          this.array[0].comment_comment_length = comment[0]["count"];
          this.selectComment(this.selectIndexPose,"new");
          console.log(this.array);
        }, err => {
          console.log("re" + JSON.stringify(err));
        });

        }, err => {
          console.log("re" + JSON.stringify(err));
        });

        }, err => {
          console.log("re" + JSON.stringify(err));
        });

  }

  comment(pose_id: any, comment_text: any) {
    let json = { Text: comment_text.value, u_id: this.user_id, pose_id: pose_id };
    comment_text.value= '';
    this.http.post("http://203.154.83.62:1238/pose/comment", JSON.stringify(json), this.token).subscribe(response => {
      this.selectComment(pose_id, "new");
      this.array[0]["comment_comment_length"] = this.array[0]["comment_comment_length"] + 1;

    }, error => {
      console.log("fail");
    });

  }

  usernameC: any;
  name_id: any;
  cheangname(){
    let json = { name:this.usernameC, name_id:this.name_id, user_id:this.user_id};
    console.log(json);
    this.http.post("http://203.154.83.62:1238/user/change", JSON.stringify(json), this.token).subscribe(response => {
      window.location.reload();
    }, error => {
      console.log("fail");
    });

  }

  selectComment(pose_id: any, mode: any) {

    if (mode == "new") {
      this.http.get("http://203.154.83.62:1238/select/comment_all/" + pose_id + "/" + 0, this.token)
        .subscribe(re => {
          var array = Object.values(re);
          this.comment_allMapIndex.set(pose_id, array);
        }, err => {
          console.log("re" + JSON.stringify(err));
        });

    } else if (mode == "add") {
      var tempData = this.comment_allMapIndex.get(pose_id);

      this.http.get("http://203.154.83.62:1238/select/comment_all/" + pose_id + "/" + tempData.length, this.token)
        .subscribe(re => {
          var array = Object.values(re);
          var array2 = Object.values(tempData);
          array2.forEach((element, index) => {
            array.push(element);
          });
          this.comment_allMapIndex.set(pose_id, array);
          console.log(this.comment_allMapIndex);

        }, err => {
          console.log("re" + JSON.stringify(err));
        });
    }

  }

    //สำหรับ Input ข้อมูล
    but_like(pose_id: string) {
      console.log(this.comment_allMapIndex);
      let json = { u_id: this.user_id, pose_id: pose_id };
      this.http.post("http://203.154.83.62:1238/pose/like", JSON.stringify(json), this.token).subscribe(response => {
        if (this.array[0]["liked_but"]) {
          this.array[0]["liked_but"] = false;
          this.array[0]["like"]--;
        } else {
          this.array[0]["liked_but"] = true;
          this.array[0]["like"]++;
        }
      }, error => {
        console.log("fail");
      });
  
    }

  selectProfileDetall() {
    let json = { user_id: this.user_id };
    this.http.post("http://203.154.83.62:1238/select/profile", JSON.stringify(json), this.token).subscribe(response => {
      this.detallYourSelf = response;
      console.log(response);
    }, error => {
      console.log("fail");
    });
  }

  uploadedFiles: any[] = [];
  myUploader(even: any) {
    for (let files of even.files) {
      this.uploadedFiles.push(files);
    }
    const file = this.uploadedFiles[0];
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('userid', this.user_id);
    formData.append('folder', "profile");
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
  setColorDigitPose() {
    let styles;
    styles = {
      'background-color': 'rgb(30, 30, 30)'
    }
    return styles;
  }
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
      'width': 22 + '%',
      'height': 50 + 'px'
    }
    return styles;
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

  showResponsiveDialog() {
    this.displayResponsive = true;
  }

  showPoseSelete(indexPose : any) {
    this.PoseSelete = true;
    this.selectIndexPose = indexPose;
    this.selectPose();
  }

}
