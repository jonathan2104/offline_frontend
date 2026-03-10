import {Component, OnInit} from '@angular/core';
import {MarketBetsService} from "../services/market-bets.service";
import {Router} from "@angular/router";
import {SessionBetsService} from "../services/session-bets.service";
import {TennisBetsService} from "../services/tennis/tennis-bets.service";
import {SoccerBetsService} from "../services/soccer/soccer-bets.service";

@Component({
  selector: 'app-mybets',
  templateUrl: './mybets.component.html',
  styleUrls: ['./mybets.component.css']
})
export class MybetsComponent implements OnInit {

  match_bets: any = [];
  session_bets: any = [];
  tennis_bets: any = [];
  soccer_bets: any = [];

  constructor(private soccerBetService: SoccerBetsService, private tennisBetsService: TennisBetsService, private matchBetService: MarketBetsService, private router: Router, private sessionBetService: SessionBetsService) {
  }

  ngOnInit(): void {
    this.getOpenMatchBets();
    this.getOpenSessionBets();
    this.getOpenTennisBets();
    this.getOpenSoccerBets();
  }

  getOpenMatchBets() {
    this.matchBetService.getOpenBetsForMatch().subscribe((res: any) => {
      this.match_bets = res;
    })
  }

  getOpenSessionBets() {
    this.sessionBetService.getOpenBetsforSession().subscribe((res: any) => {
      this.session_bets = res;
    })
  }

  getOpenTennisBets() {
    this.tennisBetsService.getOpenBetsforTennis().subscribe((res: any) => {
      this.tennis_bets = res;
    })
  }

  getOpenSoccerBets() {
    this.soccerBetService.getOpenBetsforSoccer().subscribe((res: any) => {
      this.soccer_bets= res;

    })
  }

  openMatchDetails(event_id: any) {
    //console.log("eventid", event_id);
    this.router.navigate(['/dashboard/match-details', event_id]);
  }

  openTennisDetails(event_id: any) {
    this.router.navigate(['/dashboard/tennis-details', event_id]);
  }

  openSoccerDetails(event_id: any) {
    this.router.navigate(['/dashboard/soccer-details', event_id]);
  }

}
