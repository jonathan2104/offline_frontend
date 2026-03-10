import {Component, OnInit, ViewChild, ElementRef, Renderer2, OnDestroy} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {BetslipComponent} from '../betslip/betslip.component';
import {ActivatedRoute} from "@angular/router";
import {MatchService} from "../services/match.service";
import {Subscription, min, switchMap} from "rxjs";
import {SessionBetsService} from "../services/session-bets.service";
import {BookmakerService} from "../services/bookmaker.service";
import {BookmakerBetsService} from "../services/bookmaker-bets.service";
import {ExposureService} from "../services/exposure.service";
import {ToastrService} from "ngx-toastr";
import {MarketBetsService} from "../services/market-bets.service";
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {FancyBetsService} from "../services/fancy-bets.service";
import {HttpClient} from '@angular/common/http';
import {SafeHtml} from '@angular/platform-browser';
import {SessionLadder} from '../modals/session-ladder/session-ladder.component';
import {NewRulesModelComponent} from '../modals/new-rule-book/book.component';
import {BetSlipService} from '../services/betslip.service';
import {CashoutService} from '../services/cashout.services';
import {cashoutComponent} from '../cashout/cashout.component';
import {UserService} from "../services/user.service";
import {CurrentBetService} from '../services/currentbets.service';

@Component({
  selector: 'app-matchdetail',
  templateUrl: './matchdetail.component.html',
  styleUrls: ['./matchdetail.component.css'],
  // encapsulation: ViewEncapsulation.None

})
export class MatchdetailComponent implements OnInit, OnDestroy {
    // @ViewChild(cashoutComponent) cashout!: cashoutComponent;
  htmlContent: SafeHtml;
  @ViewChild('btn') btn: ElementRef;
  data: any = {
    type: "back",
    value: 12
  };

  videourl: any = "";
  scoreurl: any = "";

  event: any = [];
  event_id: any;
  market: any = [];
  markets: any = [];
  book_maker_odd: any = [];
  book_maker_odds: any = [];

  sessions: any = [];
  fancies:any=[];
  session_bets: any[] = [];
  fancy_bets: any[] = [];
  match_bets: any[] = [];
  bookmaker_bets: any[] = [];
  score: any = {};
  scoreLength = 0;
  myInterval: any
  exposuresPerRunner: any = [];
  fancyExposuresPerRunner: any = [];
  is_score: boolean = false;
  market_name: any;
  marketStartTime: any;
  math = Math
  last24ballsNew: any = [];

  cashout_submited: boolean = false;
  cashout_price: any;
  show_cashout_confirm: boolean = false;
  show_new_cashout_confirm: boolean = false;
  cashout_errmsg = "";

  selectedTabIndex = 0;
  enable_draw: boolean = false;
  private sessionSubscription: Subscription;
  private fancySubscription: Subscription;
  private scoreSubscription: Subscription;
  private marketSubscription: Subscription;
  private bookmakerSubscription: Subscription;

  cash_out_profit = 0;
  total_profit_loss = 0;
  status = '';
  previousPricesOdds: any = {};
  previousPricesBookmaker: any = {};
  competition_name: any;
  inplay: any = false;
  showVideo: boolean = false;
  showScorecard: boolean = true;
  activeTab: string = 'All';
  selectedToogleTab: string = 'score';
  isTvActive: boolean = false;
  betslip_visible = false;
  betdata: any = {};
  betKey = 0;

  betslip_odd_type: any ='';
  betslip_odd_runner: any = '';
  countdown: string = '';
  timer: any;
  tossVisible:boolean =true;
  cashout_stake :any = 0;
  cashout_final_profit :any = 0;

  exp_amount: number;
  exp_amount1: number;
  exp_amount2: number;
  exp_amount3: number;
  existing_matchBet: any = [];
  last_min_exp: any = 0;
  price: number;
  size: any;
  count: number = 0;
  static profit: any;
  static loss: any;

  finalLoss: number;
  finalProfit: number;
  userBalance: number = 0;
  m_exp: any;
  bet_data: any;
  constructor(private http: HttpClient, public sanitizer: DomSanitizer, public dialog: MatDialog, private toastr: ToastrService, private bookMakerService: BookmakerService,private BookmakerBetService: BookmakerBetsService, private renderer: Renderer2, private activatedRoute: ActivatedRoute, private matchService: MatchService, private sessionBetsService: SessionBetsService, private matchBetsService: MarketBetsService, private exposureService: ExposureService, private fancyBetService:FancyBetsService,public betSlipService : BetSlipService, public cashoutService: CashoutService, private userService: UserService, private currentBetService: CurrentBetService) {
  }


  ngOnInit(): void {
    this.betSlipService.setParentFunction(async () => {
      // Example: API call to get latest bet data
      await this.fetchBetDataFromAPI();
    });
     this.openDialog('type', 'data',0,0,'test',0, 100,100000)
        //     this.betSlipService.setParentFunction(() => {
        //     this.betdata = this.betSlipService.getSharedData();
        //     this.betslip_visible = true;
        // });
        // this.betSlipService.setClearBetFunction(() => {
        //     this.closeBet();
        // });

    // this.fetchHTMLPage();
    this.activatedRoute.params.subscribe((param: any) => {
      this.event_id = param['event_id'];
      this.videourl = this.sanitizer.bypassSecurityTrustResourceUrl("https://e765432.diamondcricketid.com/dtv.php?id=" + this.event_id);
      this.scoreurl = this.sanitizer.bypassSecurityTrustResourceUrl("https://e765432.diamondcricketid.com/sr.php?eventid=" + this.event_id + "&sportid=4");
    })
    this.getMarket();
    this.getBookMakerOdds();
    this.getSession();
    this.getFancy();
    // this.getLiveScore();
    // this.matchService.getEvent(this.event_id).subscribe((res: any) => {
    //   this.event = res;
    //   if (this.event.length > 0) {
    //     this.market_name = this.event[0].runners[0].runnerName + " v " + this.event[0].runners[1].runnerName;
    //   }
    //
    //   // this.getMarket();
    //   // this.getSession();
    //   // this.getLiveScore();
    //   // this.getVideoLink();
    // })

    this.myInterval = setInterval(() => {
      if (this.market.length > 0) {
        this.getMarket();
      }

      this.getSession();
      this.getBookMakerOdds();
      this.getFancy();
      if (this.bookmaker_bets.length > 0) {
        this.getBookmakerBets();
      }
      // if (this.scoreLength > 0) {
      //   this.getLiveScore();
      // }
      if (this.match_bets.length > 0) {
        this.getMatchBets();
      }
      if (this.session_bets.length > 0) {
        this.getSessionBets();
      }
      if (this.fancy_bets.length > 0) {
        this.getFancyBets();
      }
      // this.getLiveScore();
      // this.calculateCashOut();
      //this.calculate_new_cashout();

      // this.exposureService.getSimmpleScore(this.event_id).subscribe((res)=>{
      //   console.log('simple score',res);
      // });
      // this.exposureService.getAdvanceScore(this.event_id).subscribe((res)=>{
      //   console.log('advance score',res);
      // });
    }, 5000);

    this.matchBetsService.refreshMatchBets.subscribe(() => {
      this.getMatchBets();
    })
    this.getMatchBets();
    this.BookmakerBetService.refreshBookmakerBets.subscribe(() => {
      this.getBookmakerBets();
    })
    this.getBookmakerBets();

    this.fancyBetService.refreshFancyBets.subscribe(()=>{
      this.getFancyBets();
    });
    this.getFancyBets();

    this.sessionBetsService.refresh.subscribe(() => {
      this.getSessionBets();
    })
    this.getSessionBets();

    this.exposureService.refreshExposureAmtByRunner.subscribe(() => {
      this.getExposureByRunnerName();
    });
    this.getExposureByRunnerName();

    this.exposureService.refreshFancyExposureAmtByRunner.subscribe(()=>{
      this.getFancyExposureByRunnerName();
    })
    this.getFancyExposureByRunnerName();

    this.startCountdown()
    this.betSlipService.betPlaced$.subscribe(() => {
      this.betslip_visible = false;
    });
  }

  getInterestingReverseLoop(data: any[], overNumber: any) {
    const stringWithoutParentheses = overNumber.replace(/[()]/g, '');
    const numberValue = parseFloat(stringWithoutParentheses);
    const startIndex = Math.floor(numberValue * 10) % 10;
    // console.log('index', Number(numberValue));
    const interestingLoopData = [];

    // Fill the array with zero values
    for (let i = 0; i < 6; i++) {
      interestingLoopData.push({
        score_card: "-",
        out_text: "0",
        comment: ""
      });
    }
    if (data.length > 0) {
      if (startIndex > 0) {
        const relevantData = data.slice(-startIndex);
        // console.log('RD-->', relevantData);


        for (let i = 0; i < relevantData.length && i < 6; i++) {
          interestingLoopData[i].score_card = relevantData[i].score_card;
        }
        // console.log('na-->', interestingLoopData);
      } else {
        for (let i = 0; i < 6; i++) {
          interestingLoopData[i].score_card = data[i].score_card
        }
      }
    }
    return interestingLoopData;
  }

  getMarket() {
    this.marketSubscription = this.matchService
      .getMarketOdd(this.event_id)
      .subscribe((res: any) => {
        this.markets = res;
        // console.log(this.markets.length);
        
        if (this.markets.length > 0) {
          this.market_name = this.markets[0].event_name;
          this.competition_name = this.markets[0].competition_name;
          this.marketStartTime = this.markets[0].start_time;
          this.inplay = this.markets[0].inplay == 1 ? true : false;

          // send data for current bets
          this.currentBetService.setBetData({
            event_id: this.event_id,
            game_type: 'cricket',
            market_id: this.markets[0].market_id
          });

          const keys = Object.keys(this.markets[0]).filter(
            key => key.endsWith('_price') || key.endsWith('_size')
          );
          
          keys.forEach(key => {
            if (this.previousPricesOdds[key] !== this.markets[0][key]) {
              this.previousPricesOdds[key] = this.markets[0][key];
          
              // Decide className to find correct td
              const tdElement = document.querySelector(`.match-odd .${key}`);
          
              if (tdElement) {
                if (key.startsWith('back')) {
                  tdElement.classList.add('price-change-back'); // Green flash
                } else if (key.startsWith('lay')) {
                  tdElement.classList.add('price-change-lay');  // Red flash
                }
          
                setTimeout(() => {
                  tdElement.classList.remove('price-change-back', 'price-change-lay');
                }, 300);
              }
            }
          });

          if (this.match_bets.length != 0) {
            if (this.match_bets[0].length != 0) {
              this.market = this.markets.map((obj1: any) => {
                let match_bet = [];
                match_bet.push(this.match_bets[0]);
                const obj2 = match_bet.find(
                  (obj2: any) =>
                    obj2.event_id == obj1.event_id && obj2.status == 1
                );
                if (obj2) {
                  return {
                    ...obj1,
                    exp_amount1: obj2.exp_amount1,
                    exp_amount2: obj2.exp_amount2,
                    exp_amount3: obj2.exp_amount3,
                  };
                } else {
                  return {
                    ...obj1,
                    exp_amount1: 0,
                    exp_amount2: 0,
                    exp_amount3: 0,
                  };
                }
              });
            }
          } else {
            this.market = this.markets.map((obj: any) => ({
              ...obj,
              exp_amount1: 0,
              exp_amount2: 0,
              exp_amount3: 0,
            }));
          }
          if (this.market[0].hasOwnProperty("back2_price")) {
            if (this.market[0].back2_price != null) {
              this.enable_draw = true;
            } else if (this.market[0].back2_price == null) {
              this.enable_draw = false;
            }
          }
        }
      });
    // console.log('this amrket', this.market);
    // console.log('this amrket', this.market[0]);
  }

  getBookMakerOdds() {
    this.bookmakerSubscription = this.bookMakerService.getBookmakerOdd(this.event_id).subscribe((res: any) => {
      this.book_maker_odds = res;

      // Highlight price change start
      const priceKeys = Object.keys(res[0]).filter(key => key.endsWith('_price'));
      priceKeys.forEach(key => {
          if (this.previousPricesBookmaker[key] !== res[0][key]) {
              this.previousPricesBookmaker[key] = res[0][key];
              const tdElement = document.querySelector(`.bookmaker .${key}`);
              if (tdElement) {
                  tdElement.classList.add('price-change');
                  setTimeout(() => {
                      tdElement.classList.remove('price-change');
                  }, 1000);
              }
          }
      });
      // Highlight price change end
      if (this.book_maker_odds.length > 0) {
        this.market_name = this.book_maker_odds[0].event_name;
        // console.log('bookmaker length', this.bookmaker_bets.length);
        if (this.bookmaker_bets.length != 0) {
          if (this.bookmaker_bets[0].length != 0) {
            // console.log('in book');
            this.book_maker_odd = this.book_maker_odds.map((obj1: any) => {
              let bookmaker_bet = []
              bookmaker_bet.push(this.bookmaker_bets[0]);
              // console.log('bookmaker bet-->',bookmaker_bet);
              const obj2 = bookmaker_bet.find((obj2: any) => (obj2.event_id == obj1.event_id && obj2.status == 1));
              // console.log('obj2-->',obj2);
              if (obj2) {
                return {
                  ...obj1,
                  exp_amount1: obj2.exp_amount1,
                  exp_amount2: obj2.exp_amount2,
                  exp_amount3: obj2.exp_amount3,
                  //status:obj2.status
                };
              } else {
                return {...obj1, exp_amount1: 0, exp_amount2: 0, exp_amount3: 0};
              }
            });
          }
        } else {
          this.book_maker_odd = this.book_maker_odds.map((obj: any) => ({
            ...obj,
            exp_amount1: 0,
            exp_amount2: 0,
            exp_amount3: 0
          }));
        }
        if (this.book_maker_odd[0].hasOwnProperty('back2_price')) {
          if (this.book_maker_odd[0].back2_price != null) {
            this.enable_draw = true;
          } else if (this.book_maker_odd[0].back2_price == null) {
            this.enable_draw = false;
          }
        }
      }
    })
    ///console.log('book,=', this.book_maker_odd);

  }

  getBookmakerBets() {
    this.BookmakerBetService.getBookmakerBets(this.event_id).subscribe((data: any) => {
      this.bookmaker_bets = data;
    });
  }

  getSession() {
    this.sessionSubscription = this.matchService.getSession(this.event_id).subscribe((res: any) => {
      if (res != null) {
        this.sessions = res;
        this.sessions = this.sessions.sort((a:any, b:any) => a.sr_no - b.sr_no);
        if (this.exposuresPerRunner.length != 0) {
          this.sessions = this.sessions.map((obj1: any) => {
            const obj2 = this.exposuresPerRunner.find((obj2: any) => (obj2.runner_name == obj1.runner_name && obj2.status == 1));
            // console.log(obj2);
            return obj2 ? {...obj1, ...obj2} : {...obj1, exp_amount: 0};
          });

        } else {
          this.sessions = this.sessions.map((obj: any) => ({...obj, exp_amount: 0}));
          // this.sessions = this.sessions.sort((a:any, b:any) => a.sr_no - b.sr_no);
        }
      } else {
        this.sessions = [];
      }
    });

    // console.log('session-->', this.sessions);
  }

  getFancy() {
    this.fancySubscription = this.matchService.getFancy(this.event_id).subscribe((res: any) => {
      if (res != null) {
        // res.sort((a:any, b:any) => a.srno.localeCompare(b.srno));
        this.fancies = res;
        const defaultExpAmount = this.fancyExposuresPerRunner.length != 0 ? this.fancyExposuresPerRunner[0].exp_amount1 || 0 : 0;
        this.fancies = this.fancies.map((obj1: any) => {
          const obj2 = this.fancyExposuresPerRunner.find((obj2: any) => (obj2.runner_name != obj1.runner_name && obj2.status == 1));
          return obj2 ? {...obj1, ...obj2} : {...obj1, exp_amount: defaultExpAmount};
        });
      } else {
        this.fancies = [];
      }
    });
  
    // console.log('fancy-->', this.fancies);
  }


  // getLiveScore() {
  //   this.scoreSubscription = this.matchService.getScore(this.event_id).subscribe((res: any) => {
  //     if (res != null) {
  //       this.score = res;
  //       this.scoreLength = this.score.length
  //       if ("teams" in this.score) {
  //         this.is_score = true;
  //         this.last24ballsNew = this.score.last24ballsNew;
  //       } else {
  //         this.is_score = false;
  //       }
  //       console.log('this is score-->', this.is_score);
  //     }
  //   }, (error: any) => {
  //     this.scoreLength = 0;
  //   })
  // }


  getSessionBets() {
    this.sessionBetsService.getSessionBet(this.event_id).subscribe((data: any) => {
      this.session_bets = data;
      // console.log(this.session_bets);

    })
  }

  getMatchBets() {
    this.matchBetsService.getMatchBets(this.event_id).subscribe((data: any) => {
      this.match_bets = data;

      this.calculate_new_cashout2();
    });
  }
  getFancyBets() {
    this.fancyBetService.getFancyBets(this.event_id).subscribe((data: any) => {
      this.fancy_bets = data;
    });
  }

  getExposureByRunnerName() {
    this.exposureService.getExposureAmtByRunner(this.event_id).subscribe((data: any) => {
      if (data.length != 0) {
        this.exposuresPerRunner = data;
      } else {
        this.exposuresPerRunner = [];
      }
    })
  }

  getFancyExposureByRunnerName() {
    this.exposureService.getFancyExposureAmtByRunner(this.event_id).subscribe((data: any) => {
      if (data.length != 0) {
        this.fancyExposuresPerRunner = data;
      } else {
        this.fancyExposuresPerRunner = [];
      }
    })
  }

  calculateCashOut() {
    if (this.match_bets.length != 0) {

      this.cashout_submited = !this.match_bets[0].is_switched;
      let last_bet = this.match_bets[0]
      let current_market = this.market[0];
      //console.log(current_market);
      //console.log(last_bet.runner_name);

      this.total_profit_loss = Math.abs(last_bet.loss_amount);

      if (current_market.runner1 == last_bet.runner_name) {
        if (last_bet.type == 'Back') {
          this.cashout_price = current_market.back0_price
          if (this.cashout_price >= 1.03 && this.cashout_price <= 3.26) {
            if (last_bet.price < current_market.back0_price) {
              this.cash_out_profit = last_bet.exp_amount1 - ((Math.abs(last_bet.loss_amount) * current_market.back0_price) - Math.abs(last_bet.loss_amount));
              this.status = 'loss';
              this.total_profit_loss = Math.abs(last_bet.loss_amount) + this.cash_out_profit;
            } else if (last_bet.price > current_market.back0_price) {
              this.cash_out_profit = last_bet.exp_amount1 - ((Math.abs(last_bet.loss_amount) * current_market.back0_price) - Math.abs(last_bet.loss_amount));
              this.status = 'profit';
              this.total_profit_loss = Math.abs(last_bet.loss_amount) + this.cash_out_profit;
              this.cash_out_profit = (this.cash_out_profit * 75) / 100;
              this.total_profit_loss = (this.total_profit_loss * 75) / 100;
              // console.log('b-p/l',this.cash_out_profit);
              // console.log('b-tp/l',this.total_profit_loss);
            } else {
              this.cash_out_profit = 0;
              this.total_profit_loss = Math.abs(last_bet.loss_amount);
              this.status = 'profit';
            }
          }
        } else {
          this.cashout_price = current_market.lay0_price
          if (this.cashout_price >= 1.03 && this.cashout_price <= 3.26) {
            if (last_bet.price < current_market.lay0_price) {
              this.status = 'profit';
              this.cash_out_profit = last_bet.exp_amount1 + ((Math.abs(last_bet.win_amount) * current_market.lay0_price) - Math.abs(last_bet.win_amount));
              this.total_profit_loss = Math.abs(last_bet.loss_amount) + this.cash_out_profit;
              this.cash_out_profit = (this.cash_out_profit * 75) / 100;
              this.total_profit_loss = (this.total_profit_loss * 75) / 100;
            } else if (last_bet.price > current_market.lay0_price) {
              this.cash_out_profit = last_bet.exp_amount1 + ((Math.abs(last_bet.win_amount) * current_market.lay0_price) - Math.abs(last_bet.win_amount));
              this.status = 'loss';
              //console.log("l-p/l", this.cash_out_profit);
              //console.log("l-tp/l", this.cash_out_profit);
              this.total_profit_loss = Math.abs(last_bet.loss_amount) + this.cash_out_profit;
            } else {
              this.cash_out_profit = 0;
              this.total_profit_loss = Math.abs(last_bet.loss_amount);
              this.status = 'profit';
            }
          }
        }
      } else if (current_market.runner2 == last_bet.runner_name) {
        //console.log('inn2');
        if (last_bet.type == 'Back') {
          this.cashout_price = current_market.back1_price
          if (this.cashout_price >= 1.03 && this.cashout_price <= 3.26) {
            if (last_bet.price < current_market.back1_price) {
              this.cash_out_profit = last_bet.exp_amount2 - ((Math.abs(last_bet.loss_amount) * current_market.back1_price) - Math.abs(last_bet.loss_amount));
              this.status = 'loss';
              this.total_profit_loss = Math.abs(last_bet.loss_amount) + this.cash_out_profit;
            } else if (last_bet.price > current_market.back1_price) {
              this.cash_out_profit = last_bet.exp_amount2 - ((Math.abs(last_bet.loss_amount) * current_market.back1_price) - Math.abs(last_bet.loss_amount));
              this.status = 'profit';
              this.total_profit_loss = Math.abs(last_bet.loss_amount) + this.cash_out_profit;
              this.cash_out_profit = (this.cash_out_profit * 75) / 100;
              this.total_profit_loss = (this.total_profit_loss * 75) / 100;
              // console.log('b-p/l',this.cash_out_profit);
              // console.log('b-tp/l',this.total_profit_loss);
            } else {
              this.cash_out_profit = 0;
              this.total_profit_loss = Math.abs(last_bet.loss_amount);
              this.status = 'profit';

            }
          }
        } else {
          this.cashout_price = current_market.lay1_price
          if (this.cashout_price >= 1.03 && this.cashout_price <= 3.26) {
            if (last_bet.price < current_market.lay1_price) {
              this.status = 'profit';
              this.cash_out_profit = last_bet.exp_amount2 + ((Math.abs(last_bet.win_amount) * current_market.lay1_price) - Math.abs(last_bet.win_amount));
              this.total_profit_loss = Math.abs(last_bet.loss_amount) + this.cash_out_profit;
              this.cash_out_profit = (this.cash_out_profit * 75) / 100;
              this.total_profit_loss = (this.total_profit_loss * 75) / 100;
            } else if (last_bet.price > current_market.lay1_price) {
              this.cash_out_profit = last_bet.exp_amount2 + ((Math.abs(last_bet.win_amount) * current_market.lay1_price) - Math.abs(last_bet.win_amount));
              this.status = 'loss';
              //console.log("l-p/l", this.cash_out_profit);
              //console.log("l-tp/l", this.cash_out_profit);
              this.total_profit_loss = Math.abs(last_bet.loss_amount) + this.cash_out_profit;
            } else {
              this.cash_out_profit = 0;
              this.total_profit_loss = Math.abs(last_bet.loss_amount);
              this.status = 'profit';
            }
          }
        }
      } else if (last_bet.runner_name.trim() == 'Draw') {

        if (last_bet.type == 'Back') {
          this.cashout_price = current_market.back2_price;

          if (this.cashout_price >= 1.03 && this.cashout_price <= 3.26) {

            if (last_bet.price < current_market.back2_price) {
              this.cash_out_profit = last_bet.exp_amount3 - ((Math.abs(last_bet.loss_amount) * current_market.back2_price) - Math.abs(last_bet.loss_amount));
              this.status = 'loss';
              this.total_profit_loss = Math.abs(last_bet.loss_amount) + this.cash_out_profit;
            } else if (last_bet.price > current_market.back2_price) {
              this.cash_out_profit = last_bet.exp_amount3 - ((Math.abs(last_bet.loss_amount) * current_market.back2_price) - Math.abs(last_bet.loss_amount));
              this.status = 'profit';
              this.total_profit_loss = Math.abs(last_bet.loss_amount) + this.cash_out_profit;
              this.cash_out_profit = (this.cash_out_profit * 75) / 100;
              this.total_profit_loss = (this.total_profit_loss * 75) / 100;
              // console.log('b-p/l',this.cash_out_profit);
              // console.log('b-tp/l',this.total_profit_loss);
            } else {
              this.cash_out_profit = 0;
              this.total_profit_loss = Math.abs(last_bet.loss_amount);
              this.status = 'profit';
            }
          }
        } else {
          this.cashout_price = current_market.lay2_price;
          //console.log('cp--->', this.cashout_price);
          if (this.cashout_price >= 1.03 && this.cashout_price <= 3.26) {
            if (last_bet.price < current_market.lay2_price) {
              this.status = 'profit';
              this.cash_out_profit = last_bet.exp_amount3 + ((Math.abs(last_bet.win_amount) * current_market.lay2_price) - Math.abs(last_bet.win_amount));
              //console.log("l-p/l", this.cash_out_profit);
              this.total_profit_loss = Math.abs(last_bet.loss_amount) + this.cash_out_profit;
              //console.log("l-tp/l", this.cash_out_profit);

              this.cash_out_profit = (this.cash_out_profit * 75) / 100;
              this.total_profit_loss = (this.total_profit_loss * 75) / 100;
            } else if (last_bet.price > current_market.lay2_price) {
              this.cash_out_profit = last_bet.exp_amount3 + ((Math.abs(last_bet.win_amount) * current_market.lay2_price) - Math.abs(last_bet.win_amount));
              this.status = 'loss';
              //console.log("l-p/l", this.cash_out_profit);
              //console.log("l-tp/l", this.cash_out_profit);
              this.total_profit_loss = Math.abs(last_bet.loss_amount) + this.cash_out_profit;
            } else {
              this.cash_out_profit = 0;
              this.total_profit_loss = Math.abs(last_bet.loss_amount);
              this.status = 'profit';
            }
          }
        }
      }


      //console.log(this.cash_out_profit)
      //console.log(this.total_profit_loss)
      //console.log(this.status);


    }
  }

  display_cashout() {
    // console.log(this.cashout_price);

    if (this.cashout_price >= 1.03 && this.cashout_price < 11.01) {
      this.show_cashout_confirm = true;
    } else {
      this.cashout_errmsg = "Cash out can be done for ODDs between 1.03 and 11.01";
    }
    //console.log(this.cashout_errmsg);
  }

  submit_cashout(is_confirm: boolean) {
    if (is_confirm) {
      let cashout_details = {
        user_id: localStorage.getItem('user_id'),
        event_id: this.event_id,
        runner_name: this.match_bets[0].runner_name,
        type: this.match_bets[0].type,
        new_price: this.cashout_price,
        price: this.match_bets[0].price,
        main_type: 'match_odd',
        amount: this.total_profit_loss.toFixed(2),
        status: this.status,
        loss_amount: this.match_bets[0].loss_amount,
        cashout_pl: this.cash_out_profit.toFixed(2),
        market_id: this.match_bets[0].market_id
      }
      //console.log('casshh-->', cashout_details);
      this.matchBetsService.cashout(cashout_details).subscribe((res: any) => {
        this.toastr.success('cashed out successfully');
        this.getMatchBets();
      });
      this.show_cashout_confirm = false;
    } else {
      this.show_cashout_confirm = false;
    }
  }

  config: MatDialogConfig = {
    disableClose: false,
    hasBackdrop: true,
    backdropClass: 'test',
    width: '90%',
    height: '50%',
    panelClass: 'makeItMiddle', //Class Name that can be defined in styles.css as follows:
  };

  async openDialog(
    type: any,
    data: any,
    price: any,
    size: any,
    runner_name: string,
    index: number = 0,
    min?: number,
    max?: number,
    market_id=null
  ) {  
    try {
      let config = {
        disableClose: true,
        data: {
          g_type: 'cricket',
          m_type: type,
          type: data,
          user_id: localStorage.getItem('user_id'),
          event_id: this.event_id,
          runner_name: runner_name,
          value: { price, size },
          market_id: market_id ? market_id : this.markets.length !== 0 ? this.markets[0].market_id : 0,
          index,
          market_name: this.market_name,
          enable_draw: this.enable_draw,
          ...(min !== undefined && max !== undefined ? { min, max } : {}),
        }
      };
      
      // Step 1: Set shared data
      this.betSlipService.setSharedData(config.data);
  
      // Step 2: Wait for parent to finish updating
      await this.betSlipService.callParentFunction();
  
      // Step 3: Fetch updated bet data
      this.betdata = await this.getBetDataFromService();
  
      // Step 4: Update UI
      this.betslip_odd_runner = this.betdata.runner_name || '';
      this.betslip_odd_type = this.betdata.m_type || '';
      this.betslip_visible = true;
      
    } catch (error) {
      console.error("Error in openDialog:", error);
    }
  }

  private async fetchBetDataFromAPI() {
    // Simulate async API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("Bet data fetched");
        resolve();
      }, 500); // simulate 0.5s delay
    });
  }

private getBetDataFromService(): Promise<any> {
  return new Promise((resolve) => {
    this.betSlipService.setParentFunction(() => {
      const data = this.betSlipService.getSharedData();
      resolve(data);
    });
  });
}

  closeBet() {
    console.log('close');
    
    this.betdata = {};
    this.betslip_visible = false;
  }
  selectTab(index: number): void {
    this.selectedTabIndex = index;
  }

  openLadder(runner: any, event_id: any) {
    const dialogRef = this.dialog.open(SessionLadder, {
        autoFocus: false,
        position: {top: '3rem'},
        maxWidth: '90vh%',
        width: '100vh',
        maxHeight: '90vh',
        data: {runner: runner, event_id: event_id}
    });
    dialogRef.afterClosed().subscribe((result: any) => {
        console.log(`Dialog result: ${result}`);
    });
  }

  openRulesbook() {
    const dialogRef = this.dialog.open(NewRulesModelComponent, {
        autoFocus: false,
        position: {top: '3rem'},
        maxWidth: '90vh%',
        width: '100vh',
        maxHeight: '80vh',
    });
    dialogRef.afterClosed().subscribe((result: any) => {
        console.log(`Dialog result: ${result}`);
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.myInterval);
    this.sessionSubscription.unsubscribe();
    this.fancySubscription.unsubscribe();
    this.marketSubscription.unsubscribe();
    // this.scoreSubscription.unsubscribe();
    this.bookmakerSubscription.unsubscribe();
  }

    // default active

setActiveTab(tab: string): void {
  this.activeTab = tab;
}

startCountdown() {
  this.timer = setInterval(() => {
    const now = new Date().getTime();
    const startTime = new Date(this.marketStartTime).getTime();
    let diff = startTime - now;

    if (diff <= 35 * 60 * 1000) { 
      this.tossVisible = false;
    }

    if (diff <= 0) {
      this.countdown = "Started";
      clearInterval(this.timer);
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);
    const seconds = Math.floor(diff / 1000);

    this.countdown =
      `${hours}h ${minutes}m ${seconds}s`;
  }, 1000);
}

calculate_new_cashout(){
  let index = 0;
  let bet_type = '';
  let runner_name = '';
  let price = 0;
  let size = 0;
  if (this.match_bets.length != 0) {

    this.cashout_submited = !this.match_bets[0].is_switched;
    let last_bet = this.match_bets[this.match_bets.length - 1]
    let current_market = this.market[0];

    if(last_bet.runner_name == current_market.runner1){
    if(last_bet.type == 'Back'){
      this.cashout_stake = last_bet.bet_amount * last_bet.price / current_market.lay0_price
      bet_type = 'Lay';
      index = 1;
      runner_name = current_market.runner1;
      price = current_market.lay0_price;
      size = current_market.lay0_size;
    }

    else if(last_bet.type == 'Lay'){
      this.cashout_stake = last_bet.bet_amount * last_bet.price / current_market.back0_price
      bet_type = 'Back';
      index = 1;
      runner_name = current_market.runner1;
      price = current_market.Back0_price;
      size = current_market.Back0_size;
    }
    }

    else if(last_bet.runner_name == current_market.runner2){
    if(last_bet.type == 'Back'){
      this.cashout_stake = last_bet.bet_amount * last_bet.price / current_market.lay1_price;
      bet_type = 'Lay';
      index = 2;
      runner_name = current_market.runner2;
      price = current_market.lay1_price;
      size = current_market.lay1_size;
    }

    else if(last_bet.type == 'Lay'){
      this.cashout_stake = last_bet.bet_amount * last_bet.price / current_market.back1_price
      bet_type = 'Back';
      index = 2;
      runner_name = current_market.runner2;
      price = current_market.Back1_price;
      size = current_market.Back1_size;
    }
  }

    else if(last_bet.runner_name == 'Draw'){
    if(last_bet.type == 'Back'){
      this.cashout_stake = last_bet.bet_amount * last_bet.price / current_market.lay2_price;
      bet_type = 'Lay';
      index = 2;
      runner_name = 'Draw';
      price = current_market.lay2_price;
      size = current_market.lay2_size;
    }

    else if(last_bet.type == 'Lay'){
      this.cashout_stake = last_bet.bet_amount * last_bet.price / current_market.back2_price
      bet_type = 'Back';
      index = 2;
      runner_name = 'Draw';
      price = current_market.Back2_price;
      size = current_market.Back2_size;
    }
  }
  this.cashout_stake = this.cashout_stake.toFixed(2)
  this.cashout_final_profit = (last_bet.bet_amount - this.cashout_stake).toFixed(2)
  // this.submit_new_cashout('match_odd', bet_type, runner_name, price, size, index, 100, 100000)

  this.bet_data = {
    g_type: 'cricket',
    m_type: 'match_odd',
    type: bet_type,
    user_id: localStorage.getItem('user_id'),
    event_id: this.event_id,
    runner_name: runner_name,
    value: { price, size },
    market_id: this.markets.length !== 0 ? this.markets[0].market_id : 0,
    index,
    market_name: this.market_name,
    enable_draw: this.enable_draw,
    min: 100,
    max: 100000
  }
  }

}
getFavoriteRunner(market: any) {
  const r1Back = Number(market.back0_price ?? Infinity);
  const r1Lay = Number(market.lay0_price ?? Infinity);
  const r1Effective = Math.min(r1Back, r1Lay);

  const r2Back = Number(market.back1_price ?? Infinity);
  const r2Lay = Number(market.lay1_price ?? Infinity);
  const r2Effective = Math.min(r2Back, r2Lay);

  if (r1Effective < r2Effective) {
    return {
      runner_name: market.runner1,
      index: 1,
      back_price: market.back0_price,
      back_size: market.back0_size,
      lay_price: market.lay0_price,
      lay_size: market.lay0_size,
    };
  } else {
    return {
      runner_name: market.runner2,
      index: 2,
      back_price: market.back1_price,
      back_size: market.back1_size,
      lay_price: market.lay1_price,
      lay_size: market.lay1_size,
    };
  }
}
isSameRunnerBets(current_market: any) {
  if (!this.match_bets || this.match_bets.length === 0) {
    return { isSame: true };
  }

  const firstRunner = this.match_bets[0].runner_name;
  const allSame = this.match_bets.every(bet => bet.runner_name === firstRunner);

  if (!allSame) {
    return { isSame: false };
  }

  let runnerData;
  if (current_market.runner1 === firstRunner) {
    runnerData = {
      isSame: true,
      runner_name: current_market.runner1,
      index: 1,
      back_price: current_market.back0_price,
      back_size: current_market.back0_size,
      lay_price: current_market.lay0_price,
      lay_size: current_market.lay0_size
    };
  } else {
    runnerData = {
      isSame: true,
      runner_name: current_market.runner2,
      index: 2,
      back_price: current_market.back1_price,
      back_size: current_market.back1_size,
      lay_price: current_market.lay1_price,
      lay_size: current_market.lay1_size
    };
  }

  return runnerData;
}
calculate_new_cashout2(){
  let index = 0;
  let bet_type = '';
  let runner_name = '';
  let price = 0;
  let size = 0;
  if (this.match_bets.length != 0) {
    this.cashout_submited = !this.match_bets[0].is_switched;
    let last_bet = this.match_bets[0]
    let current_market = this.market[0];

    let favorite_runner = this.getFavoriteRunner(current_market);
    let isSameRunnerBets = this.isSameRunnerBets(current_market);

    //console.log({isSameRunnerBets})

    //console.log('last bet-->', last_bet);
    //console.log('current market-->', current_market);

    if(last_bet.type == 'Back'){
      this.cashout_stake = last_bet.price * last_bet.bet_amount / current_market.lay0_price - last_bet.bet_amount;
      //console.log('back cashout stake-->', this.cashout_stake);
    }else{
      this.cashout_stake = current_market.lay0_price * last_bet.bet_amount / current_market.back0_price - last_bet.bet_amount;
    }

    if(isSameRunnerBets.isSame){
      // console.log('same runner bets');
      if(last_bet.type == 'Back'){
        bet_type = 'Lay';
        index = isSameRunnerBets.index ?? index;
        runner_name = isSameRunnerBets.runner_name;
        price = isSameRunnerBets.lay_price;
        size = isSameRunnerBets.lay_size;
      }else{
        bet_type = 'Back';
        index = isSameRunnerBets.index ?? index;
        runner_name = isSameRunnerBets.runner_name;
        price = isSameRunnerBets.back_price;
        size = isSameRunnerBets.back_size;
      }
    }

    if(last_bet.price>2){
      bet_type = 'Lay';
      index = favorite_runner.index;
      runner_name = favorite_runner.runner_name;
      price = favorite_runner.lay_price;
      size = favorite_runner.lay_size;
    }

    this.cashout_stake = this.cashout_stake.toFixed(2)
    // console.log(last_bet.bet_amount,this.cashout_stake)
    this.cashout_final_profit = (last_bet.bet_amount + parseFloat(this.cashout_stake));

    this.bet_data = {
      g_type: 'cricket',
      m_type: 'match_odd',
      type: bet_type,
      bet_amount: this.cashout_final_profit,
      user_id: localStorage.getItem('user_id'),
      event_id: this.event_id,
      runner_name: runner_name,
      value: { price, size },
      market_id: this.markets.length !== 0 ? this.markets[0].market_id : 0,
      index,
      market_name: this.market_name,
      enable_draw: this.enable_draw,
      min: 100,
      max: 100000
    }
  }

}

display_new_cashout(){
  this.show_new_cashout_confirm = true;
}


submit_new_cashout_old() {

  // if (is_confirm) {
  //   let cashout_details = {
  //     user_id: localStorage.getItem('user_id'),
  //     event_id: this.event_id,
  //     runner_name: this.match_bets[0].runner_name,
  //     type: this.match_bets[0].type == 'Back' ? 'Lay' : 'Back',
  //     new_price: this.market[0],
  //     price: this.match_bets[0].price,
  //     main_type: 'match_odd',
  //     amount: this.total_profit_loss.toFixed(2),
  //     status: this.status,
  //     loss_amount: this.match_bets[0].loss_amount,
  //     cashout_pl: this.cash_out_profit.toFixed(2),
  //     market_id: this.match_bets[0].market_id
  //   }
  //   //console.log('casshh-->', cashout_details);
  //   this.matchBetsService.cashout(cashout_details).subscribe((res: any) => {
  //     this.toastr.success('cashed out successfully');
  //     this.getMatchBets();
  //   });
  //   this.show_new_cashout_confirm = false;
  // } else {
  //   this.show_new_cashout_confirm = false;
  // }

  // this.bet_data = {
  //   g_type: 'cricket',
  //   m_type: type,
  //   type: data,
  //   user_id: localStorage.getItem('user_id'),
  //   event_id: this.event_id,
  //   runner_name: runner_name,
  //   value: { price, size },
  //   market_id: this.markets.length !== 0 ? this.markets[0].market_id : 0,
  //   index,
  //   market_name: this.market_name,
  //   enable_draw: this.enable_draw,
  //   ...(min !== undefined && max !== undefined ? { min, max } : {}),
  // }

  this.price = Number(this.bet_data.value.price);
  this.size = Number(this.bet_data.value.size);
  this.count = Number(this.cashout_stake);

  this.calculate();
  
}

submit_new_cashout() {
  this.price = Number(this.bet_data.value.price);
  this.size = Number(this.bet_data.value.size);
  this.count = Number(this.cashout_final_profit);

  this.calculate();
}

calculate() {
// if (this.bet_data.m_type == 'bookmaker') {
//       this.bookMakerBetService.getBookmakerUserBetsByEventId(this.bet_data.event_id).subscribe((res: any) => {
//           this.existing_BookmakerBet = res;
//           if (this.existing_BookmakerBet.length == 0 || this.existing_BookmakerBet == null) {
//               this.calculateFirstBookmakerByIndex(this.bet_data.index);
//           } else {
//               if (this.bet_data.enable_draw) {
//                   this.last_min_exp = Math.min(this.existing_BookmakerBet[0].exp_amount1, this.existing_BookmakerBet[0].exp_amount2, this.existing_BookmakerBet[0].exp_amount3)
//               } else if (this.bet_data.enable_draw == false) {
//                   this.last_min_exp = Math.min(this.existing_BookmakerBet[0].exp_amount1, this.existing_BookmakerBet[0].exp_amount2)
//               }
//               if (this.existing_BookmakerBet[0].runner_name == this.bet_data.runner_name) {
//                   this.calcaulteByBookmakerIndex(this.bet_data.index);
//               } else {
//                   this.calcaulteByBookmakerIndex(this.bet_data.index);
//               }
//           }
//       })
//   } else if (this.bet_data.m_type == 'match_odd' && this.bet_data.g_type == 'cricket') {
      this.matchBetsService.getUserBetsByEventId(this.bet_data.event_id).subscribe((res: any) => {
          this.existing_matchBet = res;
          if (this.existing_matchBet.length == 0) {
              this.calculateFirstSwitchByIndex(this.bet_data.index);
          } else {
              //console.log(this.existing_matchBet[0].runner_name);
              if (this.bet_data.enable_draw) {
                  this.last_min_exp = Math.min(this.existing_matchBet[0].exp_amount1, this.existing_matchBet[0].exp_amount2, this.existing_matchBet[0].exp_amount3)
              } else if (this.bet_data.enable_draw == false) {
                  this.last_min_exp = Math.min(this.existing_matchBet[0].exp_amount1, this.existing_matchBet[0].exp_amount2)  
              }
              if (this.existing_matchBet[0].runner_name == this.bet_data.runner_name) {
                  this.calcaulteByIndex(this.bet_data.index);
              } else {
                  this.calcaulteByIndex(this.bet_data.index);
              }
          }
          this.submit()
      });

  // }
}

calcaulteByIndex(index: any) {
  // console.log('index-->', index);
  switch (index) {
      case 1:
          if (this.bet_data.type == 'Back') {
              this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
              this.finalLoss = 0 - this.count;
              this.exp_amount1 = this.existing_matchBet[0].exp_amount1 + this.finalProfit;
              this.exp_amount2 = this.existing_matchBet[0].exp_amount2 + this.finalLoss;
              this.exp_amount3 = this.existing_matchBet[0].exp_amount3 + this.finalLoss;
          } else if (this.bet_data.type == 'Lay') {
              this.finalProfit = this.count;
              this.finalLoss = 0 - (+(this.price * this.count).toFixed(2) - this.count)
              this.exp_amount1 = this.existing_matchBet[0].exp_amount1 + this.finalLoss;
              this.exp_amount2 = this.existing_matchBet[0].exp_amount2 + this.finalProfit;
              this.exp_amount3 = this.existing_matchBet[0].exp_amount3 + this.finalProfit;
              
          } else if (this.bet_data.type == 'Draw') {
              this.finalProfit = (+(this.price * this.count).toFixed(2)) - this.count;
              this.finalLoss = 0 - this.count;
              this.exp_amount1 = this.existing_matchBet[0].exp_amount1 + this.finalProfit;
              this.exp_amount2 = this.existing_matchBet[0].exp_amount2 + this.finalLoss;
              this.exp_amount3 = this.existing_matchBet[0].exp_amount3 + this.finalLoss;
          }
          break;
      case 2:
          if (this.bet_data.type == 'Back') {
              this.finalProfit = (+(this.price * this.count).toFixed(2)) - this.count;
              this.finalLoss = 0 - this.count;
              this.exp_amount1 = this.existing_matchBet[0].exp_amount1 + this.finalLoss;
              this.exp_amount2 = this.existing_matchBet[0].exp_amount2 + this.finalProfit;
              this.exp_amount3 = this.existing_matchBet[0].exp_amount3 + this.finalLoss;
          } else if (this.bet_data.type == 'Lay') {
              this.finalProfit = this.count;
              this.finalLoss = 0 - (+(this.price * this.count).toFixed(2) - this.count)
              this.exp_amount1 = this.existing_matchBet[0].exp_amount1 + this.finalProfit;
              this.exp_amount2 = this.existing_matchBet[0].exp_amount2 + this.finalLoss;
              this.exp_amount3 = this.existing_matchBet[0].exp_amount3 + this.finalProfit;
          } else if (this.bet_data.type == 'Draw') {
              this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
              this.finalLoss = 0 - this.count;
              this.exp_amount1 = this.existing_matchBet[0].exp_amount1 + this.finalLoss;
              this.exp_amount2 = this.existing_matchBet[0].exp_amount2 + this.finalProfit;
              this.exp_amount3 = this.existing_matchBet[0].exp_amount3 + this.finalLoss;
          }
          break;
      case 3:
          if (this.bet_data.type == 'Back') {
              this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
              this.finalLoss = 0 - this.count;
              this.exp_amount1 = this.existing_matchBet[0].exp_amount1 + this.finalLoss;
              this.exp_amount2 = this.existing_matchBet[0].exp_amount2 + this.finalLoss;
              this.exp_amount3 = this.existing_matchBet[0].exp_amount3 + this.finalProfit;

          } else if (this.bet_data.type == 'Lay') {
              this.finalProfit = this.count;
              this.finalLoss = 0 - ((+(this.price * this.count).toFixed(2)) - this.count)
              this.exp_amount1 = this.existing_matchBet[0].exp_amount1 + this.finalProfit;
              this.exp_amount2 = this.existing_matchBet[0].exp_amount2 + this.finalProfit;
              this.exp_amount3 = this.existing_matchBet[0].exp_amount3 + this.finalLoss;
          } else if (this.bet_data.type == 'Draw') {
              this.finalProfit = (+(this.price * this.count).toFixed(2)) - this.count;
              this.finalLoss = 0 - this.count;
              this.exp_amount1 = this.existing_matchBet[0].exp_amount1 + this.finalLoss;
              this.exp_amount2 = this.existing_matchBet[0].exp_amount2 + this.finalLoss;
              this.exp_amount3 = this.existing_matchBet[0].exp_amount3 + this.finalProfit;

          }
          break;
      default:
          break;
      //console.log('e1,e2,e3', this.exp_amount1, this.exp_amount2, this.exp_amount3);
  }


}


calculateFirstSwitchByIndex(index: any) {
  switch (index) {
      case 1:
          if (this.bet_data.type == 'Back') {
              this.finalProfit = (+(this.price * this.count).toFixed(2)) - this.count;
              this.finalLoss = 0 - this.count;
              this.exp_amount1 = this.finalProfit;
              this.exp_amount2 = this.finalLoss;
              this.exp_amount3 = this.finalLoss;
          } else if (this.bet_data.type == 'Lay') {
              this.finalProfit = this.count;
              this.finalLoss = 0 - ((+(this.price * this.count).toFixed(2)) - this.count);
              this.exp_amount1 = this.finalLoss;
              this.exp_amount2 = this.finalProfit;
              this.exp_amount3 = this.finalProfit;
          } else if (this.bet_data.type == 'Draw') {
              this.finalLoss = 0 - this.count;
              this.exp_amount1 = this.finalProfit;
              this.exp_amount2 = this.finalLoss;
              this.exp_amount3 = this.finalLoss;
          }
          break;
      case 2:
          if (this.bet_data.type == 'Back') {
              this.finalProfit = (+(this.price * this.count).toFixed(2)) - this.count;
              this.finalLoss = 0 - this.count;
              this.exp_amount1 = this.finalLoss;
              this.exp_amount2 = this.finalProfit;
              this.exp_amount3 = this.finalLoss;
          } else if (this.bet_data.type == 'Lay') {
              this.finalProfit = this.count;
              this.finalLoss = 0 - ((+(this.price * this.count).toFixed(2)) - this.count);
              this.exp_amount1 = this.finalProfit;
              this.exp_amount2 = this.finalLoss;
              this.exp_amount3 = this.finalProfit;
          } else if (this.bet_data.type == 'Draw') {
              this.finalLoss = 0 - this.count;
              this.exp_amount1 = this.finalLoss;
              this.exp_amount2 = this.finalProfit;
              this.exp_amount3 = this.finalLoss;
          }
          break;
      case 3:
          if (this.bet_data.type == 'Back') {
              this.finalProfit = (+(this.price * this.count).toFixed(2)) - this.count;
              this.finalLoss = 0 - this.count;
              this.exp_amount1 = this.finalLoss;
              this.exp_amount3 = this.finalProfit;
              this.exp_amount2 = this.finalLoss;
          } else if (this.bet_data.type == 'Lay') {
              this.finalProfit = this.count;
              this.finalLoss = 0 - ((+(this.price * this.count).toFixed(2)) - this.count);
              this.exp_amount1 = this.finalProfit;
              this.exp_amount3 = this.finalLoss;
              this.exp_amount2 = this.finalProfit;
          } else if (this.bet_data.type == 'Draw') {
              this.finalLoss = 0 - this.count;
              this.exp_amount1 = this.finalLoss;
              this.exp_amount3 = this.finalProfit;
              this.exp_amount2 = this.finalLoss;
          }
          break;
      default:
          break

  }
}

submit() {
  // console.log(this.count);
  //console.log('bet data', this.bet_data);
  let allow_bet = false;

  if (this.bet_data.m_type == 'bookmaker') {
      if (this.count >= this.bet_data.min && this.count <= this.bet_data.max) {
          allow_bet = true;3
      }
  }
  if (this.bet_data.m_type == 'match_odd') {
      if (this.count >= 100) {
          allow_bet = true;
      }
  }

  if (allow_bet) {
      //console.log(" allowed fancy")
      this.userService.getUserBalance(this.bet_data.user_id).subscribe((data: any) => {
          this.userBalance = data.balance;
          this.exposureService.getExposure().subscribe((data: any) => {
              this.m_exp = data;
              let exp = Number(this.m_exp[0].exp_amount);
              //console.log('exp->', exp);
              // if ((this.userBalance) >= Math.abs(this.finalLoss) && (this.userBalance + exp) > 0) {
                 if (this.bet_data.m_type == 'match_odd') {
                  let match_bet: any = {
                      user_id: this.bet_data.user_id,
                      event_id: this.bet_data.event_id,
                      market_id: this.bet_data.market_id,
                      runner_name: this.bet_data.runner_name.trim(),
                      main_type: 'match_odd',
                      type: this.bet_data.type,
                      price: this.bet_data.value.price,
                      size: this.bet_data.value.size,
                      bet_amount: this.count,
                      loss_amount: this.finalLoss.toFixed(2),
                      win_amount: this.finalProfit,
                      exp_amount1: this.exp_amount1,
                      exp_amount2: this.exp_amount2,
                      exp_amount3: this.exp_amount3,
                      index: this.bet_data.index,
                      market_name: this.bet_data.market_name,
                      g_type: this.bet_data.g_type,
                      enable_draw: this.bet_data.enable_draw
                  }

                  // console.log(this.exp_amount1, this.exp_amount2, this.exp_amount3);
                  // console.log('wa', this.finalProfit);
                  // console.log('la', this.finalLoss);
                  let latest_min_exp = 0;
                  if (this.bet_data.enable_draw) {
                      latest_min_exp = Math.min(this.exp_amount1, this.exp_amount2, this.exp_amount3);
                  } else if (this.bet_data.enable_draw == false) {
                    // console.log(this.exp_amount1);
                    // console.log(this.exp_amount2);
                    
                      latest_min_exp = Math.min(this.exp_amount1, this.exp_amount2);
                  }
                  // console.log('last', this.last_min_exp);
                  let final_bal = (this.userBalance + exp) - this.last_min_exp + latest_min_exp;
                  // console.log('new', latest_min_exp);
                  // console.log('final bal ', final_bal);
                  if (final_bal >= 0) {
                      switch (this.bet_data.g_type) {
                          case 'cricket':
                              let data = {
                                  market_id: match_bet.market_id,
                                  runner_name: match_bet.runner_name,
                                  type: match_bet.type,
                                  price: match_bet.price
                              }
                              // this.matchService.CheckMatchOddChange(data).subscribe((res: any) => {
                              //     if (res.change) {
                              //         this.toastr.error('Odds Changed..!!');
                              //         this.dialogRef.close();
                              //     } else {
                                      this.matchBetsService.addMatchBet(match_bet).subscribe((res: any) => {
                                          if (res.hasOwnProperty('error')) {
                                              this.toastr.error(res.error);
                                          } else if (res.hasOwnProperty('message')) {
                                              this.toastr.success("Cricket " + res.message);
                                          }
                                      });
                              //     }
                              // });
                              break;
                          default:
                              break;
                      }
                  } else {
                      this.toastr.error("Insufficient Balance, you cannot place bet.!");
                  }
              } 
              // else if (this.bet_data.m_type == 'bookmaker') {
              //     this.submitted_disabled = true;
              //     let match_bet: any = {
              //         user_id: this.bet_data.user_id,
              //         event_id: this.bet_data.event_id,
              //         market_id: this.bet_data.market_id,
              //         runner_name: this.bet_data.runner_name.trim(),
              //         main_type: 'bookmaker',
              //         type: this.bet_data.type,
              //         price: this.bet_data.value.price,
              //         size: this.bet_data.value.size,
              //         bet_amount: this.count,
              //         loss_amount: this.finalLoss.toFixed(2),
              //         win_amount: this.finalProfit.toFixed(2),
              //         exp_amount1: this.exp_amount1.toFixed(2),
              //         exp_amount2: this.exp_amount2.toFixed(2),
              //         exp_amount3: this.exp_amount3.toFixed(2),
              //         index: this.bet_data.index,
              //         market_name: this.bet_data.market_name,
              //         g_type: this.bet_data.g_type,
              //         enable_draw: this.bet_data.enable_draw
              //     }
              //     // console.log('bm-->',match_bet);
              //     // console.log(this.exp_amount1, this.exp_amount2, this.exp_amount3);
              //     // console.log('wa', this.finalProfit);
              //     // console.log('la', this.finalLoss);
              //     let latest_min_exp = 0;
              //     if (this.bet_data.enable_draw) {
              //         latest_min_exp = Math.min(this.exp_amount1, this.exp_amount2, this.exp_amount3);
              //     } else if (this.bet_data.enable_draw == false) {
              //         latest_min_exp = Math.min(this.exp_amount1, this.exp_amount2);
              //     }
              //     //console.log('last', this.last_min_exp);
              //     let final_bal = (this.userBalance + exp) - this.last_min_exp + latest_min_exp;
              //     //console.log('new', latest_min_exp);
              //     //console.log('final bal ', final_bal);
              //     if (final_bal >= 0) {
              //         let data = {
              //             market_id: match_bet.market_id,
              //             runner_name: match_bet.runner_name,
              //             type: match_bet.type,
              //             price: match_bet.price
              //         }
              //         this.bookMakerBetService.addBookmakerBet(match_bet).subscribe((res: any) => {
              //             if (res.hasOwnProperty('error')) {
              //                 this.toastr.error(res.error);
              //                 this.dialogRef.close();
              //             } else if (res.hasOwnProperty('message')) {
              //                 this.toastr.success(res.message);
              //                 this.dialogRef.close();
              //             }
              //         });

              //     } else {
              //         this.toastr.error("Insufficient Balance, you cannot place bet.!");
              //         this.dialogRef.close();
              //     }
              // } 
          }, (error) => {
              this.m_exp = [];
              return 0;
          });

      });
  } else {
      if (this.bet_data.m_type == 'match_odd') {
          this.toastr.error("Min bet must be 100");
      }
     else {
          this.toastr.error("Min bet must be 100");
      }
  }

}
}


