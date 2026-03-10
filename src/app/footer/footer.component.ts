import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  isMobile: boolean;
  @Output() public sidenavToggle = new EventEmitter();

  constructor(private router: Router, private authService: AuthService, private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  ngOnInit(): void {
  }

  onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

  redirectHome() {
    this.router.navigateByUrl('/dashboard');
  }

  isLoggedIn(): boolean {
    // Check the user's authentication status here
    // Return true if the user is logged in, false otherwise
    const isAuthenticated = this.authService.isLoggedIn();
    return isAuthenticated;
  }
  logout() {
    this.authService.logout();
    this.router.navigate(["login"]).then(() => {
      window.location.reload();
    });
  }


}
