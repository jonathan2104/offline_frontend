import {Component, OnInit, ViewChild, ElementRef, Renderer2, OnDestroy} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {BetslipComponent} from '../betslip/betslip.component';
import {ActivatedRoute} from "@angular/router";
import {Subscription, switchMap} from "rxjs";
import {ExposureService} from "../services/exposure.service";
import {ToastrService} from "ngx-toastr";
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {TennisoddsService} from "../services/tennis/tennisodds.service";
import {TennisBetsService} from "../services/tennis/tennis-bets.service";
import {TennisSessionService} from "../services/tennis/tennissession.service"
import {TennisSessionBetService} from "../services/tennis/tennissession-bets.service"
import {BetSlipService} from '../services/betslip.service';
import {NewRulesModelComponent} from '../modals/new-rule-book/book.component';

@Component({
    selector: 'app-tennisdetails',
    templateUrl: './tennisdetails.component.html',
    styleUrls: ['./tennisdetails.component.css']
})
export class TennisdetailsComponent implements OnInit, OnDestroy {
    @ViewChild('btn') btn: ElementRef;
    data: any = {
        type: "back",
        value: 12
    };
    math = Math;
    event: any = [];
    event_id: any;
    market_id: any;
    market: any = [];
    markets: any = [];
    sessions: any = [];

    tennis_bets: any[] = [];
    tennissession_bets: any[] = [];
    score: any = {};
    scoreLength = 0;
    myInterval: any
    exposuresPerRunner: any = [];
    urlSafe: SafeResourceUrl = "";
    is_score: boolean = false;
    market_name: any;
    videourl: SafeResourceUrl = "";
    scoreurl: SafeResourceUrl = "";


    selectedTabIndex = 0;
    previousPrices: any = {};
    showVideo: boolean = false;
    showScorecard: boolean = true;
    private scoreSubscription: Subscription;
    private marketSubscription: Subscription;
    private sessionSubscription: Subscription;

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
    marketStartTime: any;

    constructor(public sanitizer: DomSanitizer, public dialog: MatDialog, private toastr: ToastrService, private renderer: Renderer2, private activatedRoute: ActivatedRoute, private tennisOddService: TennisoddsService, private tennisBetsService: TennisBetsService, private exposureService: ExposureService, private tennisSessionService: TennisSessionService, private tennissessionBetService: TennisSessionBetService,public betSlipService : BetSlipService) {
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((param: any) => {
            // this.market_id = param['market_id'];
            this.event_id = param['event_id'];
            this.videourl = this.sanitizer.bypassSecurityTrustResourceUrl("https://dpmatka.in/dtv.php?id=" + this.event_id);
            this.scoreurl = this.sanitizer.bypassSecurityTrustResourceUrl("https://dpmatka.in/sr.php?eventid=" + this.event_id + "&sportid=2");
            this.getMarket();
            this.getTennisSession();
            // this.getTennisBets();
        });

        this.myInterval = setInterval(() => {
            if (this.market.length > 0) {
                this.getMarket();
                // this.getTennisSession();
            }
            this.getTennisBets();
            // this.getTennisSessionBets();
        }, 1000);

        this.tennisBetsService.refreshTennisBets.subscribe(() => {
            this.getTennisBets();
        })
        this.getTennisSessionBets();
        this.startCountdown()
    }

    getMarket() {
        console.log(this.event_id);
        
        this.marketSubscription = this.tennisOddService.getTennisOddsByEventId(this.event_id).subscribe((res: any) => {
            if (res.length != 0 || res != null) {
                this.markets = res;
                // console.log(res);
                this.event_id = this.markets[0].event_id;
                this.marketStartTime = this.markets[0].start_time;
                // highlight price change start
                const priceKeys = Object.keys(this.markets[0]).filter(key => key.endsWith('_price'));
                priceKeys.forEach(key => {
                if (this.previousPrices[key] !== this.markets[0][key]) {
                    this.previousPrices[key] = this.markets[0][key];
                    const tdElement = document.querySelector(`.${key}`);
                    if (tdElement) {
                    tdElement.classList.add('price-change');
                    setTimeout(() => {
                        tdElement.classList.remove('price-change');
                    }, 1000);
                    }
                }
                });
                // highlight price change start

                // console.log('market-->',this.markets);
                if (this.tennis_bets.length != 0) {
                    if (this.tennis_bets[0].length != 0) {
                        this.market = this.markets.map((obj1: any) => {
                            let tennis_bet = []
                            tennis_bet.push(this.tennis_bets[0]);
                            const obj2 = tennis_bet.find((obj2: any) => (obj2.event_id == obj1.event_id));
                            if (obj2) {
                                return {
                                    ...obj1,
                                    exp_amount1: obj2.exp_amount1,
                                    exp_amount2: obj2.exp_amount2,
                                    exp_amount3: obj2.exp_amount3
                                };
                            } else {
                                //console.log('elsee-->')
                                return {...obj1, exp_amount1: 0, exp_amount2: 0, exp_amount3: 0};
                            }
                        });
                    }
                } else {
                    this.market = this.markets.map((obj: any) => ({
                        ...obj,
                        exp_amount1: 0,
                        exp_amount2: 0,
                        exp_amount3: 0
                    }));
                }
            }
            // this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.market[0].link);
        });
    }

    getTennisBets() {
        this.tennisBetsService.getTennisBets(this.event_id).subscribe((data: any) => {
            //console.log(data);
            this.tennis_bets = data;
            //console.log(this.tennis_bets);
        });
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
  max?: number
) {
  try {



    let config = {
      disableClose: true,
      data: {
        g_type: 'tennis',
        m_type: type,
        type: data,
        user_id: localStorage.getItem('user_id'),
        event_id: this.event_id,
        runner_name: runner_name,
        value: {'price': price, 'size': size},
        market_id: this.markets.length != 0 ? this.market[0].market_id : 0,
        index: index,
        //market_name: this.market[0].runner1 + " v " + this.market[0].runner2,
        market_name: this.market[0].event_name,
        enable_draw: false
      }
    };
    
    // Step 1: Set shared data
    await this.betSlipService.setSharedData(config.data);

    // Step 2: Trigger parent function
    await this.betSlipService.callParentFunction();

    // Step 3: Wait for parent function result
    this.betdata = {};
    this.betdata = await this.getBetDataFromService();
    // console.log('betdat>', this.betdata);
    this.betslip_odd_runner = '';
    this.betslip_odd_type = '';
    this.betslip_odd_runner = this.betdata.runner_name;
    this.betslip_odd_type = this.betdata.m_type;
    // ✅ Now you can show betslip after data is ready
    this.betslip_visible = true;

  } catch (error) {
    console.error("Error in openDialog:", error);
  }
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


    ngOnDestroy(): void {
        clearInterval(this.myInterval);
        this.marketSubscription.unsubscribe();
        this.sessionSubscription.unsubscribe();
        // this.scoreSubscription.unsubscribe();
    }

    getTennisSession() {
        this.sessionSubscription = this.tennisSessionService.getTennisSessionByEventId(this.event_id).subscribe((res: any) => {
            if (res.length != 0 || res != null) {
                this.sessions = res;

                // if (this.soccersession_bets.length != 0) {
                //     if (this.soccersession_bets[0].length != 0) {
                //         this.sessions = this.sessions.map((obj1: any) => {
                //             let soccersession_bet = []
                //             soccersession_bet.push(this.soccer_bets[0]);
                //             const obj2 = soccersession_bet.find((obj2: any) => (obj2.event_id === obj1.event_id));
                //             //console.log('obj2-->', obj2);
                //             if (obj2) {
                //                 return {
                //                     ...obj1,
                //                     exp_amount1: obj2.exp_amount1,
                //                     exp_amount2: obj2.exp_amount2,
                //                     exp_amount3: obj2.exp_amount3
                //                 };
                //             } else {
                //                 //console.log('elsee-->')
                //                 return {...obj1, exp_amount1: 0, exp_amount2: 0, exp_amount3: 0};
                //             }
                //         });
                //     }
                // } else {
                //     this.sessions = this.sessions.map((obj: any) => ({
                //         ...obj,
                //         exp_amount1: 0,
                //         exp_amount2: 0,
                //         exp_amount3: 0
                //     }));
                // }
            }
        });
    }


    getTennisSessionBets() {
        this.tennissessionBetService.getTennisSessionBets(this.event_id).subscribe((data: any) => {
            // console.log(data);
            this.tennissession_bets = data;
            //console.log(this.soccer_bets);
        });
    }

    setActiveTab(tab: string): void {
        this.activeTab = tab;
      }

startCountdown() {
    this.timer = setInterval(() => {
      const now = new Date().getTime();
      const startTime = new Date(this.marketStartTime).getTime();
      let diff = startTime - now;
  
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
}
