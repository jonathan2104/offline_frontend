import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {MatchService} from "../services/match.service";
import {Subscription} from "rxjs";
import {TennisoddsService} from "../services/tennis/tennisodds.service";
import {BannerService} from "../services/banner.service";
import {environment} from "../../environments/environment";
import {SocceroddsService} from "../services/soccer/soccerodds.service";
import {getCountryCode} from '../Data/Country';

@Component({
  selector: 'app-inplay-matches',
  templateUrl: './inplay-matches.component.html',
  styleUrls: ['./inplay-matches.component.css']
})
export class InplayMatchesComponent implements OnInit, OnDestroy {
  markets: any = [];
  tennisMarkets: any = [];
  soccerMarkets: any = [];
  tennisMarketLength: any;
  soccerMarketLength: any;
  banner_url: any = [];
  inActiveMarkets: any = [];
  myInterval: any
  private marketSubscription: Subscription;
  private tennisSubscription: Subscription;
  private soccerSubscription: Subscription;
  public getCountryCode = getCountryCode;

  constructor(private matchService: MatchService, private bannerService: BannerService, private soccerOddService: SocceroddsService, private tennisService: TennisoddsService, private router: Router) {
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
    this.getInplayTennisOdds();
    this.getInplaySoccerOdds();
    this.myInterval = setInterval(() => {
      this.getMatches();
      this.getInplayTennisOdds();
      this.getInplaySoccerOdds();
    }, 5000);


  }

  getMatches() {
    this.marketSubscription = this.matchService.getMatches().subscribe((res: any) => {
      const matches = res.map((match:any) => {
        const { back, lay } = this.getBackLay(match);
        return { ...match, ...back, ...lay };
      });
      this.markets = matches.filter((item: any) => item.inplay=='1');
      this.inActiveMarkets = matches.filter((item:any)=>!item.inplay);
    })
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

  getInplayTennisOdds() {
    this.tennisSubscription = this.tennisService.getAllTennisOdds().subscribe((res: any) => {
      this.tennisMarkets = res.filter((item: any) => item.inplay == "1");
      this.tennisMarketLength = this.tennisMarkets.length;
    })
  }

  getInplaySoccerOdds() {
    this.soccerSubscription = this.soccerOddService.getAllSoccerOdds().subscribe((res: any) => {
      this.soccerMarkets = res.filter((item: any) => item.inplay == "1");
      this.soccerMarketLength = this.soccerMarkets.length;
    })
  }

  openMatchDetails(event_id: any) {
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
    this.tennisSubscription.unsubscribe();
    this.soccerSubscription.unsubscribe();
  }


}
