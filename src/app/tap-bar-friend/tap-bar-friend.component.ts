import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-tap-bar-friend',
  templateUrl: './tap-bar-friend.component.html',
  styleUrls: ['./tap-bar-friend.component.css']
})
export class TapBarFriendComponent implements OnInit {
  user_id: string;
  token: { headers: HttpHeaders; };
  profile: any;
  friend_all: any;
  

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private cookieService: CookieService) {

    if (cookieService.check('user_id') == false || cookieService.check('token') == false) {
      this.router.navigateByUrl("");
    }

    this.user_id = cookieService.get('user_id');
    this.token = this.tokenUser(cookieService.get('token'));

   }

  ngOnInit(): void {
    this.selectProfile();
    this.selectFriend();
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
selectFriend() {
  let json = { user_id: this.user_id };
  this.http.post("http://203.154.83.62:1238/select/friend", JSON.stringify(json), this.token).subscribe(response => {
    var array = Object.values(response);
    this.friend_all = array;
    console.log("fffffffff");
    console.log(this.friend_all);
    
  }, error => {
    console.log("fail");
  });
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

