import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-referer',
  templateUrl: './referer.component.html',
  styleUrls: ['./referer.component.css']
})
export class RefererComponent implements OnInit {

  registerForm: any;
  errorMsg: any;
  submitted = false;

  constructor(private router: Router, private fb: FormBuilder, private userService: UserService) {
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      role: ['5',],
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      contact: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      email:['',[Validators.required,Validators.email]],
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
          this.router.navigateByUrl('login');
        }
      });
    }

  }

}
