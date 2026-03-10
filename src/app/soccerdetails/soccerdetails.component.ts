import {Component, OnInit, ViewChild, ElementRef, Renderer2, OnDestroy} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {BetslipComponent} from '../betslip/betslip.component';
import {ActivatedRoute} from "@angular/router";
import {Subscription, switchMap} from "rxjs";
import {ExposureService} from "../services/exposure.service";
import {ToastrService} from "ngx-toastr";
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {SocceroddsService} from "../services/soccer/soccerodds.service";
import {SoccerBetsService} from "../services/soccer/soccer-bets.service";
import {SoccerSessionService} from "../services/soccer/soccersession.service"
import {SoccerSessionBetService} from "../services/soccer/soccersession-bets.service"
import {BetSlipService} from '../services/betslip.service';
import {NewRulesModelComponent} from '../modals/new-rule-book/book.component';

@Component({
    selector: 'app-soccerdetails',
    templateUrl: './soccerdetails.component.html',
    styleUrls: ['./soccerdetails.component.css']
})
export class SoccerdetailsComponent implements OnInit, OnDestroy {
    data: any = {
        type: "back",
        value: 12
    };
    math = Math;
    event_id: any;
    market_id: any;
    market: any = [];
    markets: any = [];
    sessions: any = [];
    soccer_bets: any[] = [];
    soccersession_bets: any[] = [];
    myInterval: any
    selectedTabIndex = 0;
    videourl: SafeResourceUrl = "";
    scoreurl: SafeResourceUrl = "";
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

    constructor(public sanitizer: DomSanitizer, public dialog: MatDialog, private toastr: ToastrService, private renderer: Renderer2, private activatedRoute: ActivatedRoute, private soccerBetService: SoccerBetsService, private soccerOddService: SocceroddsService, private soccerSessionService: SoccerSessionService, private soccersessionBetService: SoccerSessionBetService,public betSlipService : BetSlipService) {
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((param: any) => {
            this.event_id = param['event_id'];
            this.videourl = this.sanitizer.bypassSecurityTrustResourceUrl("https://dpmatka.in/dtv.php?id=" + this.event_id);
            this.scoreurl = this.sanitizer.bypassSecurityTrustResourceUrl("https://dpmatka.in/sr.php?eventid=" + this.event_id + "&sportid=1");
            this.getMarket();
            this.getSoccerSession();
        });
        this.myInterval = setInterval(() => {
            if (this.market.length > 0) {
                this.getMarket();
                // this.getSoccerSession();
            }
            this.getSoccerBets();
            // this.getSoccerSessionBets();
        }, 1000);

        this.soccerBetService.refreshSoccerBets.subscribe(() => {
            this.getSoccerBets();
        })
        this.getSoccerSessionBets();
        this.startCountdown()
    }

    getSoccerBets() {
        this.soccerBetService.getSoccerBets(this.event_id).subscribe((data: any) => {
            //console.log(data);
            this.soccer_bets = data;
            //console.log(this.soccer_bets);
        });
    }

    getMarket() {
        this.marketSubscription = this.soccerOddService.getSoccerOddsByEventId(this.event_id).subscribe((res: any) => {
            if (res.length != 0 || res != null) {
                this.markets = res;
                //console.log(res);
                this.event_id = this.markets[0].event_id;

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
                if (this.soccer_bets.length != 0) {
                    if (this.soccer_bets[0].length != 0) {
                        this.market = this.markets.map((obj1: any) => {
                            let soccer_bet = []
                            soccer_bet.push(this.soccer_bets[0]);
                            const obj2 = soccer_bet.find((obj2: any) => (obj2.event_id == obj1.event_id));
                            //console.log('obj2-->', obj2);
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
                //console.log(this.market);
            }
            // this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.market[0].link);
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
        g_type: 'soccer',
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
        enable_draw: true
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


    getSoccerSession() {
        this.sessionSubscription = this.soccerSessionService.getSoccerSessionByEventId(this.event_id).subscribe((res: any) => {
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


    getSoccerSessionBets() {
        this.soccersessionBetService.getSoccerSessionBets(this.event_id).subscribe((data: any) => {
            // console.log(data);
            this.soccersession_bets = data;
            //console.log(this.soccer_bets);
        });
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
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
