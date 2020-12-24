import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private http:HttpClient) { }

  ngOnInit(): void {


    let json = { user_id: "17"};
    this.http.post("http://203.154.83.62:1238/select/pose_all", JSON.stringify(json)).subscribe(response =>{
      console.log(response);
    }, error =>{
      console.log("fail");
    });
    

    // let request = this.http.get("http://203.154.83.62:1238/user")
    // .subscribe(re =>{
    //   console.log("re"+JSON.stringify(re));
    // }, err =>{
    //   console.log("re"+ JSON.stringify(err));
    // });


  }



}
