import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  passwordForm: any;
  errorMsg: any;
  submitted = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<any>, private fb: FormBuilder, private userService: UserService, private toasterService: ToastrService) {
    this.passwordForm = this.fb.group({
      old_password: ['', Validators.required],
      new_password: ['', Validators.required],
      confirm_password: ['', Validators.required]
    }, {

      validator: this.ConfirmedValidator('new_password', 'confirm_password')

    });
  }


  ngOnInit(): void {
    this.dialogRef.updateSize('100%',);
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
          this.dismiss();
        }
      }, (error: any) => {
        //console.log('err-->',error);
        this.errorMsg = error.message;
      })
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  dismiss() {
    this.dialogRef.close();
  }

}
