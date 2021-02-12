import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  
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

  //สำหรับเรียก pop up
  display: boolean = false;
  visibleSidebar3: any;
  showDialog() {
    this.display = true;
  }
}
