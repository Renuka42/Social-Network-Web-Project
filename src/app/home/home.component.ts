import { Component, NgZone, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  innerHeight: any;
  innerWidth: any;
  user_id: any;
  pose_all: any;
  like_user_all: Object = [];
  checkLike: any;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private ngZone: NgZone) {
    this.user_id = this.route.snapshot.params["id"];
    this.innerHeight = window.innerHeight;
    this.innerWidth = window.innerWidth;

    //ตรวจจับความกว้างยาวของหน้าจอ //ตลอดเวลา//
    window.onresize = (e: any) => {
      this.ngZone.run(() => {
        this.innerHeight = window.innerHeight;
        this.innerWidth = window.innerWidth;
      });
    };

  }

  comment_text: any;

  ngOnInit(): void {


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

  }

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

  display: boolean = false;

  showDialog() {
    this.display = true;
  }

  setMyStyles() {
    let styles;
    if (this.innerWidth > 1250) {
      styles = {
        'width': 1200 + 'px'
      }
    } else if (this.innerWidth > 900) {
      styles = {
        'width': 900 + 'px'
      }
    } else {
      styles = {
        'width': 800 + 'px'
      }
    }
    return styles;
  }
  setMyClass() {
    let Class;
    if (this.innerWidth > 1250) {
      Class = "p-col-6"
    }
    else if (this.innerWidth > 900) {
      Class = "p-col-7"
    } else {
      Class = "p-col-10"
    }
    return Class;
  }

  setMyClassRow() {
    let Class;
    if (this.innerWidth > 1250) {
      Class = "p-col"
    }
    else if (this.innerWidth > 900) {
      Class = "p-col-4"
    } else {
      Class = "p-col-5"
    }
    return Class;
  }
  setHeightDivauto(){
    let styles;
    styles = {
      'height': this.innerHeight + 'px'
    }
    return styles;
  }


}
