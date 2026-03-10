import { Component, OnInit } from '@angular/core';
import { CurrentBetService } from "../services/currentbets.service";
import { MarketBetsService } from "../services/market-bets.service";
import { SessionBetsService } from "../services/session-bets.service";
import { BookmakerBetsService } from "../services/bookmaker-bets.service";
import { FancyBetsService } from "../services/fancy-bets.service";
import { TennisBetsService } from "../services/tennis/tennis-bets.service";
import { SoccerBetsService } from "../services/soccer/soccer-bets.service";

@Component({
  selector: 'app-currentbets',
  templateUrl: './currentbets.component.html',
  styleUrls: ['./currentbets.component.css'],
})
export class CurrentbetsComponent implements OnInit {

  session_bets: any[] = [];
  fancy_bets: any[] = [];
  match_bets: any[] = [];
  bookmaker_bets: any[] = [];

  constructor(
    private currentBetService: CurrentBetService,
    private soccerBetService: SoccerBetsService,
    private tennisBetsService: TennisBetsService,
    private matchBetService: MarketBetsService,
    private sessionBetService: SessionBetsService,
    private bookmakerBetsService: BookmakerBetsService,
    private fancyBetService: FancyBetsService
  ) {}

  ngOnInit(): void {
    this.currentBetService.betData$.subscribe((data) => {
      if (data?.event_id) {
        this.loadAllBets(data.event_id);
      }
    });
  }

  /** Load all bet types for the selected event */
  private loadAllBets(event_id: any) {
    this.getMatchBets(event_id);
    this.getSessionBets(event_id);
    this.getBookmakerBets(event_id);
    this.getFancyBets(event_id);
  }

  private getMatchBets(event_id: any) {
    this.matchBetService.getMatchBets(event_id).subscribe((data: any) => {
      this.match_bets = data || [];
    });
  }

  private getSessionBets(event_id: any) {
    this.sessionBetService.getSessionBet(event_id).subscribe((data: any) => {
      this.session_bets = data || [];
    });
  }

  private getBookmakerBets(event_id: any) {
    this.bookmakerBetsService.getBookmakerBets(event_id).subscribe((data: any) => {
      this.bookmaker_bets = data || [];
    });
  }

  private getFancyBets(event_id: any) {
    this.fancyBetService.getFancyBets(event_id).subscribe((data: any) => {
      this.fancy_bets = data || [];
    });
  }

  /** Helper to check if there are no bets */
  get noBets(): boolean {
    return (
      this.match_bets.length === 0 &&
      this.bookmaker_bets.length === 0 &&
      this.fancy_bets.length === 0 &&
      this.session_bets.length === 0
    );
  }

  selectTab(tabIndex: number): void {
    console.log("Selected tab:", tabIndex);
    // 👉 you can implement navigation, highlight logic, etc.
  }

}