// cashout.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {cashoutComponent} from '../cashout/cashout.component';

@Injectable({
  providedIn: 'root'
})
export class CashoutService {
  private calculateSource = new Subject<void>();
  calculate$ = this.calculateSource.asObservable();

  triggerCalculate() {
    console.log('trigger1');
    
    this.calculateSource.next();
  }
}
