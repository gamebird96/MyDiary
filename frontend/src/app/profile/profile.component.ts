import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatDividerModule} from '@angular/material/divider';

import {MatSnackBarModule} from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { post } from 'selenium-webdriver/http';
import { AuthenticationService } from '../authentication.service';
import { DiaryService } from '../diary.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { CKEditor4 } from 'ckeditor4-angular/ckeditor';

export class formDat {
  _id?;
  title: string;
  post: string;
  timestamp: string;
  image: string;
  isPrivate: string; //CHANGED
  // path;
   link: string;
  constructor(i, a, b, c, d, e) { //CHANGED
    this._id = i;
    this.title = a;
    this.post = b;
    this.timestamp = c;
    this.image = d;
    this.isPrivate = e; //CHANGED
    // this.path = path;
    // this.link = '/post?imgpath=' + this.path + '&title=' + this.title + '&timeStamp=' + this.timeStamp + '&post=' + this.post;
    
  }
}

export class jsonResponse {
  post: string;
  id: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

    // userName = 'Demo User';


    userName = '';
    closeResult: string;
    editorData;
    postForm;
    postList: Array<formDat> = [];
    avatarList: Array<File> = [];
    base64Image;
    checked = false; //CHANGED 
    tit: string;
    public model = {
      editorData: '<p>Hello, world!</p>'
  };

    constructor(public snackBar: MatSnackBar, private datePipe: DatePipe,
                private formBuilder: FormBuilder, private authService: AuthenticationService,
                private diaryService: DiaryService, private router: Router) {

      this.postForm = this.formBuilder.group({
        title: '',
        post: '',
        avatarBase64: '',
        avatar: ['']
      });
      this.verifyLoggedIn();
      this.loadPostsData();
    }

    verifyLoggedIn() {
      if (!this.authService.isLoggedIn()) {
        this.router.navigate(['login']);
      } else {
        this.userName = this.authService.getUserDetails().uname;
      }
    }

    loadPostsData() {
      this.diaryService.getPosts(this.userName).subscribe((res: Response) => {
        // tslint:disable-next-line: no-unused-expression
        console.log(res);
        this.postList = res as unknown as formDat[];
        // iterate and set link
        for (var _i = 0; _i < this.postList.length; _i++) {
          // this.postList[_i].link = '/post?imgpath=' + this.postList[_i].image +'&title=' + this.postList[_i].title + '&timeStamp=' + this.postList[_i].timestamp + '&post=' + this.postList[_i].post;

          this.postList[_i].link = '/post?uname=' + this.userName + '&id=' + this.postList[_i]._id +
          '&title=' + this.postList[_i].title + '&timeStamp=' + this.postList[_i].timestamp + '&post=' + this.postList[_i].post;
      }
      
        //console.log(this.postList);
      }, (err) => {
        console.error(err);
      });
    }
    onFileChange(event) {
      if (event.target.files.length > 0) {
        const reader = new FileReader();

        reader.readAsDataURL(event.target.files[0]); // read file as data url
        console.log(reader);
        reader.onloadend = () => { // called once readAsDataURL is completed
        this.base64Image = reader.result.toString();
        console.log(reader.result.toString().length);
       };
        const file = event.target.files[0];
        console.log(file);
        this.postForm.get('avatar').setValue(file);

      }
    }
    openSnackBar(message: string, action: string) {
      this.snackBar.open(message, action, {
         duration: 2000,
      });
   }

    onSubmit(postData) {
      // Process checkout data here
      let thisId;
      postData.post = this.editorData;
      const medium = this.datePipe.transform(new Date(), 'MMM d, y, h:mm:ss a');
      console.log(medium);
      console.log(this.postList);
      let id1;
      this.diaryService.savePost(postData, this.userName, this.base64Image, medium, this.checked).subscribe((res: Response) => {
        console.log('Subscribed');
        console.log('Response');
        console.log(res);
        id1 = res as unknown as jsonResponse;
        console.log(id1.id);
        thisId = id1.id;
      });
      this.postList.push(new formDat(thisId, postData.title, postData.post, medium, this.base64Image, this.checked));   //CHANGED

      

      //console.log(this.base64Image);


      // console.log('Your order has been submitted', postData);

      // var fl = postData.avatar;
      // var tmppath = "./assets/images/tmp/" + fl.name;  // Jst to check if working, image from database
      // this.postList.push(new formDat(postData.title, postData.post, medium, tmppath));

      this.openSnackBar(postData.title, 'Post Saved');
    }
    redir(img) {
      window.location.href = '/post?img=' + img;
      console.log('redirecting');
      // location.replace("https://www.w3schools.com")
    }


    editPost(title, post){
      //alert("Edit Not Implemented Title: "+title);
      this.tit= title;
      this.model.editorData = post;
      this.diaryService.deletePost(this.userName, title).subscribe(() => {
        var index = 0;
        for (var i = 0; i < this.postList.length; i++) {
          if (this.postList[i].title === title) {
            index = i;
          }
        }
        this.postList.splice(index, 1);
        this.router.navigate(['/profile']);
      });
      
    }

    deletePost(title){
      this.diaryService.deletePost(this.userName, title).subscribe(() => {
        console.log('deleting');
        //remove from arraylist too
        var index = 0;
        for (var i = 0; i < this.postList.length; i++) {
          if (this.postList[i].title === title) {
            index = i;
          }
        }
        this.postList.splice(index, 1);
        this.router.navigate(['/profile']);
      });
    }

    logout() {
        console.log('Logout');
        this.authService.logout();
    }

    public onChange( event: CKEditor4.EventInfo ) {
      this.editorData = event.editor.getData();
      // console.log( this.editorData );
  }
  ngOnInit() {

  }

}
