import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {
 loginForm: any;
  errorMsg: any;
  submitted = false;
  constructor(private router: Router, private fb: FormBuilder, public dialogRef: MatDialogRef<any>,  private _authService: AuthService, private toastr:ToastrService) { }

  ngOnInit(): void {
      this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

   get loginFormControl() {
    return this.loginForm.controls;
  }

  demologin() {
    //this.submitted = true;
    const loginId = {username:'demo', password:'12345'};
    this._authService.logIn(loginId).subscribe({
      next: (res: any) => {
        if (res.error) {
          this.errorMsg = res.message;
        } else {
          localStorage.setItem('token', res.data['token']);
          localStorage.setItem('username', res.data['username']);
          localStorage.setItem('role', res.data['role']);
          localStorage.setItem('user_id', res.data['userId']);
          localStorage.setItem('isLoggedIn', "true");
          this.router.navigateByUrl('/');
          window.location.reload();
          this.dialogRef.close();
        }
      }, error: (err) => {
        console.log('err->', err);

        if (err.error.errors[0].hasOwnProperty('username')) {
          this.errorMsg = err.error.errors[0].username;
        } else {
          this.errorMsg = err.message;
        }

      }
    });
  }

  login() {

    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    } else {
      this._authService.logIn(this.loginForm.value).subscribe({
        next: (res: any) => {
          if (res.error) {
            this.errorMsg = res.message;
          } else {
            localStorage.setItem('token', res.data['token']);
            localStorage.setItem('username', res.data['username']);
            localStorage.setItem('role', res.data['role']);
            localStorage.setItem('user_id', res.data['userId']);
            localStorage.setItem('isLoggedIn', "true");
            this.router.navigateByUrl('/');
            window.location.reload();
            this.dialogRef.close();
          }
        }, error: (err) => {
          console.log('err->', err);

          if (err.error.errors[0].hasOwnProperty('username')) {
            this.errorMsg = err.error.errors[0].username;
          } else {
            this.errorMsg = err.message;
          }

        }
      });
    }

  }

  closeDialog() {
    this.dialogRef.close();
  }

}
