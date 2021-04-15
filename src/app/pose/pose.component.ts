import { HttpClient, HttpHeaders } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-pose',
  templateUrl: './pose.component.html',
  styleUrls: ['./pose.component.css']
})
export class PoseComponent implements OnInit {
  visibleSidebar4 = false;
  //หน้าจอ
  innerHeight: any;
  innerWidth: any;

  //แสดงข้อมูล
  user_id: any;
  token: any;
  pose_all: any;
  pose_allMapIndex: any = new Map();
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
  uploadedFiles: any = [];
  itemsPose: any;
  itemsComment: any;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private ngZone: NgZone, private cookieService: CookieService) {
    if (cookieService.check('user_id') == false || cookieService.check('token') == false) {
      this.router.navigateByUrl("");
    }



    this.user_id = cookieService.get('user_id');
    this.token = this.tokenUser(cookieService.get('token'));
  }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scroll, true);

    //สร้างเมนู
    //this.memuPose(-1);
    //สำหรับเรียกใช้การ select
    this.selectPose();
    this.selectProfile();

  }
  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
  }

  selectIndexComment : any;
  memuCom(index:any,indexPose:any) {
    this.selectIndexComment = index;
    this.selectIndexPose = indexPose;
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
    this.selectIndexPose = index;
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
      this.pose_all[this.pose_allMapIndex.get(this.selectIndexPose)]["comment_comment_length"] = this.pose_all[this.pose_allMapIndex.get(this.selectIndexPose)]["comment_comment_length"] - 1;
    }, error => {
      console.log("fail");
    });
  
  }
   

 

  scroll = (event: any): void => {
    if (event.target.scrollingElement.offsetHeight + event.target.scrollingElement.scrollTop >= (event.target.scrollingElement.scrollHeight)) {
      this.selectPose();
    }
  };


  async selectPose() {

    //สำหรับ select โพสต์โดยเริ่มต้น

    if (this.working == 1) {
      this.pose_max = this.pose_all[this.pose_all.length - 1]["pose_id"]
    }
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

      if (this.working == 1) {
        let indexNow = this.pose_all.length;
        array.forEach((value, index) => {
          this.pose_all.push(value);
          this.pose_allMapIndex.set(value["pose_id"], index + indexNow);
        });
        
      } else {
        this.pose_all = array;
        array.forEach((value, index) => {
          this.pose_allMapIndex.set(value["pose_id"], index);
        });
        this.working = 1;
        console.log(this.pose_all);
       
      }
    }, error => {
      console.log("fail");
    });


  }

  selectProfile() {
    let json = { user_id: this.user_id };
    this.http.post("http://203.154.83.62:1238/select/profile", JSON.stringify(json), this.token).subscribe(response => {
      var array = Object.values(response);
      this.profile = array;
    }, error => {
      console.log("fail");
    });
  }

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
        window.location.reload();
      }, error => {
        console.log("fail");
      });
      this.getTextPose_Temp = "";
    }

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

  setUploadShowAndDropMet() {
    if (this.setUploadShowAndDrop == false) {
      this.setUploadShowAndDrop = true;
    } else {
      this.setUploadShowAndDrop = false;
    }
  }



  //สำหรับ Input ข้อมูล
  but_like(pose_id: string, index: any) {
    console.log(this.comment_allMapIndex);
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

  setoptionConmentsetting(comment_id: any) {

  }


  comment(pose_id: any, comment_text: any) {
    let json = { Text: comment_text.value, u_id: this.user_id, pose_id: pose_id };
    comment_text.value= '';
    this.http.post("http://203.154.83.62:1238/pose/comment", JSON.stringify(json), this.token).subscribe(response => {
      this.selectComment(pose_id, "new");
      this.pose_all[this.pose_allMapIndex.get(pose_id)]["comment_comment_length"] = this.pose_all[this.pose_allMapIndex.get(pose_id)]["comment_comment_length"] + 1;

    }, error => {
      console.log("fail");
    });

  }


  //สำหรับเรียก pop up
  display: boolean = false;
  visibleSidebar3: any;
  showDialog() {
    this.display = true;
  }

  displayDelete: boolean = false;
  showDialogDelete() {
    this.displayDelete = true;
  }

  displayCom: boolean = false;
  showDialogCom() {
    this.displayCom = true;
  }

  //สำหรับตั้งค่า Temp
  setTempComment(index: any, pose_id: any) {
    //ตั้งค่าโพสต์ปัจจุบันที่กดด้วย index ของ Array
    this.comment_text = "";
    this.pose_index_temp = index;
    this.pose_id_temp = pose_id;
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
