import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.css']
})
export class RegisterModalComponent implements OnInit {
 registerForm: any;
  errorMsg: any;
  submitted = false;
  constructor(private router: Router, private fb: FormBuilder, public dialogRef: MatDialogRef<any>, private userService: UserService, private toastr:ToastrService) { }

  ngOnInit(): void {
      this.registerForm = this.fb.group({
      role: ['5',],
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      contact: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      //email:['',[Validators.required,Validators.email]],
      referer_name: [null,]
    });
  }

   get registerFormControl() {
    return this.registerForm.controls;
  }

  register() {

    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    } else {
      this.userService.createUser(this.registerForm.value).subscribe((res: any) => {
        if (res.errors) {
          this.errorMsg = res.errors;
        } else {
            this.toastr.success("Registered successfully");
            this.dialogRef.close();
        }
      });
    }

  }

  closeDialog() {
    this.dialogRef.close();
  }

}
