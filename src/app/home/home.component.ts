import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  checkLike:any;

  constructor(private http: HttpClient, private router: Router,private route: ActivatedRoute) { 
    this.user_id = this.route.snapshot.params["id"];
    
  }

  comment_text: any;
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
           array[index] = Object.assign({}, array[index], { comment: comment.length });
           array[index] = Object.assign({}, array[index], { comment_simple: comment[0] });
           
         }, err =>{
           console.log("re"+ JSON.stringify(err));
         }); 
      
      

        }); 
      
      
      this.pose_all = array;
      console.log();
      
    }, error => {
      console.log("fail");
    });

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


  
  comment(pose_id:any) {
      

      let json = { Text: this.comment_text ,u_id: this.user_id, pose_id: pose_id};
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

}
