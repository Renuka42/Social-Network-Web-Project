import { HttpClient,  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  //แสดงข้อมูล
  user_id: any;
  token: any;
  public pose_all: any;
  comment_simple: any;



  constructor(private http: HttpClient ,private router: Router, private route: ActivatedRoute,) { }

  async selectPose(){
    let json = { user_id: this.user_id};
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
       this.pose_all = array;
       console.log(this.pose_all);
    }, error => {
      console.log(error);
    });
  
  }

  print(){
    console.log(this.pose_all);
  }

}
