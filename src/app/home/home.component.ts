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
  like_user_all: Object=[];
  comment_user_all: any;
  checkLike:any;

  constructor(private http: HttpClient, private router: Router,private route: ActivatedRoute) { 
    this.user_id = this.route.snapshot.params["id"];
    
  }

  ngOnInit(): void {
    
    let json = { user_id: this.user_id };
    this.http.post("http://203.154.83.62:1238/select/pose_all", JSON.stringify(json)).subscribe(response => {
      
      
      var array = Object.values(response);
      
      array.forEach( (value, index) => {

        //like
         this.http.get("http://203.154.83.62:1238/select/like/"+value["pose_id"])
          .subscribe(re =>{
            var liker = Object.values(re);
            array[index] = Object.assign({}, array[index], { liked_but: false });
            liker.forEach(element => {
              if(element["user_id_like"] == this.user_id ){
                      this.checkLike =  true;
                      console.log(this.checkLike);
                      array[index] = Object.assign({}, array[index], { liked_but: true });
                      
            }});
            array[index] = Object.assign({}, array[index], { like: liker.length });
          }, err =>{
            console.log("re"+ JSON.stringify(err));
          });  

          //comment
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

  but_like(pose_id: string,index:any){
    let json = { u_id: this.user_id ,pose_id: pose_id};
    this.http.post("http://203.154.83.62:1238/pose/like", JSON.stringify(json)).subscribe(response => {
      var pose = Object.values(this.pose_all[index]);
      if(this.pose_all[index]["liked_but"]){
        this.pose_all[index]["liked_but"] = false;
        this.pose_all[index]["like"]--;
      }else{
        this.pose_all[index]["liked_but"] = true;
        this.pose_all[index]["like"]++;
      }
    }, error => {
      console.log("fail");
    });
  }

  IsLike(pose_id: string){
    // this.checkLike = false;
    // this.http.get("http://203.154.83.62:1238/select/like/"+pose_id)
    // .subscribe(re =>{
    //   var liker = Object.values(re);
    //   liker.forEach(element => {
    //     if(element["user_id_like"] == this.user_id ){
    //       this.checkLike =  true;
    //       console.log(this.checkLike);
    //     }
    //   });
    // }, err =>{
    //   console.log("re"+ JSON.stringify(err));
    // });  
    

   console.log(pose_id);
    
  }
  



}
