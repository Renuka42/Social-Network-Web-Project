import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  token: any;
  user_id: any;
  constructor() { }

  tokenUser(){
    const headerDict = {
      'TOKEN': this.token
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict), 
    };
    console.log(this.token);
    return requestOptions;
  }

}
