import {Component, ElementRef, HostListener, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-timer-overlay',
  templateUrl: './timer-overlay.component.html',
  styleUrls: ['./timer-overlay.component.css']
})
export class TimerOverlayComponent implements OnInit,OnDestroy {

  remainingTime: number = 3;

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.startTimer();
    this.addEscapeKeyUpListener();
  }

  startTimer() {

    const timerInterval = setInterval(() => {
      this.remainingTime--;

      if (this.remainingTime === 0) {

        clearInterval(timerInterval);
        // Perform any necessary actions after the timer completes
      }
    }, 1000);
  }

  addEscapeKeyUpListener() {
    this.elementRef.nativeElement.addEventListener('keyup', this.handleEscapeKeyUp);
  }

  handleEscapeKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      this.elementRef.nativeElement.focus(); // Keep the focus on the dialog
    }
  }

  ngOnDestroy() {
    this.removeEscapeKeyUpListener();
  }

  removeEscapeKeyUpListener() {
    this.elementRef.nativeElement.removeEventListener('keyup', this.handleEscapeKeyUp);
  }

}
