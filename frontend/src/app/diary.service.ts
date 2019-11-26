import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class DiaryService {
  serverUri = 'http://localhost:3000';
  constructor(private http: HttpClient, private router: Router) { }

  savePost(data, uname, image, timestamp, pvt) {
    const postData = {
      uname: uname,
      title: data.title,
      post: data.post,
      img: image,
      timestamp: timestamp,
      private: pvt

    };
    //console.log(`${this.serverUri}/posts/add`);
    console.log(postData);
    return this.http.post(`${this.serverUri}/posts/add`, postData);

  }
  getPosts(uname) {
    return this.http.get(`${this.serverUri}/posts/view?uname=` + uname);
  }
  fetchImageBase64(uname, id) {
    return this.http.get(`${this.serverUri}/posts/img?uname=` + uname+'&id=' + id);
  }
  deletePost(uname, title)
  {
    const postData = {
      uname: uname,
      title: title
    }
    return this.http.post(`${this.serverUri}/posts/remove`, postData);
  }
}
