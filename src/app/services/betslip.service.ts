import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BetSlipService {
  private sharedData: any = '';
  private parentFunction: () => void | Promise<void>;
  private parentFunctionClear: () => void;
  private casinoParentFunction: () => void | Promise<void>;
  private casinoParentFunctionClear: () => void;

  private betPlacedSource = new Subject<void>();
  betPlaced$ = this.betPlacedSource.asObservable();

  // Trigger after success
  notifyBetPlaced() {
    this.betPlacedSource.next();
  }

  setSharedData(data: any) {
    this.sharedData = data;
  }

  getSharedData(): any {
    return this.sharedData;
  }

  setParentFunction(func: () => Promise<any> | any) {    
    this.parentFunction = func;
  }

  setClearBetFunction(func: () => void) {
    this.parentFunctionClear = func;
  }

  async callParentFunction(): Promise<any> {
    if (this.parentFunction) {
      const result = this.parentFunction();
      if (result instanceof Promise) {
        return await result; // Wait for async result
      }
      return result; // Return sync result
    }
    return null;
  }

  callParentClearFunction() {
    if (this.parentFunctionClear) {
      this.parentFunctionClear();
    }
  }

  setCasinoParentFunction(func: () => void | Promise<void>) {
    this.casinoParentFunction = func;
  }

  setClearCasinoBetFunction(func: () => void) {
    this.casinoParentFunctionClear = func;
  }

  async callCasinoParentFunction(): Promise<void> {
    if (this.casinoParentFunction) {
      const result = this.casinoParentFunction();
      if (result instanceof Promise) {
        await result;
      }
    }
  }

  callCasinoParentClearFunction() {
    if (this.casinoParentFunctionClear) {
      this.casinoParentFunctionClear();
    }
  }
}
