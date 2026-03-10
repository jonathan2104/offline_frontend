import {Component,OnDestroy, OnInit} from '@angular/core';
import {MatchService} from "../services/match.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {TennisoddsService} from "../services/tennis/tennisodds.service";
import {BannerService} from "../services/banner.service";
import {environment} from "../../environments/environment";
import {SocceroddsService} from "../services/soccer/soccerodds.service";
import {NgbCarouselConfig} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-cricket',
  templateUrl: './cricket.component.html',
  styleUrls: ['./cricket.component.css'],
  providers: [NgbCarouselConfig]
})
export class CricketComponent implements OnInit, OnDestroy {

  markets: any = [];
  marketLength: any;
  tennisMarketLength: any;
  soccerMarketLength:any;
  tennisMarkets: any = [];
  soccerMarkets:any=[];
  inActiveTennisMarkets: any = [];
  inActiveSoccerMarkets:any=[];
  inActiveMarkets: any = [];
  myInterval: any
  banner_url: any = [];


  private marketSubscription: Subscription;
  // private tennisSubscription: Subscription;
  // private soccerSubscription: Subscription;


  constructor(private matchService: MatchService, private soccerOddsService:SocceroddsService ,private bannerService: BannerService, private tennsiOddsService: TennisoddsService, private router: Router,config: NgbCarouselConfig) {
    config.interval = 3000;
    config.wrap=true;
    config.keyboard = true;
    config.pauseOnHover = true;
  }

  ngOnInit(): void {

    this.bannerService.getBanner().subscribe((res: any) => {
      const imageBaseUrl = environment.image_url;
      this.banner_url = res.map((obj: any) => {
        return {
          ...obj,
          path: imageBaseUrl + obj.path,
        };
      });
    });

    this.getMatches();
    // this.getAllTennisOdds();
    // this.getAllSoccerOdds();
    this.myInterval = setInterval(() => {
      this.getMatches();
      // this.getAllTennisOdds();
      // this.getAllSoccerOdds();
    }, 5000);


  }

  getMatches() {
    this.marketSubscription = this.matchService.getMatches().subscribe((res: any) => {
      res.sort((a: any, b: any) => {
        const startTimeA = new Date(a.start_time);
        const startTimeB = new Date(b.start_time);

        if (a.inplay && !b.inplay) {
          return -1;
        } else if (!a.inplay && b.inplay) {
          return 1;
        }

        if ((a.inplay && b.inplay) || (!a.inplay && !b.inplay)) {
          if (startTimeA < startTimeB) {
            return -1;
          } else if (startTimeA > startTimeB) {
            return 1;
          }
        }
  
        return 0;
      });
      
  
      this.markets = res.map((match: any) => {
          const {back, lay} = this.getBackLay(match);
          return {...match, ...back, ...lay};
      });
    });
  }

  getBackLay(res:any){
    let back:any = { back1: 0, back2: 0, back3: 0 };
    let lay:any = { lay1: 0, lay2: 0, lay3: 0 };

    if (res && res.runners && res.runners.length > 0) {
      res.runners.forEach((runner:any, index:any) => {
        if (runner.ex && runner.ex.availableToBack && runner.ex.availableToBack.length > 0) {
          back[`back${index + 1}`] = runner.ex.availableToBack[0] ? runner.ex.availableToBack[0].price : null;
        }

        if (runner.ex && runner.ex.availableToLay && runner.ex.availableToLay.length > 0) {
          lay[`lay${index + 1}`] = runner.ex.availableToLay[0] ? runner.ex.availableToLay[0].price : null;
        }
      });
    }
    return {back,lay}
  }

  // getAllTennisOdds() {
  //   this.tennisSubscription = this.tennsiOddsService.getAllTennisOdds().subscribe((res: any) => {
  //     this.tennisMarketLength = res.length;
  //     this.tennisMarkets = res.filter((item: any) => item.inplay == "1");


  //     //sort res by start time
  //     res.sort((a: any, b: any) => {
  //       const startTimeA = new Date(a.start_time);
  //       const startTimeB = new Date(b.start_time);
  //       if (startTimeA < startTimeB) {
  //         return -1;
  //       }
  //       if (startTimeA > startTimeB) {
  //         return 1;
  //       }
  //       return 0;
  //     });
  //     this.inActiveTennisMarkets = res.filter((item: any) => item.inplay == "0");

  //   })
  // }

  //  getAllSoccerOdds() {
  //   this.soccerSubscription = this.soccerOddsService.getAllSoccerOdds().subscribe((res: any) => {
  //     this.soccerMarketLength = res.length;
  //     this.soccerMarkets = res.filter((item: any) => item.inplay == "1");


  //     //sort res by start time
  //     res.sort((a: any, b: any) => {
  //       const startTimeA = new Date(a.start_time);
  //       const startTimeB = new Date(b.start_time);
  //       if (startTimeA < startTimeB) {
  //         return -1;
  //       }
  //       if (startTimeA > startTimeB) {
  //         return 1;
  //       }
  //       return 0;
  //     });
  //     this.inActiveSoccerMarkets = res.filter((item: any) => item.inplay == "0");

  //   })
  // }

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

  ngOnDestroy(): void {
    clearInterval(this.myInterval);
    this.marketSubscription.unsubscribe();
    // this.tennisSubscription.unsubscribe();
    // this.soccerSubscription.unsubscribe();
  }



}
