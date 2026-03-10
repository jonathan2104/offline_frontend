import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../services/user.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {
  passwordForm: any;
  errorMsg: any;
  submitted = false;

  constructor(private fb: FormBuilder, private userService: UserService, private toasterService: ToastrService) {
    this.passwordForm = this.fb.group({
      old_password: ['', Validators.required],
      new_password: ['', Validators.required],
      confirm_password: ['', Validators.required]
    }, {

      validator: this.ConfirmedValidator('new_password', 'confirm_password')

    });
  }

  ngOnInit(): void {

  }

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors['confirmedValidator']) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({confirmedValidator: true});
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  get passwordFormControl() {
    return this.passwordForm.controls;
  }

  changePassword() {
    this.submitted = true;
    if (this.passwordForm.invalid) {
      return;
    } else {
      let user_data = {user_id: localStorage.getItem('user_id'), ...this.passwordForm.value}
      this.userService.changePassword(user_data).subscribe((res: any) => {
        if (res.error !=null) {
          this.errorMsg = res.error;
        } else {
          this.errorMsg = "";
          this.toasterService.success('password changed successfully..!!')
          this.passwordForm.reset();
        }
      }, (error: any) => {
        //console.log('err-->',error);
        this.errorMsg = error.message;
      })
    }
  }
}
