import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  user_id: any;
  pose_all: any;
  like_user_all: any;
  comment_user_all: any;

  constructor(private http: HttpClient, private router: Router,private route: ActivatedRoute) { 
    this.user_id = this.route.snapshot.params["id"];
    
  }

  ngOnInit(): void {
    
    let json = { user_id: this.route.snapshot.params["id"] };
    this.http.post("http://203.154.83.62:1238/select/pose_all", JSON.stringify(json)).subscribe(response => {
      
      
      var array = Object.values(response);
      
      array.forEach( (value, index) => {

        //like
         this.http.get("http://203.154.83.62:1238/select/like/"+value["pose_id"])
          .subscribe(re =>{
            var liker = Object.values(re);
            this.like_user_all = liker;
            array[index] = Object.assign({}, array[index], { like: liker.length });
            console.log(liker);
            
            
          }, err =>{
            console.log("re"+ JSON.stringify(err));
          });  

          //like
         this.http.get("http://203.154.83.62:1238/select/comment_all/"+value["pose_id"])
         .subscribe(re =>{
           var comment = Object.values(re);
           this.comment_user_all = comment;
           array[index] = Object.assign({}, array[index], { comment: comment.length });
           
         }, err =>{
           console.log("re"+ JSON.stringify(err));
         }); 
      
      

        }); 
      
      
      this.pose_all = array;
      console.log(array);
      // console.log(array);
      
    }, error => {
      console.log("fail");
    });


    // let request = this.http.get("http://203.154.83.62:1238/user")
    // .subscribe(re =>{
    //   console.log("re"+JSON.stringify(re));
    // }, err =>{
    //   console.log("re"+ JSON.stringify(err));
    // });


  }

  but_like(pose_id: string){

    console.log(pose_id);
    console.log(this.user_id);
    let json = { u_id: this.user_id ,pose_id: pose_id};
    this.http.post("http://203.154.83.62:1238/pose/like", JSON.stringify(json)).subscribe(response => {
      console.log(response);

      
    }, error => {
      console.log("fail");
    });
  }



}
