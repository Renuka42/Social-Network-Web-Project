import { Component, NgZone, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

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
    // this.visibleSidebar3 = true;



    //สำหรับเรียกใช้การ select
    this.selectPose();
    this.selectFriend();
    this.selectProfile();
    this.selectgroup();

  }

  //สำหรับ select ข้อมูล
  async selectPose() {
    //สำหรับ select โพสต์โดยเริ่มต้น
    let json = { user_id: this.user_id, pose_id: this.pose_max, working: this.working };
    this.http.post("http://203.154.83.62:1238/select/pose_all", JSON.stringify(json), this.token).subscribe(async response => {
      var array = Object.values(response);

      array.forEach((value, index) => {
        //like
        this.http.get("http://203.154.83.62:1238/select/like/" + value["pose_id"], this.token)
          .subscribe(re => {
            var liker = Object.values(re);
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
        this.http.get("http://203.154.83.62:1238/select/commentCount/" + value["pose_id"], this.token)
          .subscribe(async re => {
            var comment = Object.values(re);
            array[index].comment_comment_length = comment[0]["count"];
            this.selectComment(value["pose_id"], "new");
          }, err => {
            console.log("re" + JSON.stringify(err));
          });

      });
      this.pose_all = array;
      this.pose_all_re = array;
      console.log(this.pose_all);


      // if(this.working == 1){

      // }


    }, error => {
      console.log("fail");
    });
  }
  selectgroup() {
    let json = { user_id: this.user_id };
    this.http.post("http://203.154.83.62:1238/select/group", JSON.stringify(json), this.token).subscribe(response => {
      this.group = response;
    }, error => {
      console.log("fail");
    });
    this.comment_text = "";
  }

  selectFriend() {
    let json = { user_id: this.user_id };
    this.http.post("http://203.154.83.62:1238/select/friend", JSON.stringify(json), this.token).subscribe(response => {
      var array = Object.values(response);
      this.friend_all = array;
      console.log(this.friend_all);
    }, error => {
      console.log("fail");
    });
    this.comment_text = "";
  }
  selectProfile() {
    let json = { user_id: this.user_id };
    this.http.post("http://203.154.83.62:1238/select/profile", JSON.stringify(json), this.token).subscribe(response => {
      var array = Object.values(response);
      this.profile = array;
    }, error => {
      console.log("fail");
    });
    this.comment_text = "";
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


        }, err => {
          console.log("re" + JSON.stringify(err));
        });
    }

  }





  commentWithPoseid(pose_id: any) {

    console.log(this.comment_allMapIndex.get(pose_id).length);


  }
  getcommetSizeOfArray(pose_id: any) {
    return this.comment_allMapIndex.get(pose_id).length;
  }

  //สำหรับ Input ข้อมูล
  but_like(pose_id: string, index: any) {
    let json = { u_id: this.user_id, pose_id: pose_id };
    this.http.post("http://203.154.83.62:1238/pose/like", JSON.stringify(json), this.token).subscribe(response => {
      if (this.pose_all[index]["liked_but"]) {
        this.pose_all[index]["liked_but"] = false;
        this.pose_all[index]["like"]--;
      } else {
        this.pose_all[index]["liked_but"] = true;
        this.pose_all[index]["like"]++;
      }
    }, error => {
      console.log("fail");
    });

  }
  comment(pose_id: any) {

    let json = { Text: this.comment_text, u_id: this.user_id, pose_id: pose_id };
    console.log(json);
    this.http.post("http://203.154.83.62:1238/pose/comment", JSON.stringify(json), this.token).subscribe(response => {
      this.comment_text = "";
      console.log(response);
      this.selectComment(pose_id, "new");

    }, error => {
      console.log("fail");
    });

  }
  inputPoseUser() {
    if (this.getTextPose_Temp != "") {
      console.log(this.getTextPose_Temp == "");
    }

    if (this.upload_img != "") {
      console.log(this.upload_img == "");
    }

    if (this.upload_video != null) {
      console.log(this.upload_video == null);
    }

    if (this.group != null) {
      console.log(this.group == null);
    }

    if (this.getTextPose_Temp != null || this.getTextPose_Temp != "" || this.getTextPose_Temp != " ") {
      let json = {
        text: this.getTextPose_Temp,
        u_id: this.user_id,
        user_upload_img: this.upload_img,
        user_upload_video: this.upload_video,
        lv_pose: "0",//ยังไม่มีฟังก์ชัน
        group_id: this.group_id
      };
      console.log(json);
      this.http.post("http://203.154.83.62:1238/pose/text", JSON.stringify(json), this.token).subscribe(response => {
        console.log(response);
        this.selectPose();
      }, error => {
        console.log("fail");
      });
      this.getTextPose_Temp = "";
    }

  }


  UserLogOut() {
    this.cookieService.deleteAll();
    this.router.navigateByUrl("");
  }
  uploadedFiles: any[] = [];
  myUploader(event: any) {

    for (let files of event.files) {
      this.uploadedFiles.push(files);
    }
    const file = this.uploadedFiles[0];
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('userid', this.user_id);
    formData.append('folder', '');
    this.http.post("http://203.154.83.62:1238/del/kuy/small/file", formData)
      .subscribe(response => {
        this.uploadedFiles = [];
        this.upload_img = (response).toString();
      }, err => {
        //handle error
      });

  }
  cen(event: any) {
    console.log(event);
  }






  //สำหรับตั้งค่า Temp
  setTempComment(index: any, pose_id: any) {
    //ตั้งค่าโพสต์ปัจจุบันที่กดด้วย index ของ Array
    this.comment_text = "";
    this.pose_index_temp = index;
    this.pose_id_temp = pose_id;
  }
  setUploadShowAndDropMet() {
    if (this.setUploadShowAndDrop == false) {
      this.setUploadShowAndDrop = true;
    } else {
      this.setUploadShowAndDrop = false;
    }
  }
  setoptionConmentsetting(comment_id: any) {
    console.log(comment_id);
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
  setMyClass() {
    let Class;
    if (this.innerWidth >= 1250) {
      Class = "p-col-6"
    }
    else if (this.innerWidth >= 900) {
      Class = "p-col-7"
    } else if (this.innerWidth >= 600) {
      Class = "p-col-10"
    } else {
      Class = "p-col-12"
    }
    return Class;
  }
  setMyClassRow() {
    let Class;
    if (this.innerWidth >= 1250) {
      Class = "p-col"
    }
    else if (this.innerWidth >= 900) {
      Class = "p-col-4"
    } else {
      Class = "p-col-5"
    }
    return Class;
  }
  setDivPoseStyles() {
    let styles = {};
    if (this.innerWidth < 600) {
      styles = {
        'margin-top': 0 + 'px'
      }
    }

    return styles;
  }
  setCommentPoseStyles() {
    let styles = {};
    if (this.innerWidth > 1400) {
      styles = {
        'width': 5 + '%'
      }
    } else if (this.innerWidth > 600) {
      styles = {
        'width': 10 + '%'
      }
    } else {
      styles = {
        'width': 6 + '%'
      }
    }

    return styles;
  }
  setHeightDivauto() {
    let styles;
    styles = {
      'height': this.innerHeight + 'px'
    }
    return styles;
  }
  setDialog() {
    let styles;
    if (this.innerWidth >= 1800) {
      styles = {
        'width': 100 + '%',

      }
    } else {
      styles = {
        'width': 100 + '%'
      }
    }
    return styles;
  }
  setDialogRow() {
    let Class;
    if (this.innerWidth >= 1800 || this.innerWidth >= 1400) {
      Class = "p-col-4"
    } else {
      Class = "p-col-12"
    }
    return Class;
  }
  setDialogWidth() {
    let styles;
    if (this.innerWidth >= 1800) {
      styles = {
        'width': 65 + '%',

      }
    } else {
      styles = {
        'width': 95 + '%',

      }
    }
    return styles;
  }

  //สำหรับเรียก pop up
  display: boolean = false;
  visibleSidebar3: any;
  showDialog() {
    this.display = true;
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
