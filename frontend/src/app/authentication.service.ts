import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface UserDetails {
  _id: string;
  uname: string;
  pass?: string;
  phone?: string;
  gender?: string;
  exp: number;
  iat: number;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  uname: string;
  pass: string;
  phone?: string;
  gender?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private token: string;
  serverUri = 'http://localhost:3000';
  constructor(private http: HttpClient, private router: Router) {}

  private saveToken(token: string) {
    localStorage.setItem('mean-token', token);
    this.token = token;
    console.log('Token: ' + localStorage.getItem('mean-token'));
  }

  private getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      console.log('Token details: ' + payload);
      payload = window.atob(payload);
      console.log('Token details: ' + payload);
      console.log('Token details: ' + payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  private request(method: 'post'|'get', type: 'login'|'user/add'|'profile', user?: TokenPayload): Observable<any> {
    let base;

    if (method === 'post') {
      base = this.http.post(`${this.serverUri}/${type}`, user);
    } else {
      base = this.http.get(`${this.serverUri}/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
    }
    console.log(base);
    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          console.log('Data.Token:' + data.token);
          this.saveToken(data.token);
          let a = this.getUserDetails();
        }
        return data;
      })
    );

    return request;
  }

  public register(user: TokenPayload): Observable<any> {
    return this.request('post', 'user/add', user);
  }

  public login(user: TokenPayload): Observable<any> {
    return this.request('post', 'login', user);
  }

  public profile(): Observable<any> {
    return this.request('get', 'profile');
  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('mean-token');
    this.router.navigateByUrl('/login');
  }
}
