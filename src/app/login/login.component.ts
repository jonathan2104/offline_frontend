import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormGroup, FormBuilder, Validators, AbstractControl} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {LoginModalComponent} from "../modals/login-model/login-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {TransactionService} from "../services/transaction.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})
export class LoginComponent implements OnInit {
  isMobile: boolean;
  loginForm: any;
  changePassForm: any;
  errorMsg: any;
  successMsg: string;
  submitted = false;
  showPassword: boolean = false;
  technical_whatsapp: string = '';
  canlogin:boolean=true;
  isLoginLoading = false;
  isDemoLoading = false;

  constructor(public dialog: MatDialog,private router: Router, private fb: FormBuilder, private _authService: AuthService, private breakpointObserver: BreakpointObserver,private route: ActivatedRoute, private transactionService: TransactionService, private toastr:ToastrService) {
    // this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
    //   this.isMobile = result.matches;
    // });
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.changePassForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[A-Za-z])(?=.*[0-9]).{6,}$')
      ]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.matchPasswords });

    this.route.queryParams.subscribe(params => {
      const message = params['message'];
      if (message === 'RegistrationSuccessful') {
        this.successMsg = 'Registration was successful!';
      }
    });
    this.transactionService.getPopupDataRequests().subscribe((res: any) => {
        this.technical_whatsapp = res[0].technical_whatsapp;
    });
  }

  get loginFormControl() {
    return this.loginForm.controls;
  }

  get formControl2() {
    return this.changePassForm.controls;
  }

  matchPasswords(control: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
  
    if (newPassword !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ 'passwordMismatch': true });
      return { 'passwordMismatch': true };
    } else {
      return null;
    }
  }

  demologin() {
    this.isDemoLoading = true;
    this.errorMsg = '';

    const loginId = { username: 'demo', password: '12345' };
    this._authService.logIn(loginId).subscribe({
      next: (res: any) => {
        this.isDemoLoading = false;

        if (res.error) {
          this.errorMsg = res.message;
        } else {
          localStorage.setItem('token', res.data['token']);
          localStorage.setItem('username', res.data['username']);
          localStorage.setItem('role', res.data['role']);
          localStorage.setItem('user_id', res.data['userId']);
          localStorage.setItem('isLoggedIn', "true");
          this.router.navigateByUrl('/dashboard/home');
        }
      },
      error: (err) => {
        this.isDemoLoading = false;

        if (err.error.errors?.[0]?.hasOwnProperty('username')) {
          this.errorMsg = err.error.errors[0].username;
        } else {
          this.errorMsg = err.message;
        }
      }
    });
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    this.submitted = true;
    this.isLoginLoading = true;
    this.errorMsg = '';

    const { username, password, rememberme } = this.loginForm.value;
    this._authService.logIn({ username, password }).subscribe({
      next: (res: any) => {
        this.isLoginLoading = false;
        this.submitted = false;

        if (res.error) {
          this.errorMsg = res.message;
        } else {
          const user_jsonT: any = JSON.stringify(res.data['user_details']);
          const user_json = JSON.parse(user_jsonT);

          if (user_json.password_version == '1') {
            this.canlogin = false;
            this.errorMsg = '';
            return;
          }

          localStorage.setItem('token', res.data['token']);
          localStorage.setItem('username', res.data['username']);
          localStorage.setItem('role', res.data['role']);
          localStorage.setItem('user_id', res.data['userId']);
          localStorage.setItem('isLoggedIn', "true");

          if (rememberme) {
            localStorage.removeItem('expiresAt');
          } else {
            const expiresAt = Date.now() + 30 * 60 * 1000;
            localStorage.setItem('expiresAt', expiresAt.toString());
          }

          this.router.navigateByUrl('/dashboard/home');
        }
      },
      error: (err) => {
        this.isLoginLoading = false;
        this.submitted = false;

        if (err.error.errors?.[0]?.hasOwnProperty('username')) {
          this.errorMsg = err.error.errors[0].username;
        } else {
          this.errorMsg = err.message;
        }
      }
    });
  }

  ChangePassword() {
    if (this.changePassForm.invalid) {
      return;
    }else{
      this.submitted = true;
      let user_data = {
        oldPassword: this.changePassForm.value.oldPassword,
        newPassword: this.changePassForm.value.newPassword,
        confirmPassword: this.changePassForm.value.confirmPassword,
        username:this.loginForm.value.username
      }
      this._authService.changePasswordWithOld(user_data).subscribe((res: any) => {
          this.submitted = false;
          if (res.success) {
            this.toastr.success("Password Changed Successfully.");
            this.canlogin = true;
            this.loginForm.reset();
          } else {
            this.toastr.error(res.message);
          }
        }, (err) => {
          this.submitted = false;
          this.toastr.error("An error occurred while changing the password. Please try again.");
        }
      );
    }
  }

  register() {
    this.router.navigateByUrl("register");
  }

  openlogin(){
      const dialogRef = this.dialog.open(LoginModalComponent, { autoFocus: false, maxHeight: '100vh' });
      dialogRef.afterClosed().subscribe((result: any) => {
        console.log(`Dialog result: ${result}`);
      });
  }
  goBack(){
    if(this.canlogin){
      this.router.navigateByUrl('/');
      return;
    }
    this.canlogin = true;
  }

  openWhatsapp() {
    window.open('https://wa.me/' + this.technical_whatsapp, '_blank');
  }

  downloadApk() {
    const apkUrl = '/assets/apk/premio99.apk';
    const link = document.createElement('a');
    link.href = apkUrl;
    link.download = 'premio99.apk'; 
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}
}
