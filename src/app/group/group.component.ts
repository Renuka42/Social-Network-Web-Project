import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  user_id: any;
  token: any;
  group: any;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private ngZone: NgZone, private cookieService: CookieService) {

    if (cookieService.check('user_id') == false || cookieService.check('token') == false) {
      this.router.navigateByUrl("");
    }



    this.user_id = cookieService.get('user_id');
    this.token = this.tokenUser(cookieService.get('token'));

   }

  ngOnInit(): void {
    this.selectgroup();
  }

  selectgroup() {
    let json = { user_id: this.user_id };
    this.http.post("http://203.154.83.62:1238/select/group", JSON.stringify(json), this.token).subscribe(response => {
      this.group = response;
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
