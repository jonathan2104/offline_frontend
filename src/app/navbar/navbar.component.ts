import {Component,ViewChild, EventEmitter, OnChanges, OnInit, Input, Output, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import { forkJoin } from 'rxjs';
import {UserService} from "../services/user.service";
import {ExposureService} from "../services/exposure.service";
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {PopupModalComponent} from "../modals/popup/popup.component";
import {ChangePasswordComponent} from "../modals/change-password/change-password.component";
import {TransactionService} from "../services/transaction.service";

import {MarketBetsService} from "../services/market-bets.service";
import {TennisBetsService} from "../services/tennis/tennis-bets.service";
import {SoccerBetsService} from "../services/soccer/soccer-bets.service";
import {SessionBetsService} from "../services/session-bets.service";
import {FancyBetsService} from "../services/fancy-bets.service";
import {BookmakerBetsService} from "../services/bookmaker-bets.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  //encapsulation:ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();
  @Input() casino_page: boolean;

  isLoggedIn: boolean = false;
  user_id = localStorage.getItem("user_id");
  username = localStorage.getItem("username");
  balance = 0;
  bonus = 0;
  news:string = "";
  exposure: any = [];
  loginForm: any;
  errorMsg: any;
  submitted = false;
  myInterval: any;
  isDarkMode=true;
  totalExposure = 0;
netBalance = 0;

  technical_whatsapp: string = '';

  constructor(public dialog: MatDialog,private router: Router, private fb: FormBuilder, private userService: UserService, private exposureService: ExposureService,private authService:AuthService,private matchBetService: MarketBetsService,private bookmakerBetsService: BookmakerBetsService,private fancyBetsService: FancyBetsService,private sessionBetsService: SessionBetsService, private tennisBetsService: TennisBetsService, private soccerBetService: SoccerBetsService, private transactionService: TransactionService) {

  }


  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    if (localStorage.getItem("isLoggedIn") == "true") {
      this.isLoggedIn = true;

      this.userService.refreshBalance.subscribe(() => {
        this.getBalance();
      })
      this.getBalance();
      this.myInterval = setInterval(() => {
        this.getBalance();
        this.getExposureDetails();
      }, 5000);
      this.exposureService.refresh.subscribe(() => {
        this.getExposureDetails();
      })
      this.getExposureDetails();
    }
    if(this.isLoggedIn){
      const istrue:any = false;
      const isPopup:any = localStorage.getItem("popup");
      if(!isPopup) this.openPopupModal();
      setTimeout(()=>{
        localStorage.setItem("popup",istrue);
      }, 5000);
    }

    this.getNews();
    this.transactionService.getMasterWhatsappByUser().subscribe((res: any) => {
      this.technical_whatsapp = res[0].tech_whatsapp;
    });
    // this.transactionService.getPopupDataRequests().subscribe((res: any) => {
    //     this.technical_whatsapp = res[0].technical_whatsapp;
    // });
  }

  get loginFormControl() {
    return this.loginForm.controls;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/"]).then(() => {
      window.location.reload();
    });
  }

  changePassword() {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      autoFocus: false,
      maxHeight: '100vh',
      maxWidth: '100vh',
      width: '100vh',
      position: { top: '50px' }});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  login() {

    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    } else {
      this.authService.logIn(this.loginForm.value).subscribe({
        next: (res: any) => {
          if (res.error) {
            this.errorMsg = res.message;
          } else {
            localStorage.setItem('token', res.data['token']);
            localStorage.setItem('username', res.data['username']);
            localStorage.setItem('role', res.data['role']);
            localStorage.setItem('user_id', res.data['userId']);
            localStorage.setItem('isLoggedIn', "true");
            this.router.navigateByUrl('/dashboard/home');
            // window.location.reload();
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
    // this.router.navigate(["login"]);
  }
sports(){
    this.router.navigateByUrl("dashboard/match")
}
  logOut() {
    localStorage.removeItem("isLoggedIn");
    this.router.navigate(["login"]).then(() => {
      window.location.reload();
    });
  }

  onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }
getExposureDetails() {
  this.exposureService.getExposure().subscribe(
    (data: any) => {
      this.exposure = data || [];

      console.log('EXPOSURE API RESPONSE 👉', data);

      // ✅ calculate total exposure
      this.totalExposure = this.exposure.reduce((sum: number, item: any) => {
        return sum + Math.abs(item.exp_amount || 0);
      }, 0);

      console.log('TOTAL EXPOSURE 👉', this.totalExposure);

      this.calculateNetBalance();
    },
    () => {
      this.exposure = [];
      this.totalExposure = 0;
      this.calculateNetBalance();
    }
  );
}

  // getExposureDetails() {
  //   this.exposureService.getExposure().subscribe((data: any) => {
  //     // console.log('eeee',data[0]);
  //     this.exposure = data;
  //      console.log('EXPOSURE API RESPONSE 👉', data);
  //   }, (error) => {
  //     this.exposure = [];
  //   })
  // }
getBalance() {
  this.userService.getUserBalance(this.user_id).subscribe((data: any) => {
    this.balance = data.balance || 0;
    this.bonus = data.bonus || 0;

    console.log('BALANCE 👉', this.balance);

    this.calculateNetBalance();
  });
}


calculateNetBalance() {
  this.netBalance = this.balance - this.totalExposure;

  console.log('NET BALANCE 👉', this.netBalance);
}

  // getBalance() {
  //   this.userService.getUserBalance(this.user_id).subscribe((data: any) => {
  //     this.balance = data.balance;
  //     this.bonus = data.bonus || 0;

  //      console.log('BALANCE API RESPONSE 👉', data);
  //   console.log('BALANCE 👉', this.balance);
  //   })
  // }

  refresh() {
    console.log('refreshed');
    if (localStorage.getItem("isLoggedIn") == "true") {
      this.isLoggedIn = true;
      this.userService.getBalanceNext();
      this.exposureService.getExposureNext();

      this.userService.refreshBalance.subscribe(() => {
        this.getBalance();
      })
      this.getBalance();
      this.exposureService.refresh.subscribe(() => {
        this.getExposureDetails();
      })
      this.getExposureDetails();
    }
  }

   config: MatDialogConfig = {
    disableClose: false,
    hasBackdrop: true,
    backdropClass: 'test',
    width: '90%',
    height: '50%',
    panelClass: 'makeItMiddle', //Class Name that can be defined in styles.css as follows:
  };

  openRegister(){
    this.router.navigateByUrl('/register');
  }
  openlogin(){
    this.router.navigateByUrl('/login');
  }

  openPopupModal(){
    const dialogRef = this.dialog.open(PopupModalComponent, {
      maxHeight: '100vh',
      maxWidth: '100vh',
      width: '100vh',
      position: { top: '100px' }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  getAllBets(): Promise<any> {
    return new Promise((resolve, reject) => {
      forkJoin([
        this.matchBetService.getOpenBetsForMatch(),
        this.bookmakerBetsService.getOpenBetsForBookmaker(),
        this.sessionBetsService.getOpenBetsforSession(),
        this.fancyBetsService.getOpenBetsforFancy(),
        this.soccerBetService.getOpenBetsforSoccer(),
        this.tennisBetsService.getOpenBetsforTennis(),
      ]).subscribe({
        next: (responses: [any, any, any, any, any, any]) => {
          const match_bets = responses[0];
          const bookmaker_bets = responses[1];
          const session_bets = responses[2];
          const fancy_bets = responses[3];
          const soccer_bets = responses[4];
          const tennis_bets = responses[5];
  
          const match_odds = [
            ...match_bets.map((item:any) => ({ ...item, matchtype: 'icon-4', sport: 'cricket' })),
            ...soccer_bets.map((item:any) => ({ ...item, matchtype: 'icon-1', sport: 'soccer' })),
            ...tennis_bets.map((item:any) => ({ ...item, matchtype: 'icon-2', sport: 'tennis' })),
          ];
  
          resolve({ match_odds, bookmaker_bets, session_bets, fancy_bets });
        },
        error: (error) => {
          console.error('Error fetching bets:', error);
          reject(error);
        },
      });
    });
  }

  async openbetlist(){
    
    return true;
  }

  setButtonValue(){
    return true;
  }

  getNews() {
      this.news = "";
  }

  darkmode(event: any){
    
    return true;
  }

  openWhatsapp() {
    window.open('https://wa.me/' + this.technical_whatsapp, '_blank');
  }

downloadApk() {
  window.open('https://yourdomain.com/premio-fantasy.apk', '_blank');
}


  ngOnDestroy(): void {
    clearInterval(this.myInterval);
  }

}
