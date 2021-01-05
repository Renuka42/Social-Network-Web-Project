import { Component, NgZone, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';


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
  pose_all: any;
  friend_all: any;
  profile: any;
  group: any;
  comment_all: any;

  //ข้อมูลชั่วคราว
  pose_temp = 0;
  comment_text: any;
  checkLike: any;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private ngZone: NgZone) {
    this.user_id = this.route.snapshot.params["id"];

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

    //สำหรับ select โพสต์โดยเริ่มต้น
    let json = { user_id: this.user_id };
    this.http.post("http://203.154.83.62:1238/select/pose_all", JSON.stringify(json)).subscribe(response => {


      var array = Object.values(response);

      array.forEach((value, index) => {

        //like
        this.http.get("http://203.154.83.62:1238/select/like/" + value["pose_id"])
          .subscribe(re => {
            var liker = Object.values(re);
            array[index] = Object.assign({}, array[index], { liked_but: false });
            liker.forEach(element => {
              if (element["user_id_like"] == this.user_id) {
                this.checkLike = true;
                console.log(this.checkLike);
                array[index] = Object.assign({}, array[index], { liked_but: true });

              }
            });
            array[index] = Object.assign({}, array[index], { like: liker.length });
          }, err => {
            console.log("re" + JSON.stringify(err));
          });

        //comment
        this.http.get("http://203.154.83.62:1238/select/comment_all/" + value["pose_id"])
          .subscribe(re => {
            var comment = Object.values(re);
            array[index] = Object.assign({}, array[index], { comment: comment.length });
            array[index] = Object.assign({}, array[index], { comment_simple: comment[0] });
          }, err => {
            console.log("re" + JSON.stringify(err));
          });
      });


      this.pose_all = array;
      console.log();

    }, error => {
      console.log("fail");
    });

    //สำหรับเรียกใช้การ select
    this.selectFriend();
    this.selectProfile();
    this.selectgroup();

  }

  //สำหรับ select ข้อมูล
  selectgroup() {
    let json = { user_id: this.user_id };
    this.http.post("http://203.154.83.62:1238/select/group", JSON.stringify(json)).subscribe(response => {
      this.group = response;
    }, error => {
      console.log("fail");
    });
    this.comment_text = "";
  }
  selectFriend() {
    let json = { user_id: this.user_id };
    this.http.post("http://203.154.83.62:1238/select/friend", JSON.stringify(json)).subscribe(response => {
      this.friend_all = response;
    }, error => {
      console.log("fail");
    });
    this.comment_text = "";
  }
  selectProfile() {
    let json = { user_id: this.user_id };
    this.http.post("http://203.154.83.62:1238/select/profile", JSON.stringify(json)).subscribe(response => {
      var array = Object.values(response);
      this.profile = array;
      console.log(array);
    }, error => {
      console.log("fail");
    });
    this.comment_text = "";
  }
  selectComment(pose_id:any) {
    this.http.get("http://203.154.83.62:1238/select/comment_all/" + pose_id)
      .subscribe(re => {
        this.comment_all = re;
        console.log(re);
      }, err => {
        console.log("re" + JSON.stringify(err));
      });
  }

  //สำหรับการกระทำโพสต์
  but_like(pose_id: string, index: any) {
    let json = { u_id: this.user_id, pose_id: pose_id };
    this.http.post("http://203.154.83.62:1238/pose/like", JSON.stringify(json)).subscribe(response => {
      var pose = Object.values(this.pose_all[index]);
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
    this.http.post("http://203.154.83.62:1238/pose/comment", JSON.stringify(json)).subscribe(response => {
      console.log(response);
    }, error => {
      console.log("fail");
    });
    this.comment_text = "";
    
  };
  


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
        'width': 90 + '%'
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
  display: boolean = false;
  showDialog() {
    this.display = true;
  }
}
