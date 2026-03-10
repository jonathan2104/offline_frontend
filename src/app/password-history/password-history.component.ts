import {Component, ElementRef, HostListener, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-password-history',
  templateUrl: './password-history.component.html',
  styleUrls: ['./password-history.component.css']
})
export class PasswordHistoryComponent implements OnInit {

  password_history: any = [];

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {

  }

}
