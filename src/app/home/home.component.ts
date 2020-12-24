import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  pose_all: any;
  like_all: any;
  constructor(private http:HttpClient) { }

  ngOnInit(): void {


    let json = { user_id: "17"};
    this.http.post("http://203.154.83.62:1238/select/pose_all", JSON.stringify(json)).subscribe(response =>{
      console.log(response);
      this.pose_all = response;
    }, error =>{
      console.log("fail");
    });

    
  }

  async likeall(id: string){
     let request = await this.http.get("http://203.154.83.62:1238/select/like/"+id).toPromise();
     return request;
  }
}
