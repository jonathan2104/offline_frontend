import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router,ActivatedRoute} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../services/user.service";
import {TransactionService} from "../services/transaction.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: any;
  errorMsg: any;
  successMsg: string;
  submitted = false;
  inpReadonly = false;
  clicked = false;
  showPassword: boolean = false;
  technical_whatsapp: string = '';

  constructor(private _location: Location,private router: Router,private route: ActivatedRoute, private fb: FormBuilder, private userService: UserService, private transactionService: TransactionService) {
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      role: ['5'],
      name: ['', Validators.required],
      username: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]+$')
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[A-Za-z])(?=.*[0-9]).{6,}$')
      ]],
      contact: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      countryCode: ['+91', Validators.required],   // 👈 default selected
      refererCode: [null]
    });

    // Accessing query parameters
    this.route.queryParams.subscribe(params => {
      const parameterValue = params['referby'];
      if (parameterValue) {
        this.registerForm.get('refererCode').setValue(parameterValue);
        this.inpReadonly = true;
      }
    });

    // 👇 Auto-copy username into name field
    this.registerForm.get('username').valueChanges.subscribe((value: string) => {
      this.registerForm.get('name').setValue(value, { emitEvent: false });
    });
    this.transactionService.getPopupDataRequests().subscribe((res: any) => {
        this.technical_whatsapp = res[0].technical_whatsapp;
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
      this.clicked = true;

      this.userService.createUser(this.registerForm.value).subscribe(
        (res: any) => {
          this.clicked=false;
          if (res.errors) {
            this.errorMsg = res.errors;
          } else {
            this.submitted=false;
            this.successMsg = 'Registration was successful!';
            this.registerForm.reset({
              role: this.registerForm.get('role').value,
              refererCode: this.registerForm.get('refererCode').value
            });
            setTimeout(() => {
              this.successMsg="";
            },2000);
            //this.router.navigateByUrl('register');
          }
        },
        (error) => {
          this.clicked=false;
          if (error.status === 422) {
            this.errorMsg = error.error.errors.map((errorObj: any) => errorObj.username).join(' ');
            setTimeout(() => {
              this.errorMsg="";
            },5000);
          }
        }
      );

      return ;
    }

  }

  goBack(){
      return;
    }

  openWhatsapp() {
    window.open('https://wa.me/' + this.technical_whatsapp, '_blank');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}
