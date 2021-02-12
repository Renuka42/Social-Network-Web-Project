import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, NgZone, OnInit} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  innerHeight: number;
  innerWidth: number;
  visibleSidebar3: any;
  friend_all:any;
  user_id: any;
  token: any;
  search_all: any;
  friendSelect: boolean = true;
  NotfriendSelect: boolean = true;
  SendfriendSelect: boolean = true;
  GroupSelect: boolean = true;
  constructor(private ngZone: NgZone,private http: HttpClient,private cookieService: CookieService) {

    this.user_id = cookieService.get('user_id');
    this.token = this.tokenUser(cookieService.get('token'));

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
     this.selectFriend();
   }

  ngOnInit(): void {
  }

  inputClike(mode:any){
    this.visibleSidebar3 = mode;
  }

  selectFriend() {
    let json = { user_id: this.user_id };
    this.http.post("http://203.154.83.62:1238/select/friend", JSON.stringify(json),this.token).subscribe(response => {
    var array = Object.values(response);
    this.friend_all = array;
    console.log(this.friend_all);
    }, error => {
      console.log("fail");
    });
  }
  userAddFriend(useradd:any){

    let json = { user_id: this.user_id, user_add: useradd};
    this.http.post("http://203.154.83.62:1238/add/friend", JSON.stringify(json),this.token).subscribe(response => {
    this.isFriend(useradd,"add");
    this.selectFriend();

    }, error => {
      console.log("fail");
    });
    
  }
  isFriend(user_id:any,setmet:any){
    console.log( this.friend_all);
    let number = this.friend_all.find((element:any) => element.u_id == user_id);
    if(number != undefined){
      var d = this.friend_all[this.friend_all.indexOf(number)];
      if(setmet == "add"){
        if(d.infa == 0 || d.infa == 1){
          this.friend_all[this.friend_all.indexOf(number)] = 3;
        }
      }
      return d.infa;
    }
    return 3; 
  }
  search_text = "";
  search_start = 0;
  search_end = 100;
  selectFriendSearch(event:any) {
    let json = { user_id: this.user_id ,text: this.search_text,start: this.search_start,end: this.search_end};
    this.http.post("http://203.154.83.62:1238/select/search", JSON.stringify(json),this.token).subscribe(response => {
      this.search_all = response;
    }, error => {
      console.log("fail");
    });
  }

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
        'width': 104 + '%',
      }
    }
    return styles;
  }

   //สำหรับเชื่อม token webApi
   tokenUser(token:any){
    const headerDict = {
      'TOKEN': token
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict), 
    };
    return requestOptions;
  }

}
