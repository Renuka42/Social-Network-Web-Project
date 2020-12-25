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

  constructor(private http: HttpClient, private router: Router,private route: ActivatedRoute) { 

    
  }

  pose_all: any;
  ngOnInit(): void {
    
    let json = { user_id: this.route.snapshot.params["id"] };
    this.http.post("http://203.154.83.62:1238/select/pose_all", JSON.stringify(json)).subscribe(response => {
      console.log(response);
      this.pose_all = response;
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
}
