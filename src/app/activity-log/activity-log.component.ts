import {Component, ElementRef, HostListener, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.css']
})
export class ActivityLogComponent implements OnInit {

  activity_log: any = [];

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {

  }

}
