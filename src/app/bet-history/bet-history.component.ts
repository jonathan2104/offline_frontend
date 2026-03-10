import {Component, OnInit} from '@angular/core';
import { forkJoin,Observable } from 'rxjs';
import {Location} from '@angular/common';
import {FormBuilder, Validators} from "@angular/forms";
import {MarketBetsService} from "../services/market-bets.service";
import {TennisBetsService} from "../services/tennis/tennis-bets.service";
import {SoccerBetsService} from "../services/soccer/soccer-bets.service";
import {SessionBetsService} from "../services/session-bets.service";
import {FancyBetsService} from "../services/fancy-bets.service";
import {BookmakerBetsService} from "../services/bookmaker-bets.service";

@Component({
  selector: 'app-bet-history',
  templateUrl: './bet-history.component.html',
  styleUrls: ['./bet-history.component.css'],
  providers: []
})
export class BethistoryComponent implements OnInit {
  yourModelName: string;
  profitFilterForm:any;
  submitted = false;
  match_bets: any = [];
  tennis_bets: any = [];
  soccer_bets: any = [];
  session_bets: any = [];
  bookmaker_bets: any = [];
  fancy_bets: any = [];

  marge_bets: any = [];
  user_id = localStorage.getItem('user_id');
  bet_history: any =[];

  constructor(private fb: FormBuilder,private bookmakerBetsService: BookmakerBetsService,private matchBetService: MarketBetsService,private fancyBetsService: FancyBetsService,private sessionBetsService: SessionBetsService, private tennisBetsService: TennisBetsService, private soccerBetService: SoccerBetsService, private _location: Location) {
  }

  ngOnInit(): void {
    this.yourModelName = 'all';
    this.profitFilterForm = this.fb.group({
      sports: ['cricket',Validators.required],
      source: ['data',Validators.required],
      status: [0,Validators.required],
      from: [new Date().toISOString().substring(0, 10), Validators.required],
      to: [new Date().toISOString().substring(0, 10), Validators.required],
      user_id: [this.user_id]
    });
    this.getAllBets('all',3);
    const currentDate = new Date();
    const threeDaysBefore = new Date();
    threeDaysBefore.setDate(currentDate.getDate() - 1);
    this.profitFilterForm.get('from').setValue(threeDaysBefore.toISOString().substring(0, 10));
  }

  get filterFormControl() {
    return this.profitFilterForm.controls;
  }

  daysDiff(start:any,end:any) {
    let start_date = new Date(start);
    let end_date = new Date(end);
    const startUTC = Date.UTC(start_date.getFullYear(), start_date.getMonth(), start_date.getDate());
    const endUTC = Date.UTC(end_date.getFullYear(), end_date.getMonth(), end_date.getDate());

    const diffInMs = endUTC - startUTC;
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  }

  filter () {
    const days = this.daysDiff(this.profitFilterForm.value.from,this.profitFilterForm.value.to);
    const sport = this.profitFilterForm.value.sports;
    this.getAllBets(sport,days);
  }

  getAllBets(sport:any,days:any) {
    const observables: Observable<any>[] = [];
    if (sport === 'all' || sport === 'cricket') {
      observables.push(this.matchBetService.getCloseBetsForMatch(days));
    }
    if (sport === 'all' || sport === 'cricket') {
      observables.push(this.bookmakerBetsService.getCloseBetsForBookmaker(days));
    }
    if (sport === 'all' || sport === 'cricket') {
      observables.push(this.sessionBetsService.getCloseBetsforSession(days));
    }
    if (sport === 'all' || sport === 'cricket') {
      observables.push(this.fancyBetsService.getCloseBetsforFancy(days));
    }
    if (sport === 'all' || sport === 'soccer') {
      observables.push(this.soccerBetService.getCloseBetsforSoccer(days));
    }
    if (sport === 'all' || sport === 'tennis') {
      observables.push(this.tennisBetsService.getCloseBetsforTennis(days));
    }
    forkJoin(observables).subscribe({
      next: (responses: any[]) => {
        this.match_bets = responses[0] || [];
        this.bookmaker_bets = responses[1] || [];
        this.session_bets = responses[2] || [];
        this.fancy_bets = responses[3] || [];
        this.soccer_bets = responses[4] || [];
        this.tennis_bets = responses[5] || [];
  
        this.marge_bets = [
          ...(this.match_bets as any[]).map(item => ({ ...item, 'matchtype': 'menu-cricket.png' })),
          ...(this.bookmaker_bets as any[]).map(item => ({ ...item, 'matchtype': 'menu-cricket.png' })),
          ...(this.session_bets as any[]).map(item => ({ ...item, 'matchtype': 'menu-cricket.png' })),
          ...(this.fancy_bets as any[]).map(item => ({ ...item, 'matchtype': 'menu-cricket.png' })),
          ...(this.soccer_bets as any[]).map(item => ({ ...item, 'matchtype': 'menu-football.png' })),
          ...(this.tennis_bets as any[]).map(item => ({ ...item, 'matchtype': 'menu-tennis.png' })),
        ];
      },
      error: (error) => {
        console.error('Error fetching bets:', error);
      },
    });
  }

  getHistory(){
    this.matchBetService.getBetHistory(this.profitFilterForm.value).subscribe((res: any) => {
      this.bet_history= res;      
    })
  }

  backClicked(){
    this._location.back();
  }
}
