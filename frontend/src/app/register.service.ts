import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  serverUri = 'http://localhost:3000';
  constructor(private http: HttpClient) { }

  addUser(uname, pass, phone, gender){
    //if (pass.equals(confirmPass)) {
      // correct
    console.log('Correctly entered');
    const user = {
      uname: uname,
      pass: pass,
      phone: phone,
      gender: gender
    };
    console.log(user);
    return this.http.post(`${this.serverUri}/user/add`, user);
    //}
  }
}
