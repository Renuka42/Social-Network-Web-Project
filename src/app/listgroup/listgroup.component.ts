import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-listgroup',
  templateUrl: './listgroup.component.html',
  styleUrls: ['./listgroup.component.css']
})
export class ListgroupComponent implements OnInit {

  //หน้าจอ
  innerHeight: any;
  innerWidth: any;

  //แสดงข้อมูล
  user_id: any;
  pose_all: any;
  friend_all: any;
  profile: any;
  group: any;
  comment_all: any;

  //ข้อมูลชั่วคราว
  pose_temp = 0;
  comment_text: any;
  checkLike: any;
  token: any;
  groupPage: any;

  useridf: any;
  popupCreateGroup = false;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private ngZone: NgZone, private cookieService: CookieService)  {
    if (cookieService.check('user_id') == false || cookieService.check('token') == false) {
      this.router.navigateByUrl("");
    }


    this.groupPage = this.route.snapshot.paramMap.get('id');
    this.user_id = cookieService.get('user_id');
    this.token = this.tokenUser(cookieService.get('token'));
    this.selectgroup();
   }

   ngOnInit(): void {

    window.addEventListener('scroll', this.scroll, true);
    

  }
  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
  }

  scroll = (event: any): void => {
    
  };

  selectgroup() {
    
    this.http.get("http://203.154.83.62:1238/select/group/details/"+this.groupPage, this.token)
    .subscribe(response => {
      this.group = response;
      console.log(this.group);
    }, error => {
      console.log("fail");
    });
  }

  addgroupF() {
    let json = { user_request: this.user_id+"", name_id: this.useridf, group_id: this.group[0].group_id+"" };
    this.http.post("http://203.154.83.62:1238/group/add", JSON.stringify(json), this.token).subscribe(response => {
      console.log(response);
      window.location.reload();
    }, error => {
      console.log("fail");
    });
  }

  //สำหรับตั้งค่า Temp
  setTempComment(index: any) {
    this.pose_temp = index;
  }

  //สำหรับแสดงผลทุกหน้าจอ
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
  setMyClass() {
    let Class;
    if (this.innerWidth >= 1250) {
      Class = "p-col-6"
    }
    else if (this.innerWidth >= 900) {
      Class = "p-col-7"
    } else if (this.innerWidth >= 600) {
      Class = "p-col-10"
    } else {
      Class = "p-col-12"
    }
    return Class;
  }
  setMyClassRow() {
    let Class;
    if (this.innerWidth >= 1250) {
      Class = "p-col"
    }
    else if (this.innerWidth >= 900) {
      Class = "p-col-4"
    } else {
      Class = "p-col-5"
    }
    return Class;
  }
  setDivPoseStyles() {
    let styles={};
    if (this.innerWidth < 600) {
      styles = {
        'margin-top': 0 + 'px'
      }
    } 
    
    return styles;
  }
  setCommentPoseStyles() {
    let styles={};
    if (this.innerWidth > 1400) {
      styles = {
        'width': 5 + '%'
      }
    }else if (this.innerWidth > 600) {
      styles = {
        'width': 10 + '%'
      }
    } else{
      styles = {
        'width': 6 + '%'
      }
    }
    
    return styles;
  }
  setHeightDivauto() {
    let styles;
    styles = {
      'height': this.innerHeight + 'px'
    }
    return styles;
  }
  setDialog() {
    let styles;
    if (this.innerWidth >= 1800) {
      styles = {
        'width': 100 + '%',

      }
    } else {
      styles = {
        'width': 100 + '%'
      }
    }
    return styles;
  }
  setDialogRow() {
    let Class;
    if (this.innerWidth >= 1800 || this.innerWidth >= 1400) {
      Class = "p-col-4"
    } else {
      Class = "p-col-12"
    }
    return Class;
  }
  setDialogWidth() {
    let styles;
    if (this.innerWidth >= 1800) {
      styles = {
        'width': 65 + '%',

      }
    } else {
      styles = {
        'width': 95 + '%',

      }
    }
    return styles;
  }
  setFixedBart(fix:any) {
    
    let styles;
    if (fix == 1) {
      console.log("fewef");
      styles = {
        'position':'fixed',
      }
    } else {
      styles = {
        
      }
    }
    return styles;
  }

  //สำหรับเรียก pop up
  display: boolean = false;
  visibleSidebar3: any;
  showDialog() {
    this.display = true;
  }
  setButTrue = true;
  uploadedFiles: any[] = [];
  myUploader(even: any) {
    for (let files of even.files) {
      this.uploadedFiles.push(files);
    }
    const file = this.uploadedFiles[0];
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('userid', this.user_id);
    formData.append('group', this.group[0].group_id);
    formData.append('folder', "group");
    this.http.post("http://203.154.83.62:1238/del/kuy/small/file", formData)
      .subscribe(response => {
        this.uploadedFiles = [];
        window.location.reload();
      }, err => {
        //handle error
      });
  }

  setMyStylestest() {
    let styles;
    styles = {
      'border-radius': 50 + '%',
      'width': 50 + 'px',
      'height': 50 + 'px'
    }
    return styles;
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
