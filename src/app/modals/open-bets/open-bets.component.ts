import {Component, Inject, OnInit} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import { forkJoin,merge,Observable } from 'rxjs';
import {Location} from '@angular/common';
import {MarketBetsService} from "../../services/market-bets.service";
import {TennisBetsService} from "../../services/tennis/tennis-bets.service";
import {SoccerBetsService} from "../../services/soccer/soccer-bets.service";
import {SessionBetsService} from "../../services/session-bets.service";
import {FancyBetsService} from "../../services/fancy-bets.service";
import {BookmakerBetsService} from "../../services/bookmaker-bets.service";
import {SoccerSessionBetService} from "../../services/soccer/soccersession-bets.service";
import {TennisSessionBetService} from "../../services/tennis/tennissession-bets.service";
@Component({
  selector: 'app-open-bets',
  templateUrl: './open-bets.component.html',
  styleUrls: ['./open-bets.component.css']
})
export class OpenbetsComponent implements OnInit {
  passwordForm: any;
  errorMsg: any;
  submitted = false;
  match_bets: any = [];
  tennis_bets: any = [];
  soccer_bets: any = [];
  session_bets: any = [];
  bookmaker_bets: any = [];
  fancy_bets: any = [];
  soccersession_bets: any = [];
  tennissession_bets: any = [];
  grouped_match_bets: any = [];
  grouped_soccer_bets: any = [];
  grouped_tennis_bets: any = [];

  marge_bets: any = [];
  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder, private userService: UserService, private toasterService: ToastrService,private matchBetService: MarketBetsService,private bookmakerBetsService: BookmakerBetsService,private fancyBetsService: FancyBetsService,private sessionBetsService: SessionBetsService, private tennisBetsService: TennisBetsService, private soccerBetService: SoccerBetsService, private _location: Location, private soccerSessionBetService : SoccerSessionBetService, private tennisSessionBetService : TennisSessionBetService) {
  }


  ngOnInit(): void {
    this.getAllBets();
  }

  getAllBets() {
    forkJoin([
      this.matchBetService.getOpenBetsForMatch(),
      this.bookmakerBetsService.getOpenBetsForBookmaker(),
      this.sessionBetsService.getOpenBetsforSession(),
      this.fancyBetsService.getOpenBetsforFancy(),
      this.soccerBetService.getOpenBetsforSoccer(),
      this.tennisBetsService.getOpenBetsforTennis(),
      // this.soccerSessionBetService.getOpenBetsforSoccerSession(),
      // this.tennisSessionBetService.getOpenBetsforTennisSession()
    ]).subscribe({
      next: (responses: [any, any, any, any, any, any]) => {
        this.match_bets = responses[0];
        this.bookmaker_bets = responses[1];
        this.session_bets = responses[2];
        this.fancy_bets = responses[3];
        this.soccer_bets = responses[4];
        this.tennis_bets = responses[5];
        // this.soccersession_bets = responses[6];
        // this.tennissession_bets = responses[7];
  
        // Merge bets for grouping
        const all_cricket_bets = [
          ...(this.match_bets as any[]),
          ...(this.bookmaker_bets as any[]),
          ...(this.session_bets as any[]),
          ...(this.fancy_bets as any[]),
        ];
  
        // Group by event_id
        this.grouped_match_bets = Object.values(
          all_cricket_bets.reduce((acc: any, bet: any) => {
            if (!acc[bet.event_id]) {
              acc[bet.event_id] = {
                event_id: bet.event_id,
                event_name: bet.event_name,
                bets: []
              };
            }
            acc[bet.event_id].bets.push(bet);
            return acc;
          }, {})
        );
  
          this.grouped_soccer_bets = Object.values(
          this.soccer_bets.reduce((acc: any, bet: any) => {
            if (!acc[bet.event_id]) {
              acc[bet.event_id] = {
                event_id: bet.event_id,
                event_name: bet.event_name,
                bets: []
              };
            }
            acc[bet.event_id].bets.push(bet);
            return acc;
          }, {})
        );

        this.grouped_tennis_bets = Object.values(
          this.tennis_bets.reduce((acc: any, bet: any) => {
            if (!acc[bet.event_id]) {
              acc[bet.event_id] = {
                event_id: bet.event_id,
                event_name: bet.event_name,
                bets: []
              };
            }
            acc[bet.event_id].bets.push(bet);
            return acc;
          }, {})
        );
        // Merge all sports for full display (your existing code)
        // this.marge_bets = [
        //   ...(this.match_bets as any[]).map(item => ({ ...item, matchtype: 'menu-cricket.png' })),
        //   ...(this.bookmaker_bets as any[]).map(item => ({ ...item, matchtype: 'menu-cricket.png' })),
        //   ...(this.session_bets as any[]).map(item => ({ ...item, matchtype: 'menu-cricket.png' })),
        //   ...(this.fancy_bets as any[]).map(item => ({ ...item, matchtype: 'menu-cricket.png' })),
        //   ...(this.soccer_bets as any[]).map(item => ({ ...item, matchtype: 'menu-football.png' })),
        //   ...(this.tennis_bets as any[]).map(item => ({ ...item, matchtype: 'menu-tennis.png' })),
        // ];
      },
      error: (error) => {
        console.error('Error fetching bets:', error);
      },
    });
  }
  

  closeDialog() {

  }

  dismiss() {
    this.activeModal.close();
  }

}
