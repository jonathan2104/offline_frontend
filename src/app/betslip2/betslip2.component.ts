import {
  Component,
  OnInit,
  Inject,
  ElementRef,
  ViewChild,
  Renderer2,
  AfterViewInit,
  Input,
  EventEmitter,
  Output,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SessionBetsService } from "../services/session-bets.service";
import { ToastrService } from "ngx-toastr";
import { ExposureService } from "../services/exposure.service";
import { MarketBetsService } from "../services/market-bets.service";
import { UserService } from "../services/user.service";
import { TennisBetsService } from "../services/tennis/tennis-bets.service";
import { MatchService } from "../services/match.service";
import { BookmakerService } from "../services/bookmaker.service";
import { TennisoddsService } from "../services/tennis/tennisodds.service";
import { SoccerBetsService } from "../services/soccer/soccer-bets.service";
import { SocceroddsService } from "../services/soccer/soccerodds.service";

import { BookmakerBetsService } from "../services/bookmaker-bets.service";
import { FancyBetsService } from "../services/fancy-bets.service";
import { SoccerSessionService } from "../services/soccer/soccersession.service";
import { SoccerSessionBetService } from "../services/soccer/soccersession-bets.service";
import { TennisSessionService } from "../services/tennis/tennissession.service";
import { TennisSessionBetService } from "../services/tennis/tennissession-bets.service";

@Component({
  selector: "app-betslip2",
  templateUrl: "./betslip2.component.html",
  styleUrls: ["./betslip2.component.css"],
})
export class Betslip2Component implements OnInit {
  showTimerOverlay: boolean = false;
  timerActive: boolean = false;

  price: number;
  size: any;
  count: number = 0;
  static profit: any;
  static loss: any;
  isLoading = false;

  finalLoss: number;
  finalProfit: number;
  exposure: any = {};
  is_switch = false;
  exp_amount: number;
  exp_amount1: number;
  exp_amount2: number;
  exp_amount3: number;
  existing_matchBet: any = [];
  existing_fancyBet: any = [];
  existing_BookmakerBet: any = [];
  existing_tennisBet: any = [];
  existing_soccerBet: any = [];
  existing_soccerSessionBet: any = [];
  existing_tennisSessionBet: any = [];
  existing_sessionBet: any = [];
  userBalance: number = 0;
  m_exp: any;
  last_min_exp: any = 0;

  submitted_disabled = false;
  event_fees: any;
  is_manual_price: number = 0;
  public classReference = Betslip2Component;
  @Input() data!: any;

  constructor(
    private renderer: Renderer2,
    private soccerOddService: SocceroddsService,
    private tennisOddService: TennisoddsService,
    private matchService: MatchService,
    private tennisBetService: TennisBetsService,
    private sessionBetsService: SessionBetsService,
    private toastr: ToastrService,
    private exposureService: ExposureService,
    private matchBetService: MarketBetsService,
    private soccerBetService: SoccerBetsService,
    private userService: UserService,
    private bookMakerBetService: BookmakerBetsService,
    private FancyBetService: FancyBetsService,
    private soccerSessionBetService: SoccerSessionBetService,
    private soccerSessionService: SoccerSessionService,
    private tennisSessionBetService: TennisSessionBetService,
    private tennisSessionService: TennisSessionService,
  ) {}

  ngOnInit(): void {
    // this.dialogRef.updateSize('100%',);
    // console.log('betslip',this.data);
    this.price = Number(this.data.value.price);
    this.size = Number(this.data.value.size);
    // console.log(this.data.m_type);
  }
  @Output() closeBetslip = new EventEmitter<void>();

  closebetslipcomponent() {
    this.closeBetslip.emit(); // notify parent
  }

  closeDialog() {
    // this.dialogRef.close();
  }

  incre(value?: number) {
    if (!value) {
      this.count = this.count + 100;
    } else {
      this.count = this.count + value;
    }
    this.calculate();
  }

  decre(value?: number) {
    if (!value) {
      this.count = this.count - 100;
    } else {
      this.count = value;
    }
    this.calculate();
  }

  calculate() {
    if (this.data.m_type == "session") {
      this.sessionBetsService
        .getSessionByRunnerEvent(
          this.data.event_id,
          this.data.runner_name.trim(),
        )
        .subscribe((res: any) => {
          this.existing_sessionBet = res;
          if (this.existing_sessionBet.length == 0) {
            //console.log('not exists');

            if (this.size <= 100) {
              Betslip2Component.loss = 100;
              Betslip2Component.profit = this.size;
              this.finalLoss = Betslip2Component.loss;
              this.finalProfit = Betslip2Component.profit;
            } else {
              Betslip2Component.loss = this.size;
              Betslip2Component.profit = 100;
              this.finalLoss = Betslip2Component.loss;
              this.finalProfit = Betslip2Component.profit;
            }
            this.finalLoss = (this.count / 100) * Betslip2Component.loss;
            this.finalProfit = (this.count / 100) * Betslip2Component.profit;
            switch (this.data.type) {
              case "Back":
                this.exp_amount1 = this.finalProfit;
                this.exp_amount2 = 0 - this.finalLoss;
                break;
              case "Lay":
                this.exp_amount1 = 0 - this.finalLoss;
                this.exp_amount2 = this.finalProfit;
                break;
            }
          } else {
            //console.log('existingbet----->', this.existing_sessionBet[0]);
            if (
              this.existing_sessionBet[0].runner_name == this.data.runner_name
            ) {
              this.last_min_exp = Math.min(
                this.existing_sessionBet[0].exp_amount1,
                this.existing_sessionBet[0].exp_amount2,
              );
              if (this.size <= 100) {
                Betslip2Component.loss = 100;
                Betslip2Component.profit = this.size;
                this.finalLoss = Betslip2Component.loss;
                this.finalProfit = Betslip2Component.profit;
              } else {
                Betslip2Component.loss = this.size;
                Betslip2Component.profit = 100;
                this.finalLoss = Betslip2Component.loss;
                this.finalProfit = Betslip2Component.profit;
              }
              this.finalLoss = (this.count / 100) * Betslip2Component.loss;
              this.finalProfit = (this.count / 100) * Betslip2Component.profit;
              switch (this.data.type) {
                case "Back":
                  this.exp_amount1 =
                    this.existing_sessionBet[0].exp_amount1 + this.finalProfit;
                  this.exp_amount2 =
                    this.existing_sessionBet[0].exp_amount2 +
                    (0 - this.finalLoss);
                  break;
                case "Lay":
                  //console.log(this.finalLoss);
                  //console.log(this.existing_sessionBet[0].exp_amount1);
                  this.exp_amount1 =
                    this.existing_sessionBet[0].exp_amount1 +
                    (0 - this.finalLoss);
                  this.exp_amount2 =
                    this.existing_sessionBet[0].exp_amount2 + this.finalProfit;
                  break;
                default:
                  break;
              }
              //console.log('1', this.exp_amount1);
              //console.log('2', this.exp_amount2);
            }
          }
        });
    } else if (this.data.m_type == "bookmaker") {
      this.bookMakerBetService
        .getBookmakerUserBetsByEventId(this.data.event_id)
        .subscribe((res: any) => {
          this.existing_BookmakerBet = res;
          if (
            this.existing_BookmakerBet.length == 0 ||
            this.existing_BookmakerBet == null
          ) {
            this.calculateFirstBookmakerByIndex(this.data.index);
          } else {
            if (this.data.enable_draw) {
              this.last_min_exp = Math.min(
                this.existing_BookmakerBet[0].exp_amount1,
                this.existing_BookmakerBet[0].exp_amount2,
                this.existing_BookmakerBet[0].exp_amount3,
              );
            } else if (this.data.enable_draw == false) {
              this.last_min_exp = Math.min(
                this.existing_BookmakerBet[0].exp_amount1,
                this.existing_BookmakerBet[0].exp_amount2,
              );
            }
            if (
              this.existing_BookmakerBet[0].runner_name == this.data.runner_name
            ) {
              this.calcaulteByBookmakerIndex(this.data.index);
            } else {
              this.calcaulteByBookmakerIndex(this.data.index);
            }
          }
        });
    } else if (
      this.data.m_type == "match_odd" &&
      this.data.g_type == "cricket"
    ) {
      this.matchBetService
        .getUserBetsByEventId(this.data.event_id)
        .subscribe((res: any) => {
          this.existing_matchBet = res;
          if (this.existing_matchBet.length == 0) {
            this.calculateFirstSwitchByIndex(this.data.index);
          } else {
            //console.log(this.existing_matchBet[0].runner_name);
            if (this.data.enable_draw) {
              this.last_min_exp = Math.min(
                this.existing_matchBet[0].exp_amount1,
                this.existing_matchBet[0].exp_amount2,
                this.existing_matchBet[0].exp_amount3,
              );
            } else if (this.data.enable_draw == false) {
              this.last_min_exp = Math.min(
                this.existing_matchBet[0].exp_amount1,
                this.existing_matchBet[0].exp_amount2,
              );
            }
            if (
              this.existing_matchBet[0].runner_name == this.data.runner_name
            ) {
              this.calcaulteByIndex(this.data.index);
            } else {
              this.calcaulteByIndex(this.data.index);
            }
          }
        });
    } else if (
      this.data.m_type == "match_odd" &&
      this.data.g_type == "tennis"
    ) {
      this.tennisBetService
        .getUserTennisBetsByEventId(this.data.event_id)
        .subscribe((res: any) => {
          this.existing_tennisBet = res;
          if (this.existing_tennisBet.length == 0) {
            this.calculateFirstSwitchByIndex(this.data.index);
          } else {
            // console.log(this.existing_tennisBet[0].runner_name);
            if (this.data.enable_draw) {
              this.last_min_exp = Math.min(
                this.existing_tennisBet[0].exp_amount1,
                this.existing_tennisBet[0].exp_amount2,
                this.existing_tennisBet[0].exp_amount3,
              );
            } else if (this.data.enable_draw == false) {
              this.last_min_exp = Math.min(
                this.existing_tennisBet[0].exp_amount1,
                this.existing_tennisBet[0].exp_amount2,
              );
            }
            if (
              this.existing_tennisBet[0].runner_name == this.data.runner_name
            ) {
              this.calculateTennisByIndex(this.data.index);
            } else {
              this.calculateTennisByIndex(this.data.index);
            }
          }
        });
    } else if (
      this.data.m_type == "match_odd" &&
      this.data.g_type == "soccer"
    ) {
      this.soccerBetService
        .getUserSoccerBetsByEventId(this.data.event_id, this.data.market_id)
        .subscribe((res: any) => {
          this.existing_soccerBet = res;
          if (this.existing_soccerBet.length == 0) {
            this.calculateFirstSwitchByIndex(this.data.index);
          } else {
            //console.log(this.existing_soccerBet[0].runner_name);
            if (this.data.enable_draw) {
              this.last_min_exp = Math.min(
                this.existing_soccerBet[0].exp_amount1,
                this.existing_soccerBet[0].exp_amount2,
                this.existing_soccerBet[0].exp_amount3,
              );
            } else if (this.data.enable_draw == false) {
              this.last_min_exp = Math.min(
                this.existing_soccerBet[0].exp_amount1,
                this.existing_soccerBet[0].exp_amount2,
              );
            }

            if (
              this.existing_soccerBet[0].runner_name == this.data.runner_name
            ) {
              this.calculateSoccerByIndex(this.data.index);
            } else {
              this.calculateSoccerByIndex(this.data.index);
            }
          }
        });
    } else if (this.data.m_type == "fancy" && this.data.g_type == "cricket") {
      //console.log("in fancy cal");
      this.FancyBetService.getFancyBetsByRunnerEvent(
        this.data.event_id,
        this.data.runner_name,
      ).subscribe((res: any) => {
        this.existing_fancyBet = res;
        if (this.existing_fancyBet.length == 0) {
          this.calculateFirstSwitchByIndex(this.data.index);
        } else {
          //console.log(this.existing_fancyBet[0].runner_name);
          if (this.data.enable_draw) {
            this.last_min_exp = Math.min(
              this.existing_fancyBet[0].exp_amount1,
              this.existing_fancyBet[0].exp_amount2,
              this.existing_fancyBet[0].exp_amount3,
            );
          } else if (this.data.enable_draw == false) {
            this.last_min_exp = Math.min(
              this.existing_fancyBet[0].exp_amount1,
              this.existing_fancyBet[0].exp_amount2,
            );
          }
          if (this.existing_fancyBet[0].runner_name == this.data.runner_name) {
            this.calcaulteFancyByIndex(this.data.index);
          } else {
            this.calcaulteFancyByIndex(this.data.index);
          }
        }
      });
    } else if (
      this.data.m_type != "match_odd" &&
      this.data.g_type == "soccer"
    ) {
      this.soccerSessionBetService
        .getUserSoccerSessionBetsByEventId(
          this.data.event_id,
          this.data.market_id,
          this.data.m_type.trim(),
        )
        .subscribe((res: any) => {
          this.existing_soccerSessionBet = res;
          if (this.existing_soccerSessionBet.length == 0) {
            this.calculateFirstSwitchByIndex(this.data.index);
          } else {
            //console.log(this.existing_soccerBet[0].runner_name);
            if (this.data.enable_draw) {
              this.last_min_exp = Math.min(
                this.existing_soccerSessionBet[0].exp_amount1,
                this.existing_soccerSessionBet[0].exp_amount2,
                this.existing_soccerSessionBet[0].exp_amount3,
              );
            } else if (this.data.enable_draw == false) {
              this.last_min_exp = Math.min(
                this.existing_soccerSessionBet[0].exp_amount1,
                this.existing_soccerSessionBet[0].exp_amount2,
              );
            }

            if (
              this.existing_soccerSessionBet[0].runner_name ==
              this.data.runner_name
            ) {
              this.calculateSoccerSessionByIndex(this.data.index);
            } else {
              this.calculateSoccerSessionByIndex(this.data.index);
            }
          }
        });
    } else if (
      this.data.m_type != "match_odd" &&
      this.data.g_type == "tennis"
    ) {
      this.tennisSessionBetService
        .getUserTennisSessionBetsByEventId(
          this.data.event_id,
          this.data.market_id,
          this.data.m_type.trim(),
        )
        .subscribe((res: any) => {
          this.existing_tennisSessionBet = res;
          if (this.existing_tennisSessionBet.length == 0) {
            this.calculateFirstSwitchByIndex(this.data.index);
          } else {
            //console.log(this.existing_soccerBet[0].runner_name);
            if (this.data.enable_draw) {
              this.last_min_exp = Math.min(
                this.existing_tennisSessionBet[0].exp_amount1,
                this.existing_tennisSessionBet[0].exp_amount2,
                this.existing_tennisSessionBet[0].exp_amount3,
              );
            } else if (this.data.enable_draw == false) {
              this.last_min_exp = Math.min(
                this.existing_tennisSessionBet[0].exp_amount1,
                this.existing_tennisSessionBet[0].exp_amount2,
              );
            }

            if (
              this.existing_tennisSessionBet[0].runner_name ==
              this.data.runner_name
            ) {
              this.calculateTennisSessionByIndex(this.data.index);
            } else {
              this.calculateTennisSessionByIndex(this.data.index);
            }
          }
        });
    }
  }

  calcaulteByIndex(index: any) {
    //console.log('index-->', index);
    switch (index) {
      case 1:
        if (this.data.type == "Back") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_matchBet[0].exp_amount1 + this.finalProfit;
          this.exp_amount2 =
            this.existing_matchBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_matchBet[0].exp_amount3 + this.finalLoss;
        } else if (this.data.type == "Lay") {
          this.finalProfit = this.count;
          this.finalLoss =
            0 - (+(this.price * this.count).toFixed(2) - this.count);
          this.exp_amount1 =
            this.existing_matchBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_matchBet[0].exp_amount2 + this.finalProfit;
          this.exp_amount3 =
            this.existing_matchBet[0].exp_amount3 + this.finalProfit;
        } else if (this.data.type == "Draw") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_matchBet[0].exp_amount1 + this.finalProfit;
          this.exp_amount2 =
            this.existing_matchBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_matchBet[0].exp_amount3 + this.finalLoss;
        }
        break;
      case 2:
        if (this.data.type == "Back") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_matchBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_matchBet[0].exp_amount2 + this.finalProfit;
          this.exp_amount3 =
            this.existing_matchBet[0].exp_amount3 + this.finalLoss;
        } else if (this.data.type == "Lay") {
          this.finalProfit = this.count;
          this.finalLoss =
            0 - (+(this.price * this.count).toFixed(2) - this.count);
          this.exp_amount1 =
            this.existing_matchBet[0].exp_amount1 + this.finalProfit;
          this.exp_amount2 =
            this.existing_matchBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_matchBet[0].exp_amount3 + this.finalProfit;
        } else if (this.data.type == "Draw") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_matchBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_matchBet[0].exp_amount2 + this.finalProfit;
          this.exp_amount3 =
            this.existing_matchBet[0].exp_amount3 + this.finalLoss;
        }
        break;
      case 3:
        if (this.data.type == "Back") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_matchBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_matchBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_matchBet[0].exp_amount3 + this.finalProfit;
        } else if (this.data.type == "Lay") {
          this.finalProfit = this.count;
          this.finalLoss =
            0 - (+(this.price * this.count).toFixed(2) - this.count);
          this.exp_amount1 =
            this.existing_matchBet[0].exp_amount1 + this.finalProfit;
          this.exp_amount2 =
            this.existing_matchBet[0].exp_amount2 + this.finalProfit;
          this.exp_amount3 =
            this.existing_matchBet[0].exp_amount3 + this.finalLoss;
        } else if (this.data.type == "Draw") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_matchBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_matchBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_matchBet[0].exp_amount3 + this.finalProfit;
        }
        break;
      default:
        break;
      //console.log('e1,e2,e3', this.exp_amount1, this.exp_amount2, this.exp_amount3);
    }
  }

  calcaulteFancyByIndex(index: any) {
    //console.log('index-->', index);
    switch (index) {
      case 1:
        if (this.data.type == "Back") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_fancyBet[0].exp_amount1 + this.finalProfit;
          this.exp_amount2 =
            this.existing_fancyBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_fancyBet[0].exp_amount3 + this.finalLoss;
        } else if (this.data.type == "Lay") {
          this.finalProfit = this.count;
          this.finalLoss =
            0 - (+(this.price * this.count).toFixed(2) - this.count);
          this.exp_amount1 =
            this.existing_fancyBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_fancyBet[0].exp_amount2 + this.finalProfit;
          this.exp_amount3 =
            this.existing_fancyBet[0].exp_amount3 + this.finalProfit;
        } else if (this.data.type == "Draw") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_fancyBet[0].exp_amount1 + this.finalProfit;
          this.exp_amount2 =
            this.existing_fancyBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_fancyBet[0].exp_amount3 + this.finalLoss;
        }
        break;
      case 2:
        if (this.data.type == "Back") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_fancyBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_fancyBet[0].exp_amount2 + this.finalProfit;
          this.exp_amount3 =
            this.existing_fancyBet[0].exp_amount3 + this.finalLoss;
        } else if (this.data.type == "Lay") {
          this.finalProfit = this.count;
          this.finalLoss =
            0 - (+(this.price * this.count).toFixed(2) - this.count);
          this.exp_amount1 =
            this.existing_fancyBet[0].exp_amount1 + this.finalProfit;
          this.exp_amount2 =
            this.existing_fancyBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_fancyBet[0].exp_amount3 + this.finalProfit;
        } else if (this.data.type == "Draw") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_fancyBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_fancyBet[0].exp_amount2 + this.finalProfit;
          this.exp_amount3 =
            this.existing_fancyBet[0].exp_amount3 + this.finalLoss;
        }
        break;
      case 3:
        if (this.data.type == "Back") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_fancyBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_fancyBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_fancyBet[0].exp_amount3 + this.finalProfit;
        } else if (this.data.type == "Lay") {
          this.finalProfit = this.count;
          this.finalLoss =
            0 - (+(this.price * this.count).toFixed(2) - this.count);
          this.exp_amount1 =
            this.existing_fancyBet[0].exp_amount1 + this.finalProfit;
          this.exp_amount2 =
            this.existing_fancyBet[0].exp_amount2 + this.finalProfit;
          this.exp_amount3 =
            this.existing_fancyBet[0].exp_amount3 + this.finalLoss;
        } else if (this.data.type == "Draw") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_fancyBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_fancyBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_fancyBet[0].exp_amount3 + this.finalProfit;
        }
        break;
      default:
        break;
      //console.log('e1,e2,e3', this.exp_amount1, this.exp_amount2, this.exp_amount3);
    }
  }

  calcaulteByBookmakerIndex(index: any) {
    console.log("index-->", index);
    switch (index) {
      case 1:
        if (this.data.type == "Back") {
          this.finalProfit = +(this.price * (this.count / 100)).toFixed(2);
          //this.finalProfit = (+(this.price * this.count).toFixed(2)) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_BookmakerBet[0].exp_amount1 + this.finalProfit;
          this.exp_amount2 =
            this.existing_BookmakerBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_BookmakerBet[0].exp_amount3 + this.finalLoss;
        } else if (this.data.type == "Lay") {
          this.finalProfit = this.count;
          //this.finalLoss = 0 - ((+(this.price * this.count).toFixed(2)) - this.count);
          this.finalLoss = 0 - +(this.price * (this.count / 100)).toFixed(2);
          this.exp_amount1 =
            this.existing_BookmakerBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_BookmakerBet[0].exp_amount2 + this.finalProfit;
          this.exp_amount3 =
            this.existing_BookmakerBet[0].exp_amount3 + this.finalProfit;
        } else if (this.data.type == "Draw") {
          // this.finalProfit = (+(this.price * (this.count / 100)).toFixed(2));
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_BookmakerBet[0].exp_amount1 + this.finalProfit;
          this.exp_amount2 =
            this.existing_BookmakerBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_BookmakerBet[0].exp_amount3 + this.finalLoss;
        }
        break;
      case 2:
        if (this.data.type == "Back") {
          this.finalProfit = +(this.price * (this.count / 100)).toFixed(2);
          //this.finalProfit = (+(this.price * this.count).toFixed(2)) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_BookmakerBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_BookmakerBet[0].exp_amount2 + this.finalProfit;
          this.exp_amount3 =
            this.existing_BookmakerBet[0].exp_amount3 + this.finalLoss;
        } else if (this.data.type == "Lay") {
          this.finalProfit = this.count;
          // this.finalLoss = 0 - ((+(this.price * this.count).toFixed(2)) - this.count);
          this.finalLoss = 0 - +(this.price * (this.count / 100)).toFixed(2);
          this.exp_amount1 =
            this.existing_BookmakerBet[0].exp_amount1 + this.finalProfit;
          this.exp_amount2 =
            this.existing_BookmakerBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_BookmakerBet[0].exp_amount3 + this.finalProfit;
        } else if (this.data.type == "Draw") {
          // this.finalProfit = (+(this.price * (this.count / 100)).toFixed(2));
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_BookmakerBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_BookmakerBet[0].exp_amount2 + this.finalProfit;
          this.exp_amount3 =
            this.existing_BookmakerBet[0].exp_amount3 + this.finalLoss;
        }
        break;
      case 3:
        if (this.data.type == "Back") {
          this.finalProfit = +(this.price * (this.count / 100)).toFixed(2);
          //this.finalProfit = (+(this.price * this.count).toFixed(2)) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_BookmakerBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_BookmakerBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_BookmakerBet[0].exp_amount3 + this.finalProfit;
        } else if (this.data.type == "Lay") {
          this.finalProfit = this.count;
          // this.finalLoss = 0 - ((+(this.price * this.count).toFixed(2)) - this.count);
          this.finalLoss = 0 - +(this.price * (this.count / 100)).toFixed(2);
          this.exp_amount1 =
            this.existing_BookmakerBet[0].exp_amount1 + this.finalProfit;
          this.exp_amount2 =
            this.existing_BookmakerBet[0].exp_amount2 + this.finalProfit;
          this.exp_amount3 =
            this.existing_BookmakerBet[0].exp_amount3 + this.finalLoss;
        } else if (this.data.type == "Draw") {
          // this.finalProfit = (+(this.price * (this.count / 100)).toFixed(2));
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_BookmakerBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_BookmakerBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_BookmakerBet[0].exp_amount3 + this.finalProfit;
        }
        break;
      default:
        break;
      //console.log('e1,e2,e3', this.exp_amount1, this.exp_amount2, this.exp_amount3);
    }
  }

  calculateTennisByIndex(index: any) {
    switch (index) {
      case 1:
        if (this.data.type == "Back") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_tennisBet[0].exp_amount1 + this.finalProfit;
          this.exp_amount2 =
            this.existing_tennisBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_tennisBet[0].exp_amount3 + this.finalLoss;
        } else if (this.data.type == "Lay") {
          this.finalProfit = this.count;
          this.finalLoss =
            0 - (+(this.price * this.count).toFixed(2) - this.count);
          this.exp_amount1 =
            this.existing_tennisBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_tennisBet[0].exp_amount2 + this.finalProfit;
          this.exp_amount3 =
            this.existing_tennisBet[0].exp_amount3 + this.finalProfit;
        } else if (this.data.type == "Draw") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_tennisBet[0].exp_amount1 + this.finalProfit;
          this.exp_amount2 =
            this.existing_tennisBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_tennisBet[0].exp_amount3 + this.finalLoss;
        }
        break;
      case 2:
        if (this.data.type == "Back") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_tennisBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_tennisBet[0].exp_amount2 + this.finalProfit;
          this.exp_amount3 =
            this.existing_tennisBet[0].exp_amount3 + this.finalLoss;
        } else if (this.data.type == "Lay") {
          this.finalProfit = this.count;
          this.finalLoss =
            0 - (+(this.price * this.count).toFixed(2) - this.count);
          this.exp_amount1 =
            this.existing_tennisBet[0].exp_amount1 + this.finalProfit;
          this.exp_amount2 =
            this.existing_tennisBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_tennisBet[0].exp_amount3 + this.finalProfit;
        } else if (this.data.type == "Draw") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_tennisBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_tennisBet[0].exp_amount2 + this.finalProfit;
          this.exp_amount3 =
            this.existing_tennisBet[0].exp_amount3 + this.finalLoss;
        }
        break;
      case 3:
        if (this.data.type == "Back") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_tennisBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_tennisBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_tennisBet[0].exp_amount3 + this.finalProfit;
        } else if (this.data.type == "Lay") {
          this.finalProfit = this.count;
          this.finalLoss =
            0 - (+(this.price * this.count).toFixed(2) - this.count);
          this.exp_amount1 =
            this.existing_tennisBet[0].exp_amount1 + this.finalProfit;
          this.exp_amount2 =
            this.existing_tennisBet[0].exp_amount2 + this.finalProfit;
          this.exp_amount3 =
            this.existing_tennisBet[0].exp_amount3 + this.finalLoss;
        } else if (this.data.type == "Draw") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_tennisBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_tennisBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_tennisBet[0].exp_amount3 + this.finalProfit;
        }
        break;
      default:
        break;
    }
  }

  calculateSoccerByIndex(index: any) {
    switch (index) {
      case 1:
        if (this.data.type == "Back") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_soccerBet[0].exp_amount1 + this.finalProfit;
          this.exp_amount2 =
            this.existing_soccerBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_soccerBet[0].exp_amount3 + this.finalLoss;
        } else if (this.data.type == "Lay") {
          this.finalProfit = this.count;
          this.finalLoss =
            0 - (+(this.price * this.count).toFixed(2) - this.count);
          this.exp_amount1 =
            this.existing_soccerBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_soccerBet[0].exp_amount2 + this.finalProfit;
          this.exp_amount3 =
            this.existing_soccerBet[0].exp_amount3 + this.finalProfit;
        } else if (this.data.type == "Draw") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_soccerBet[0].exp_amount1 + this.finalProfit;
          this.exp_amount2 =
            this.existing_soccerBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_soccerBet[0].exp_amount3 + this.finalLoss;
        }
        break;
      case 2:
        if (this.data.type == "Back") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_soccerBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_soccerBet[0].exp_amount2 + this.finalProfit;
          this.exp_amount3 =
            this.existing_soccerBet[0].exp_amount3 + this.finalLoss;
        } else if (this.data.type == "Lay") {
          this.finalProfit = this.count;
          this.finalLoss =
            0 - (+(this.price * this.count).toFixed(2) - this.count);
          this.exp_amount1 =
            this.existing_soccerBet[0].exp_amount1 + this.finalProfit;
          this.exp_amount2 =
            this.existing_soccerBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_soccerBet[0].exp_amount3 + this.finalProfit;
        } else if (this.data.type == "Draw") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_soccerBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_soccerBet[0].exp_amount2 + this.finalProfit;
          this.exp_amount3 =
            this.existing_soccerBet[0].exp_amount3 + this.finalLoss;
        }
        break;
      case 3:
        if (this.data.type == "Back") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_soccerBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_soccerBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_soccerBet[0].exp_amount3 + this.finalProfit;
        } else if (this.data.type == "Lay") {
          this.finalProfit = this.count;
          this.finalLoss =
            0 - (+(this.price * this.count).toFixed(2) - this.count);
          this.exp_amount1 =
            this.existing_soccerBet[0].exp_amount1 + this.finalProfit;
          this.exp_amount2 =
            this.existing_soccerBet[0].exp_amount2 + this.finalProfit;
          this.exp_amount3 =
            this.existing_soccerBet[0].exp_amount3 + this.finalLoss;
        } else if (this.data.type == "Draw") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_soccerBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_soccerBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_soccerBet[0].exp_amount3 + this.finalProfit;
        }
        break;
      default:
        break;
    }
  }

  calculateFirstSwitchByIndex(index: any) {
    switch (index) {
      case 1:
        if (this.data.type == "Back") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 = this.finalProfit;
          this.exp_amount2 = this.finalLoss;
          this.exp_amount3 = this.finalLoss;
        } else if (this.data.type == "Lay") {
          this.finalProfit = this.count;
          this.finalLoss =
            0 - (+(this.price * this.count).toFixed(2) - this.count);
          this.exp_amount1 = this.finalLoss;
          this.exp_amount2 = this.finalProfit;
          this.exp_amount3 = this.finalProfit;
        } else if (this.data.type == "Draw") {
          this.finalLoss = 0 - this.count;
          this.exp_amount1 = this.finalProfit;
          this.exp_amount2 = this.finalLoss;
          this.exp_amount3 = this.finalLoss;
        }
        break;
      case 2:
        if (this.data.type == "Back") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 = this.finalLoss;
          this.exp_amount2 = this.finalProfit;
          this.exp_amount3 = this.finalLoss;
        } else if (this.data.type == "Lay") {
          this.finalProfit = this.count;
          this.finalLoss =
            0 - (+(this.price * this.count).toFixed(2) - this.count);
          this.exp_amount1 = this.finalProfit;
          this.exp_amount2 = this.finalLoss;
          this.exp_amount3 = this.finalProfit;
        } else if (this.data.type == "Draw") {
          this.finalLoss = 0 - this.count;
          this.exp_amount1 = this.finalLoss;
          this.exp_amount2 = this.finalProfit;
          this.exp_amount3 = this.finalLoss;
        }
        break;
      case 3:
        if (this.data.type == "Back") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 = this.finalLoss;
          this.exp_amount3 = this.finalProfit;
          this.exp_amount2 = this.finalLoss;
        } else if (this.data.type == "Lay") {
          this.finalProfit = this.count;
          this.finalLoss =
            0 - (+(this.price * this.count).toFixed(2) - this.count);
          this.exp_amount1 = this.finalProfit;
          this.exp_amount3 = this.finalLoss;
          this.exp_amount2 = this.finalProfit;
        } else if (this.data.type == "Draw") {
          this.finalLoss = 0 - this.count;
          this.exp_amount1 = this.finalLoss;
          this.exp_amount3 = this.finalProfit;
          this.exp_amount2 = this.finalLoss;
        }
        break;
      default:
        break;
    }
  }

  calculateFirstBookmakerByIndex(index: any) {
    switch (index) {
      case 1:
        if (this.data.type == "Back") {
          console.log("xxx", this.price);
          this.finalProfit = +(this.price * (this.count / 100)).toFixed(2);
          //this.finalProfit = (+(this.price * this.count).toFixed(2)) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 = this.finalProfit;
          this.exp_amount2 = this.finalLoss;
          this.exp_amount3 = this.finalLoss;
        } else if (this.data.type == "Lay") {
          this.finalProfit = this.count;
          //this.finalLoss = 0 - ((+(this.price * this.count).toFixed(2)) - this.count);
          this.finalLoss = 0 - +(this.price * (this.count / 100)).toFixed(2);
          this.exp_amount1 = this.finalLoss;
          this.exp_amount2 = this.finalProfit;
          this.exp_amount3 = this.finalProfit;
        } else if (this.data.type == "Draw") {
          this.finalLoss = 0 - this.count;
          this.exp_amount1 = this.finalProfit;
          this.exp_amount2 = this.finalLoss;
          this.exp_amount3 = this.finalLoss;
        }
        break;
      case 2:
        if (this.data.type == "Back") {
          this.finalProfit = +(this.price * (this.count / 100)).toFixed(2);
          // this.finalProfit = (+(this.price * this.count).toFixed(2)) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 = this.finalLoss;
          this.exp_amount2 = this.finalProfit;
          this.exp_amount3 = this.finalLoss;
        } else if (this.data.type == "Lay") {
          this.finalProfit = this.count;
          this.finalLoss = 0 - +(this.price * (this.count / 100)).toFixed(2);
          //this.finalLoss = 0 - ((+(this.price * this.count).toFixed(2)) - this.count);
          this.exp_amount1 = this.finalProfit;
          this.exp_amount2 = this.finalLoss;
          this.exp_amount3 = this.finalProfit;
        } else if (this.data.type == "Draw") {
          this.finalLoss = 0 - this.count;
          this.exp_amount1 = this.finalLoss;
          this.exp_amount2 = this.finalProfit;
          this.exp_amount3 = this.finalLoss;
        }
        break;
      case 3:
        if (this.data.type == "Back") {
          //this.finalProfit = (+(this.price * this.count).toFixed(2)) - this.count;
          this.finalProfit = +(this.price * (this.count / 100)).toFixed(2);
          this.finalLoss = 0 - this.count;
          this.exp_amount1 = this.finalLoss;
          this.exp_amount3 = this.finalProfit;
          this.exp_amount2 = this.finalLoss;
        } else if (this.data.type == "Lay") {
          this.finalProfit = this.count;
          // this.finalLoss = 0 - ((+(this.price * this.count).toFixed(2)) - this.count);
          this.finalLoss = 0 - +(this.price * (this.count / 100)).toFixed(2);
          this.exp_amount1 = this.finalProfit;
          this.exp_amount3 = this.finalLoss;
          this.exp_amount2 = this.finalProfit;
        } else if (this.data.type == "Draw") {
          this.finalLoss = 0 - this.count;
          this.exp_amount1 = this.finalLoss;
          this.exp_amount3 = this.finalProfit;
          this.exp_amount2 = this.finalLoss;
        }
        break;
      default:
        break;
    }
    //console.log('loss', this.finalLoss);
    //console.log('Proit', this.finalProfit);
  }

  calculateSoccerSessionByIndex(index: any) {
    switch (index) {
      case 1:
        if (this.data.type == "Back") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_soccerSessionBet[0].exp_amount1 + this.finalProfit;
          this.exp_amount2 =
            this.existing_soccerSessionBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_soccerSessionBet[0].exp_amount3 + this.finalLoss;
        } else if (this.data.type == "Lay") {
          this.finalProfit = this.count;
          this.finalLoss =
            0 - (+(this.price * this.count).toFixed(2) - this.count);
          this.exp_amount1 =
            this.existing_soccerSessionBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_soccerSessionBet[0].exp_amount2 + this.finalProfit;
          this.exp_amount3 =
            this.existing_soccerSessionBet[0].exp_amount3 + this.finalProfit;
        } else if (this.data.type == "Draw") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_soccerSessionBet[0].exp_amount1 + this.finalProfit;
          this.exp_amount2 =
            this.existing_soccerSessionBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_soccerSessionBet[0].exp_amount3 + this.finalLoss;
        }
        break;
      case 2:
        if (this.data.type == "Back") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_soccerSessionBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_soccerSessionBet[0].exp_amount2 + this.finalProfit;
          this.exp_amount3 =
            this.existing_soccerSessionBet[0].exp_amount3 + this.finalLoss;
        } else if (this.data.type == "Lay") {
          this.finalProfit = this.count;
          this.finalLoss =
            0 - (+(this.price * this.count).toFixed(2) - this.count);
          this.exp_amount1 =
            this.existing_soccerSessionBet[0].exp_amount1 + this.finalProfit;
          this.exp_amount2 =
            this.existing_soccerSessionBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_soccerSessionBet[0].exp_amount3 + this.finalProfit;
        } else if (this.data.type == "Draw") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_soccerSessionBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_soccerSessionBet[0].exp_amount2 + this.finalProfit;
          this.exp_amount3 =
            this.existing_soccerSessionBet[0].exp_amount3 + this.finalLoss;
        }
        break;
      case 3:
        if (this.data.type == "Back") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_soccerSessionBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_soccerSessionBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_soccerSessionBet[0].exp_amount3 + this.finalProfit;
        } else if (this.data.type == "Lay") {
          this.finalProfit = this.count;
          this.finalLoss =
            0 - (+(this.price * this.count).toFixed(2) - this.count);
          this.exp_amount1 =
            this.existing_soccerSessionBet[0].exp_amount1 + this.finalProfit;
          this.exp_amount2 =
            this.existing_soccerSessionBet[0].exp_amount2 + this.finalProfit;
          this.exp_amount3 =
            this.existing_soccerSessionBet[0].exp_amount3 + this.finalLoss;
        } else if (this.data.type == "Draw") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_soccerSessionBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_soccerSessionBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_soccerSessionBet[0].exp_amount3 + this.finalProfit;
        }
        break;
      default:
        break;
    }
  }

  calculateTennisSessionByIndex(index: any) {
    switch (index) {
      case 1:
        if (this.data.type == "Back") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_tennisSessionBet[0].exp_amount1 + this.finalProfit;
          this.exp_amount2 =
            this.existing_tennisSessionBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_tennisSessionBet[0].exp_amount3 + this.finalLoss;
        } else if (this.data.type == "Lay") {
          this.finalProfit = this.count;
          this.finalLoss =
            0 - (+(this.price * this.count).toFixed(2) - this.count);
          this.exp_amount1 =
            this.existing_tennisSessionBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_tennisSessionBet[0].exp_amount2 + this.finalProfit;
          this.exp_amount3 =
            this.existing_tennisSessionBet[0].exp_amount3 + this.finalProfit;
        } else if (this.data.type == "Draw") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_tennisSessionBet[0].exp_amount1 + this.finalProfit;
          this.exp_amount2 =
            this.existing_tennisSessionBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_tennisSessionBet[0].exp_amount3 + this.finalLoss;
        }
        break;
      case 2:
        if (this.data.type == "Back") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_tennisSessionBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_tennisSessionBet[0].exp_amount2 + this.finalProfit;
          this.exp_amount3 =
            this.existing_tennisSessionBet[0].exp_amount3 + this.finalLoss;
        } else if (this.data.type == "Lay") {
          this.finalProfit = this.count;
          this.finalLoss =
            0 - (+(this.price * this.count).toFixed(2) - this.count);
          this.exp_amount1 =
            this.existing_tennisSessionBet[0].exp_amount1 + this.finalProfit;
          this.exp_amount2 =
            this.existing_tennisSessionBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_tennisSessionBet[0].exp_amount3 + this.finalProfit;
        } else if (this.data.type == "Draw") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_tennisSessionBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_tennisSessionBet[0].exp_amount2 + this.finalProfit;
          this.exp_amount3 =
            this.existing_tennisSessionBet[0].exp_amount3 + this.finalLoss;
        }
        break;
      case 3:
        if (this.data.type == "Back") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_tennisSessionBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_tennisSessionBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_tennisSessionBet[0].exp_amount3 + this.finalProfit;
        } else if (this.data.type == "Lay") {
          this.finalProfit = this.count;
          this.finalLoss =
            0 - (+(this.price * this.count).toFixed(2) - this.count);
          this.exp_amount1 =
            this.existing_tennisSessionBet[0].exp_amount1 + this.finalProfit;
          this.exp_amount2 =
            this.existing_tennisSessionBet[0].exp_amount2 + this.finalProfit;
          this.exp_amount3 =
            this.existing_tennisSessionBet[0].exp_amount3 + this.finalLoss;
        } else if (this.data.type == "Draw") {
          this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
          this.finalLoss = 0 - this.count;
          this.exp_amount1 =
            this.existing_tennisSessionBet[0].exp_amount1 + this.finalLoss;
          this.exp_amount2 =
            this.existing_tennisSessionBet[0].exp_amount2 + this.finalLoss;
          this.exp_amount3 =
            this.existing_tennisSessionBet[0].exp_amount3 + this.finalProfit;
        }
        break;
      default:
        break;
    }
  }

  deductEventFees(name: any, type: any) {
    this.userService
      .deductFees(this.data.event_id, name, type)
      .subscribe((res: any) => {
        this.toastr.success("Match fees deducted");
      });
  }

  submit() {
    let allow_bet = false;
    if (this.data.m_type == "session") {
      if (this.count >= this.data.min && this.count <= this.data.max) {
        allow_bet = true;
      }
    }
    if (this.data.m_type == "bookmaker") {
      if (this.count >= this.data.min && this.count <= this.data.max) {
        allow_bet = true;
      }
    }
    if (this.data.m_type == "fancy") {
      //console.log("in allow fancy")
      if (this.count >= this.data.min && this.count <= this.data.max) {
        allow_bet = true;
      }
    }
    if (this.data.m_type == "match_odd") {
      if (this.count >= 100) {
        allow_bet = true;
      }
    }
    if (this.data.m_type != "match_odd" && this.data.g_type == "soccer") {
      if (this.count >= 100) {
        allow_bet = true;
      }
    }
    if (this.data.m_type != "match_odd" && this.data.g_type == "tennis") {
      if (this.count >= 100) {
        allow_bet = true;
      }
    }

    // this.dialogRef.close();
    this.submitted_disabled = true;
    if (allow_bet) {
      //console.log(" allowed fancy")
      this.userService
        .getUserBalance(this.data.user_id)
        .subscribe((data: any) => {
          this.userBalance = Number(data.balance);
          this.exposureService.getExposure().subscribe(
            (data: any) => {
              this.m_exp = data;
              let exp = Number(this.m_exp[0].exp_amount);
              //console.log('exp->', exp);
              // if ((this.userBalance) >= Math.abs(this.finalLoss) && (this.userBalance + exp) > 0) {
              this.submitted_disabled = true;
              if (this.data.m_type == "session") {
                let session_bet: any = {
                  user_id: this.data.user_id,
                  event_id: this.data.event_id,
                  market_name: this.data.market_name,
                  runner_name: this.data.runner_name.trim(),
                  main_type: "session",
                  type: this.data.type,
                  price: this.data.value.price,
                  size: this.data.value.size,
                  bet_amount: this.count,
                  loss_amount: this.finalLoss,
                  win_amount: this.finalProfit,
                  exp_amount1: this.exp_amount1,
                  exp_amount2: this.exp_amount2,
                };
                let latest_min_exp = Math.min(
                  this.exp_amount1,
                  this.exp_amount2,
                );
                //console.log('e1,e2', this.exp_amount1, this.exp_amount2);
                //console.log('last ', this.last_min_exp);
                let final_bal =
                  this.userBalance + exp - this.last_min_exp + latest_min_exp;
                //console.log('new ', latest_min_exp);
                //console.log('final bal ', final_bal);
                // if (final_bal >= 0) {
                let data = {
                  event_id: session_bet.event_id,
                  runner_name: session_bet.runner_name,
                  type: session_bet.type,
                  price: session_bet.size,
                };
                this.matchService
                  .CheckSessionPriceChange(data)
                  .subscribe((res: any) => {
                    if (res.change) {
                      this.toastr.error("Session odds changed..!!");
                      // this.dialogRef.close();
                    } else {
                      //console.log('sb-->',session_bet);
                      this.sessionBetsService
                        .addSessionBet(session_bet)
                        .subscribe((res: any) => {
                          if (res.hasOwnProperty("error")) {
                            this.toastr.error(res.error);
                            // this.dialogRef.close();
                          } else if (res.hasOwnProperty("message")) {
                            this.toastr.success(res.message);
                            // this.dialogRef.close();
                          }
                        });
                    }
                  });

                // } else {
                //     this.toastr.error("Insufficient Balance, you cannot place bet.!");
                //     // this.dialogRef.close();
                // }
              } else if (this.data.m_type == "match_odd") {
                this.submitted_disabled = true;
                let match_bet: any = {
                  user_id: this.data.user_id,
                  event_id: this.data.event_id,
                  market_id: this.data.market_id,
                  runner_name: this.data.runner_name.trim(),
                  main_type: "match_odd",
                  type: this.data.type,
                  price: this.price ?? this.data.value.price,
                  size: this.data.value.size,
                  bet_amount: this.count,
                  loss_amount: this.finalLoss.toFixed(2),
                  win_amount: this.finalProfit.toFixed(2),
                  exp_amount1: this.exp_amount1.toFixed(2),
                  exp_amount2: this.exp_amount2.toFixed(2),
                  exp_amount3: this.exp_amount3.toFixed(2),
                  index: this.data.index,
                  market_name: this.data.market_name,
                  g_type: this.data.g_type,
                  enable_draw: this.data.enable_draw,
                  is_manual_price: this.is_manual_price
                };

                //console.log(this.exp_amount1, this.exp_amount2, this.exp_amount3);
                //console.log('wa', this.finalProfit);
                //console.log('la', this.finalLoss);
                let latest_min_exp = 0;
                if (this.data.enable_draw) {
                  latest_min_exp = Math.min(
                    this.exp_amount1,
                    this.exp_amount2,
                    this.exp_amount3,
                  );
                } else if (this.data.enable_draw == false) {
                  latest_min_exp = Math.min(this.exp_amount1, this.exp_amount2);
                }
                //console.log('last', this.last_min_exp);
                let final_bal =
                  this.userBalance + exp - this.last_min_exp + latest_min_exp;
                //console.log('new', latest_min_exp);
                //console.log('final bal ', final_bal);
                if (final_bal >= 0) {
                  switch (this.data.g_type) {
                    case "cricket":
                      let data = {
                        market_id: match_bet.market_id,
                        runner_name: match_bet.runner_name,
                        type: match_bet.type,
                        price: match_bet.price,
                      };
                      // this.matchService.CheckMatchOddChange(data).subscribe((res: any) => {
                      //     if (res.change) {
                      //         this.toastr.error('Odds Changed..!!');
                      //         // this.dialogRef.close();
                      //     } else {
                      this.matchBetService
                        .addMatchBet(match_bet)
                        .subscribe((res: any) => {
                          if (res.hasOwnProperty("error")) {
                            this.toastr.error(res.error);
                            // this.dialogRef.close();
                          } else if (res.hasOwnProperty("message")) {
                            this.toastr.success("Cricket " + res.message);
                            // this.dialogRef.close();
                          }
                        });
                      //     }
                      // });
                      break;
                    case "tennis":
                      let tennis_data = {
                        market_id: match_bet.market_id,
                        runner_name: match_bet.runner_name,
                        type: match_bet.type,
                        price: match_bet.price,
                      };
                      // this.tennisOddService.CheckTennisOddChange(tennis_data).subscribe((res: any) => {
                      //     {
                      //         if (res.change) {
                      //             this.toastr.error('Odds Changed..!!');
                      //             // this.dialogRef.close();
                      //         } else {
                      this.tennisBetService
                        .addTennisBet(match_bet)
                        .subscribe((res: any) => {
                          if (res.hasOwnProperty("error")) {
                            this.toastr.error(res.error);
                            // this.dialogRef.close();
                          } else if (res.hasOwnProperty("message")) {
                            this.toastr.success("Tennis " + res.message);
                            // this.dialogRef.close();
                          }
                        });
                      //         }
                      //     }
                      // });

                      break;
                    case "soccer":
                      let soccer_data = {
                        market_id: match_bet.market_id,
                        runner_name: match_bet.runner_name,
                        type: match_bet.type,
                        price: match_bet.price,
                      };
                      // this.soccerOddService.CheckSoccerOddChange(soccer_data).subscribe((res: any) => {
                      //     {
                      //         if (res.change) {
                      //             this.toastr.error('Odds Changed..!!');
                      //             // this.dialogRef.close();
                      //         } else {
                      this.soccerBetService
                        .addSoccerBet(match_bet)
                        .subscribe((res: any) => {
                          if (res.hasOwnProperty("error")) {
                            this.toastr.error(res.error);
                            // this.dialogRef.close();
                          } else if (res.hasOwnProperty("message")) {
                            this.toastr.success("Soccer " + res.message);
                            // this.dialogRef.close();
                          }
                        });
                      //         }
                      //     }
                      // });

                      break;
                    default:
                      break;
                  }
                } else {
                  this.toastr.error(
                    "Insufficient Balance, you cannot place betkk.!",
                  );
                  // this.dialogRef.close();
                }
              } else if (this.data.m_type == "bookmaker") {
                this.submitted_disabled = true;
                let match_bet: any = {
                  user_id: this.data.user_id,
                  event_id: this.data.event_id,
                  market_id: this.data.market_id,
                  runner_name: this.data.runner_name.trim(),
                  main_type: "bookmaker",
                  type: this.data.type,
                  price: this.data.value.price,
                  size: this.data.value.size,
                  bet_amount: this.count,
                  loss_amount: this.finalLoss.toFixed(2),
                  win_amount: this.finalProfit.toFixed(2),
                  exp_amount1: this.exp_amount1.toFixed(2),
                  exp_amount2: this.exp_amount2.toFixed(2),
                  exp_amount3: this.exp_amount3.toFixed(2),
                  index: this.data.index,
                  market_name: this.data.market_name,
                  g_type: this.data.g_type,
                  enable_draw: this.data.enable_draw,
                };
                // console.log('bm-->',match_bet);
                // console.log(this.exp_amount1, this.exp_amount2, this.exp_amount3);
                // console.log('wa', this.finalProfit);
                // console.log('la', this.finalLoss);
                let latest_min_exp = 0;
                if (this.data.enable_draw) {
                  latest_min_exp = Math.min(
                    this.exp_amount1,
                    this.exp_amount2,
                    this.exp_amount3,
                  );
                } else if (this.data.enable_draw == false) {
                  latest_min_exp = Math.min(this.exp_amount1, this.exp_amount2);
                }
                //console.log('last', this.last_min_exp);
                let final_bal =
                  this.userBalance + exp - this.last_min_exp + latest_min_exp;
                //console.log('new', latest_min_exp);
                //console.log('final bal ', final_bal);
                if (final_bal >= 0) {
                  let data = {
                    market_id: match_bet.market_id,
                    runner_name: match_bet.runner_name,
                    type: match_bet.type,
                    price: match_bet.price,
                  };
                  this.bookMakerBetService
                    .addBookmakerBet(match_bet)
                    .subscribe((res: any) => {
                      if (res.hasOwnProperty("error")) {
                        this.toastr.error(res.error);
                        // this.dialogRef.close();
                      } else if (res.hasOwnProperty("message")) {
                        this.toastr.success(res.message);
                        // this.dialogRef.close();
                      }
                    });
                } else {
                  this.toastr.error(
                    "Insufficient Balance, you cannot place bet.!",
                  );
                  // this.dialogRef.close();
                }
              } else if (this.data.m_type == "fancy") {
                this.submitted_disabled = true;
                let match_bet: any = {
                  user_id: this.data.user_id,
                  event_id: this.data.event_id,
                  market_id: this.data.market_id,
                  runner_name: this.data.runner_name.trim(),
                  main_type: "fancy",
                  type: this.data.type,
                  price: this.data.value.price,
                  size: this.data.value.size,
                  bet_amount: this.count,
                  loss_amount: this.finalLoss.toFixed(2),
                  win_amount: this.finalProfit.toFixed(2),
                  exp_amount1: this.exp_amount1.toFixed(2),
                  exp_amount2: this.exp_amount2.toFixed(2),
                  index: this.data.index,
                  market_name: this.data.market_name,
                  g_type: this.data.g_type,
                  enable_draw: this.data.enable_draw,
                };

                // console.log(this.exp_amount1, this.exp_amount2, this.exp_amount3);
                // console.log('wa', this.finalProfit);
                // console.log('la', this.finalLoss);
                let latest_min_exp = 0;
                if (this.data.enable_draw) {
                  latest_min_exp = Math.min(
                    this.exp_amount1,
                    this.exp_amount2,
                    this.exp_amount3,
                  );
                } else if (this.data.enable_draw == false) {
                  latest_min_exp = Math.min(this.exp_amount1, this.exp_amount2);
                }
                //console.log('last', this.last_min_exp);
                let final_bal =
                  this.userBalance + exp - this.last_min_exp + latest_min_exp;
                //console.log('new', latest_min_exp);
                //console.log('final bal ', final_bal);
                if (final_bal >= 0) {
                  let data = {
                    market_id: match_bet.market_id,
                    runner_name: match_bet.runner_name,
                    type: match_bet.type,
                    price: match_bet.price,
                  };
                  this.FancyBetService.addFancyBet(match_bet).subscribe(
                    (res: any) => {
                      if (res.hasOwnProperty("error")) {
                        this.toastr.error(res.error);
                        // this.dialogRef.close();
                      } else if (res.hasOwnProperty("message")) {
                        this.toastr.success(res.message);
                        // this.dialogRef.close();
                      }
                    },
                  );
                } else {
                  this.toastr.error(
                    "Insufficient Balance, you cannot place bet.!",
                  );
                  // this.dialogRef.close();
                }
              } else if (
                this.data.m_type != "match_odd" &&
                this.data.g_type == "soccer"
              ) {
                this.submitted_disabled = true;
                let match_bet: any = {
                  user_id: this.data.user_id,
                  event_id: this.data.event_id,
                  market_id: this.data.market_id,
                  runner_name: this.data.runner_name.trim(),
                  main_type: this.data.m_type,
                  type: this.data.type,
                  price: this.data.value.price,
                  size: this.data.value.size,
                  bet_amount: this.count,
                  loss_amount: this.finalLoss.toFixed(2),
                  win_amount: this.finalProfit.toFixed(2),
                  exp_amount1: this.exp_amount1.toFixed(2),
                  exp_amount2: this.exp_amount2.toFixed(2),
                  exp_amount3: this.exp_amount3.toFixed(2),
                  index: this.data.index,
                  market_name: this.data.market_name,
                  g_type: this.data.g_type,
                  enable_draw: this.data.enable_draw,
                };

                //console.log(this.exp_amount1, this.exp_amount2, this.exp_amount3);
                //console.log('wa', this.finalProfit);
                //console.log('la', this.finalLoss);
                let latest_min_exp = 0;
                if (this.data.enable_draw) {
                  latest_min_exp = Math.min(
                    this.exp_amount1,
                    this.exp_amount2,
                    this.exp_amount3,
                  );
                } else if (this.data.enable_draw == false) {
                  latest_min_exp = Math.min(this.exp_amount1, this.exp_amount2);
                }
                //console.log('last', this.last_min_exp);
                let final_bal =
                  this.userBalance + exp - this.last_min_exp + latest_min_exp;
                //console.log('new', latest_min_exp);
                //console.log('final bal ', final_bal);
                if (final_bal >= 0) {
                  let soccer_data = {
                    market_id: match_bet.market_id,
                    runner_name: match_bet.runner_name,
                    type: match_bet.type,
                    price: match_bet.price,
                  };
                  this.soccerSessionService
                    .CheckSoccerSessionChange(soccer_data)
                    .subscribe((res: any) => {
                      {
                        if (res.change) {
                          this.toastr.error("Odds Changed..!!");
                          // this.dialogRef.close();
                        } else {
                          this.soccerSessionBetService
                            .addSoccerSessionBet(match_bet)
                            .subscribe((res: any) => {
                              if (res.hasOwnProperty("error")) {
                                this.toastr.error(res.error);
                                // this.dialogRef.close();
                              } else if (res.hasOwnProperty("message")) {
                                this.toastr.success("Soccer " + res.message);
                                // this.dialogRef.close();
                              }
                            });
                        }
                      }
                    });
                } else {
                  this.toastr.error(
                    "Insufficient Balance, you cannot place bet.!",
                  );
                  // this.dialogRef.close();
                }
              } else if (
                this.data.m_type != "match_odd" &&
                this.data.g_type == "tennis"
              ) {
                this.submitted_disabled = true;
                let match_bet: any = {
                  user_id: this.data.user_id,
                  event_id: this.data.event_id,
                  market_id: this.data.market_id,
                  runner_name: this.data.runner_name.trim(),
                  main_type: this.data.m_type,
                  type: this.data.type,
                  price: this.data.value.price,
                  size: this.data.value.size,
                  bet_amount: this.count,
                  loss_amount: this.finalLoss.toFixed(2),
                  win_amount: this.finalProfit.toFixed(2),
                  exp_amount1: this.exp_amount1.toFixed(2),
                  exp_amount2: this.exp_amount2.toFixed(2),
                  exp_amount3: this.exp_amount3.toFixed(2),
                  index: this.data.index,
                  market_name: this.data.market_name,
                  g_type: this.data.g_type,
                  enable_draw: this.data.enable_draw,
                };

                //console.log(this.exp_amount1, this.exp_amount2, this.exp_amount3);
                //console.log('wa', this.finalProfit);
                //console.log('la', this.finalLoss);
                let latest_min_exp = 0;
                if (this.data.enable_draw) {
                  latest_min_exp = Math.min(
                    this.exp_amount1,
                    this.exp_amount2,
                    this.exp_amount3,
                  );
                } else if (this.data.enable_draw == false) {
                  latest_min_exp = Math.min(this.exp_amount1, this.exp_amount2);
                }
                //console.log('last', this.last_min_exp);
                let final_bal =
                  this.userBalance + exp - this.last_min_exp + latest_min_exp;
                //console.log('new', latest_min_exp);
                //console.log('final bal ', final_bal);
                if (final_bal >= 0) {
                  let tennis_data = {
                    market_id: match_bet.market_id,
                    runner_name: match_bet.runner_name,
                    type: match_bet.type,
                    price: match_bet.price,
                  };
                  this.tennisSessionService
                    .CheckTennisSessionChange(tennis_data)
                    .subscribe((res: any) => {
                      {
                        if (res.change) {
                          this.toastr.error("Odds Changed..!!");
                          // this.dialogRef.close();
                        } else {
                          this.tennisSessionBetService
                            .addTennisSessionBet(match_bet)
                            .subscribe((res: any) => {
                              if (res.hasOwnProperty("error")) {
                                this.toastr.error(res.error);
                                // this.dialogRef.close();
                              } else if (res.hasOwnProperty("message")) {
                                this.toastr.success("Tennis " + res.message);
                                // this.dialogRef.close();
                              }
                            });
                        }
                      }
                    });
                } else {
                  this.toastr.error(
                    "Insufficient Balance, you cannot place bet.!",
                  );
                  // this.dialogRef.close();
                  this.closebetslipcomponent();
                }
              }
              // console.log('close');

              this.closebetslipcomponent();

              // } else {
              //   this.toastr.error("Insufficient Balance, you cannot place bet.!");
              //   // this.dialogRef.close();
              // }
            },
            (error) => {
              this.m_exp = [];
              this.closebetslipcomponent();
              return 0;
            },
          );
        });
    } else {
      if (this.data.m_type == "match_odd") {
        this.toastr.error("Min bet must be 100");
        // this.dialogRef.close();
      } else if (this.data.m_type == "session") {
        this.toastr.error(
          "Min bet amount must be: " +
            this.data.min +
            " and Max bet amount must be: " +
            this.data.max,
        );
        // this.dialogRef.close();
      } else if (this.data.m_type == "fancy") {
        this.toastr.error(
          "Min bet amount must be: " +
            this.data.min +
            " and Max bet amount must be: " +
            this.data.max,
        );
        // this.dialogRef.close();
      } else {
        this.toastr.error("Min bet must be 100");
        // this.dialogRef.close();
      }
      this.closebetslipcomponent();
    }
  }

  openTimerOverlay() {
    if (this.submitted_disabled) return; // prevent double click

    this.submitted_disabled = true;
    this.isLoading = true; // 🔄 SHOW LOADER

    this.submit(); // 🚀 call API
  }

  // openTimerOverlay() {
  //     this.showTimerOverlay = true;
  //     this.timerActive = true;

  //     setTimeout(() => {
  //         // Code to execute when the timer completes
  //         //console.log('Submit data...');
  //         this.timerActive = false;
  //         this.showTimerOverlay = false;
  //         this.submit();
  //     }, 3000);
  // }

  dismiss() {
    // this.dialogRef.close();
  }

  clear() {
    this.count = 0;
    this.calculate();
  }

  increasePrice() {
    this.price = Number((this.price + 0.01).toFixed(2));
    this.is_manual_price = 1;
  }

  decreasePrice() {
    if (this.price > 0.01) {
      this.price = Number((this.price - 0.01).toFixed(2));
      this.is_manual_price = 1;
    }
  }

  onPriceChange() {
  if (this.data.m_type === 'match_odd'&& this.data.g_type == "cricket") {
    this.is_manual_price = 1;
  }
}
}
