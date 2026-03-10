// import {Component, EventEmitter, OnInit, Output, Renderer2} from '@angular/core';
// import {Router} from '@angular/router';
// import {environment} from "../../environments/environment";
// import {UserService} from '../services/user.service';
// import {ExposureService} from "../services/exposure.service";
// import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
// import {ChangePasswordComponent} from "../modals/change-password/change-password.component";
// import {RulesModelComponent} from "../modals/rule-book/book.component";
// import {AuthService} from "../services/auth.service";
// import {BannerService} from "../services/banner.service";

// @Component({
//   selector: 'app-sidenav',
//   templateUrl: './sidenav.component.html',
//   styleUrls: ['./sidenav.component.css']
// })
// export class SidenavComponent implements OnInit {
//   balance = 0;
//   is_casino_active: boolean = false;
//   isLoggedIn: boolean = false;
//   exposure: any = [];
//   banner_url: any = [];
//   user_id = localStorage.getItem("user_id");
//   username = localStorage.getItem('username');
//   @Output() public sidenavToggle = new EventEmitter();

//   constructor(private router: Router, private bannerService: BannerService, private authService: AuthService, private userService: UserService, private exposureService: ExposureService, public dialog: MatDialog, private renderer: Renderer2) {
//   }

//   ngOnInit(): void {
//     this.bannerService.getFrontBanner().subscribe((res: any) => {
//       const imageBaseUrl = environment.image_url;
//       this.banner_url = res.map((obj: any) => {
//         return {
//           ...obj,
//           path: imageBaseUrl + obj.path,
//         };
//       });
//     });
//     if (localStorage.getItem("isLoggedIn") == "true") {
//       this.isLoggedIn = true;

//       this.userService.refreshBalance.subscribe(() => {
//         this.getBalance();
//       })
//       this.getBalance();
//       this.exposureService.refresh.subscribe(() => {
//         this.getExposureDetails();
//       })
//       this.getExposureDetails();
//     }
//   }


//   getExposureDetails() {
//     this.exposureService.getExposure().subscribe((data: any) => {
//       //console.log(data[0]);
//       this.exposure = data;
//       // console.log(this.exposure);
//     }, (error) => {
//       this.exposure = [];
//       //console.log(this.exposure);
//     })
//   }

//   getBalance() {
//     this.userService.getUserBalance(this.user_id).subscribe((data: any) => {
//       this.balance = data.balance;
//       this.is_casino_active = data.casino_active;
//     })
//   }


//   logout() {
//     this.authService.logout();
//     this.router.navigate(["login"]).then(() => {
//       window.location.reload();
//     });
//   }

//   config: MatDialogConfig = {
//     disableClose: false,
//     hasBackdrop: true,
//     backdropClass: 'test',
//     width: '90%',
//     height: '50%',
//     panelClass: 'makeItMiddle', //Class Name that can be defined in styles.css as follows:
//   };

//   openDialog() {
//     const dialogRef = this.dialog.open(ChangePasswordComponent, {});

//     dialogRef.afterClosed().subscribe(result => {
//       //console.log(`Dialog result: ${result}`);
//     });


//   }

//   onToggleSidenav = () => {
//     this.sidenavToggle.emit();
//   }

//   openRulesBook() {
//     this.dialog.open(RulesModelComponent,{minWidth: '90vw', maxHeight: '100vh' });
//   }

// }


import { Component, EventEmitter, OnInit, Output, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';
import { ExposureService } from '../services/exposure.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../modals/change-password/change-password.component';
import { RulesModelComponent } from '../modals/rule-book/book.component';
import { AuthService } from '../services/auth.service';
import { BannerService } from '../services/banner.service';
import { TransactionService } from '../services/transaction.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  balance = 0;
  is_casino_active = false;
  isLoggedIn = false;
  exposure: any[] = [];
  banner_url: any[] = [];
  technical_whatsapp = '';
  instagram_channel = '';
  telegram_channel = '';
  email = '';
  user_id = localStorage.getItem('user_id');
  username = localStorage.getItem('username');

  @Output() public sidenavToggle = new EventEmitter<void>();

  constructor(
    private router: Router,
    private bannerService: BannerService,
    private authService: AuthService,
    private userService: UserService,
    private exposureService: ExposureService,
    public dialog: MatDialog,
    private renderer: Renderer2,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.loadBannerData();
    this.getPopupDataRequests();

    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.isLoggedIn = true;
      this.subscribeToBalanceUpdates();
      this.subscribeToExposureUpdates();
    }
  }

  loadBannerData() {
    this.bannerService.getFrontBanner().subscribe((res: any) => {
      const imageBaseUrl = environment.image_url;
      this.banner_url = res.map((obj: any) => ({
        ...obj,
        path: imageBaseUrl + obj.path,
      }));
    });
  }

  subscribeToBalanceUpdates() {
    this.userService.refreshBalance.subscribe(() => {
      this.getBalance();
    });
    this.getBalance();
  }

  subscribeToExposureUpdates() {
    this.exposureService.refresh.subscribe(() => {
      this.getExposureDetails();
    });
    this.getExposureDetails();
  }

  getPopupDataRequests() {
    this.transactionService.getPopupDataRequests().subscribe((res: any) => {
      this.technical_whatsapp = res[0].technical_whatsapp;
      this.instagram_channel = res[0].instagram;
      this.telegram_channel = res[0].telegram;
      this.email = res[0].email;
      console.log(res);
    });
  }

  getExposureDetails() {
    this.exposureService.getExposure().subscribe(
      (data: any) => {
        this.exposure = data;
      },
      (error) => {
        this.exposure = [];
      }
    );
  }

  getBalance() {
    this.userService.getUserBalance(this.user_id).subscribe((data: any) => {
      this.balance = data.balance;
      this.is_casino_active = data.casino_active;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']).then(() => {
      window.location.reload();
    });
  }

  config: MatDialogConfig = {
    disableClose: false,
    hasBackdrop: true,
    backdropClass: 'test',
    width: '90%',
    height: '50%',
    panelClass: 'makeItMiddle',
  };

  openDialog() {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      // Handle dialog result if needed
    });
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  openRulesBook() {
    this.dialog.open(RulesModelComponent, { minWidth: '90vw', maxHeight: '100vh' });
  }

  techSupport() {
    location.href = 'https://wa.me/91' + this.technical_whatsapp;
  }

  instagram() {
    location.href = this.instagram_channel;
    // location.href = this.instagram_channel;
  }

  telegram() {
    location.href = this.telegram_channel;
    // location.href = this.telegram_channel;
  }
}

