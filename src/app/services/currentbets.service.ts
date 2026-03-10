import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentBetService {
  // Store shared bet data (event_id, game_type, market_id)
  private betDataSource = new BehaviorSubject<any>(null);
  betData$ = this.betDataSource.asObservable();

  setBetData(data: { event_id: string; game_type: string; market_id: string }) {
    this.betDataSource.next(data);
  }

  getCurrentBetData() {
    return this.betDataSource.getValue();
  }
}