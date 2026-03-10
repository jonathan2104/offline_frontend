import {Component, OnInit} from '@angular/core';
import { forkJoin,Observable } from 'rxjs';
import {Location} from '@angular/common';
import {FormBuilder, Validators} from "@angular/forms";
import {MarketBetsService} from "../services/market-bets.service";
import {TennisBetsService} from "../services/tennis/tennis-bets.service";
import {SoccerBetsService} from "../services/soccer/soccer-bets.service";
import {LiveCasinoService} from "../services/livecasino.service";
import {SessionBetsService} from "../services/session-bets.service";
import {FancyBetsService} from "../services/fancy-bets.service";
import {BookmakerBetsService} from "../services/bookmaker-bets.service";
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-profit-loss',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers: []
})
export class ProfitLossComponent implements OnInit {
  yourModelName: string;
  profitFilterForm:any;
  submitted = false;
  match_bets: any = [];
  tennis_bets: any = [];
  soccer_bets: any = [];
  session_bets: any = [];
  bookmaker_bets: any = [];
  fancy_bets: any = [];
  casino_bets: any = [];

  marge_bets: any = [];
  
  currentPage: number = 1;
  itemsPerPage = 10;
  entriesOptions = [10, 20, 50];
  userPl:number = 0;
  user_id = localStorage.getItem('user_id');
  // dtOptions: DataTables.Settings = {};

  today: string = '';
 
  constructor(private fb: FormBuilder,private userService: UserService,private bookmakerBetsService: BookmakerBetsService,private matchBetService: MarketBetsService,private fancyBetsService: FancyBetsService,private sessionBetsService: SessionBetsService, private tennisBetsService: TennisBetsService, private soccerBetService: SoccerBetsService, private liveCasinoService: LiveCasinoService, private _location: Location) {
  }

  ngOnInit(): void {
    this.yourModelName = 'all';
    const currentDate = new Date();
    const localDate = currentDate.getFullYear() +
      '-' + String(currentDate.getMonth() + 1).padStart(2, '0') +
      '-' + String(currentDate.getDate()).padStart(2, '0');

    this.profitFilterForm = this.fb.group({
      sports: [Validators.required],
      from: [new Date().toISOString().substring(0, 10), Validators.required],
      to: [localDate, Validators.required]
    });
    this.getAllBets('all',3);
    const threeDaysBefore = new Date();
    threeDaysBefore.setDate(currentDate.getDate() - 3);
    this.profitFilterForm.get('from').setValue(threeDaysBefore.toISOString().substring(0, 10));
  //   this.dtOptions = {
  //     pagingType: 'full_numbers',
  //     pageLength: 10,
  //     lengthMenu: [10, 25, 50, 100],
  //     processing: true,
  //     searching: false,
  // };
  this.today = localDate; 
  this.getBalance();
  }

  get filterFormControl() {
    return this.profitFilterForm.controls;
  }

  getBalance() {
    const searchData = {
      startdate:this.profitFilterForm.value.from,
      enddate:this.profitFilterForm.value.to
    }
    this.userService.getUserProfitLoss(this.user_id,searchData).subscribe((data: any) => {
      this.userPl = data.profit_loss;
    });
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
    this.getBalance();
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
    if (sport === 'all' || sport === 'casino') {
      observables.push(this.liveCasinoService.getUserCasinoResults(days));
    }
    forkJoin(observables).subscribe({
      next: (responses: any[]) => {
        this.match_bets = responses[0] || [];
        this.bookmaker_bets = responses[1] || [];
        this.session_bets = responses[2] || [];
        this.fancy_bets = responses[3] || [];
        this.soccer_bets = responses[4] || [];
        this.tennis_bets = responses[5] || [];
        this.casino_bets = responses[6] || [];
  
        const marge_bets = [
          ...(this.match_bets as any[]).map(item => ({ ...item, 'matchtype': 'menu-cricket.png' })),
          ...(this.bookmaker_bets as any[]).map(item => ({ ...item, 'matchtype': 'menu-cricket.png' })),
          ...(this.session_bets as any[]).map(item => ({ ...item, 'matchtype': 'menu-cricket.png' })),
          ...(this.fancy_bets as any[]).map(item => ({ ...item, 'matchtype': 'menu-cricket.png' })),
          ...(this.soccer_bets as any[]).map(item => ({ ...item, 'matchtype': 'menu-football.png' })),
          ...(this.tennis_bets as any[]).map(item => ({ ...item, 'matchtype': 'menu-tennis.png' })),
          ...(this.casino_bets as any[]).map(item => ({ ...item, 'matchtype': 'menu-casino.png' })),
        ];
        this.marge_bets = marge_bets.sort((a: any, b: any) => {
            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        });
      },
      error: (error) => {
        console.error('Error fetching bets:', error);
      },
    });
  }

  backClicked(){
    this._location.back();
  }
  onEntriesChange() {
    this.currentPage = 1;
  }
}
