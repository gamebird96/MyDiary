import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService, TokenPayload } from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  rememberMe = false;  // State of remember me checkBox
  credentials: TokenPayload = {
    uname: '',
    pass: ''
  };
  isSubmitted: boolean;
  loginForm;
  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService, private router: Router) {
    this.loginForm = this.formBuilder.group({
      login: '',
      password: ''
    });
  }

  ngOnInit() {
  }

  checkCheckBoxvalue(event){
    if (this.isSubmitted === false) {
      this.rememberMe = !this.rememberMe;
    }

  }

  onSubmit(loginData) {
    // Process checkout data here
    this.credentials = {
      uname: loginData.login,
      pass: loginData.password
    };
    this.isSubmitted = true;
    console.log('Your order has been submitted', loginData);
    console.log(this.rememberMe);
    this.authService.login(this.credentials).subscribe(() => {
      this.router.navigate(['/profile']);
    }, (err) => {
      console.error(err);
    });
    //this.authService.logout();
  }


}
