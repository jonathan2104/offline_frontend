import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-animated-progress-bar',
  template: `
    <div class="progress-bar-wrapper" [style.width.%]="value">
      <mat-progress-bar mode="determinate" [value]="100"></mat-progress-bar>
    </div>
  `,
  styles: [`
    .progress-bar-wrapper {
      transition: width 1s ease-in-out;
    }
    mat-progress-bar {
      width: 100%;
      height: 7px;
    }
  `]
})
export class AnimatedProgressBarComponent implements OnChanges {
  @Input() value: number;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.value = changes['value'].currentValue;
    }
  }
}
