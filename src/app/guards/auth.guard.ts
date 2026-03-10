import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from  './../services/auth.service';
import {LoginModalComponent} from "../modals/login-model/login-modal.component";
import {MatDialog} from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(public dialog: MatDialog,private _authService:AuthService,private router: Router) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
     if (!this._authService.isLoggedIn()) {
      // const dialogRef = this.dialog.open(LoginModalComponent, { autoFocus: false, maxHeight: '100vh' });
      // dialogRef.afterClosed().subscribe((result: any) => {
      //   console.log(`Dialog result: ${result}`);
      // });
      this.router.navigate(['/login']); // Redirect to the login page or any other appropriate page
      // return false;
      // return false;
    }
    return this._authService.isLoggedIn();
  }

}
