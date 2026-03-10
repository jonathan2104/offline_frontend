import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {MatchService} from "../services/match.service";
import {Subscription} from "rxjs";
import {TennisoddsService} from "../services/tennis/tennisodds.service";
import {BannerService} from "../services/banner.service";
import {environment} from "../../environments/environment";
import {SocceroddsService} from "../services/soccer/soccerodds.service";
import {getCountryCode} from '../Data/Country';
import {LiveCasinoService} from "../services/livecasino.service";

@Component({
    selector: 'app-sportsbook',
    templateUrl: './sportsbook.component.html',
    styleUrls: ['./sportsbook.component.css']
})
export class SportsbookComponent implements OnInit, OnDestroy {
    markets: any = [];
    tennisMarkets: any = [];
    soccerMarkets: any = [];
    tennisMarketLength: any;
    soccerMarketLength: any;
    banner_url: any = [];
    inActiveMarkets: any = [];
    myInterval: any;
    user_id = localStorage.getItem("user_id");

    img_list = ["/assets/images/evolution.png", "/assets/images/ezugi.png", "/assets/images/PowerGames.png", "/assets/images/pragmatic play.png", "/assets/images/qtech.png", "/assets/images/supernova.png", "/assets/images/baccarat-x-pro.png"]
    vendors: any = [];
    casinoGamelist: any = [];
    groupedCasinoGameList: any[] = [];
    private marketSubscription: Subscription;
    private tennisSubscription: Subscription;
    private soccerSubscription: Subscription;
    public getCountryCode = getCountryCode;
    activecricket: boolean = true;
    activefootball: boolean = false;
    activetennis: boolean = false;
    IgtechcasinoGamelist: any = [];
    casinoTabs = ['All', 'Our Casino', 'Evolution', 'Ezugi', 'Betradar', 'BetGame', 'OnlyPlay' , 'Pragmatic Play' , 'Qtech' , 'SmartSoft gaming' , 'spribe', 'xpro gaming'];
    selectedTab = 0;
    constructor(private matchService: MatchService, private bannerService: BannerService, private soccerOddService: SocceroddsService, private tennisService: TennisoddsService, private router: Router, private liveCasinoService: LiveCasinoService,) {
    }

    ngOnInit(): void {

        this.getVendorList();
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
        // this.getCasinoGameList();
        this.getIGtechCasinoGameList();
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

    getBackLay(res: any) {
        let back: any = {back1: 0, back2: 0, back3: 0};
        let lay: any = {lay1: 0, lay2: 0, lay3: 0};

        if (res && res.runners && res.runners.length > 0) {
            res.runners.forEach((runner: any, index: any) => {
                if (runner.ex && runner.ex.availableToBack && runner.ex.availableToBack.length > 0) {
                    back[`back${index + 1}`] = runner.ex.availableToBack[0] ? runner.ex.availableToBack[0].price : null;
                }

                if (runner.ex && runner.ex.availableToLay && runner.ex.availableToLay.length > 0) {
                    lay[`lay${index + 1}`] = runner.ex.availableToLay[0] ? runner.ex.availableToLay[0].price : null;
                }
            });
        }
        return {back, lay}
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

     getVendorList() {
        this.liveCasinoService.getVendorsRequests().subscribe((res: any) => {
            this.vendors = res.map((value: any, index: any) => ({
                name: value,
                imageUrl: this.img_list[index], // Use the corresponding image URL from img_list
            }));
            console.log(this.vendors)
            // this.vendors = res;
            // this.vendors = res.filter((vendor:any) => vendor === "Evolution" || vendor === "Ezugi");
            // console.log(this.vendors);
            // if(this.vendors[0]) this.getGameList(this.vendors[0]);
            // if(res[0]) this.getGameList(res[0]);
        });
    }

     openCasino(provider:any){
        this.router.navigate(['/dashboard/casino', provider]);
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

    getCasinoGameList() {
        this.liveCasinoService.getGameList().subscribe((res: any) => {

          this.casinoGamelist=res;
          const imageBaseUrl = environment.image_url;
          this.casinoGamelist = res.map((obj: any) => {
            return {
              ...obj,
              path: imageBaseUrl  + obj.image,
            };
            
            
          });
          this.groupGamesIntoRows();
        });
    }

    groupGamesIntoRows() {
      this.groupedCasinoGameList = [];
      for (let i = 0; i < this.casinoGamelist.length; i += 6) {
        this.groupedCasinoGameList.push(this.casinoGamelist.slice(i, i + 6));
      }
      // console.log(this.groupedCasinoGameList);
      
    }
    openprovider(provider:any,game:any){
        if(game!=0){
          this.router.navigate(['/dashboard/livecasino'], { queryParams: { provider: provider, game:game } });
        }
        else{
          this.router.navigate(['/dashboard/livecasino'], { queryParams: { provider: provider } });
        }
        
      }
      activeSection(section: any){
        switch(section){
        case "cricket":
          this.activecricket =true;
          this.activefootball =false;
          this.activetennis =false;
          break;
        case "football":
          this.activefootball =true;
          this.activecricket =false;
          this.activetennis =false;
          break
        case "tennis":
          this.activetennis =true;
          this.activecricket =false;
          this.activefootball =false;
          break;
        }
      }
      getIGtechCasinoGameList() {
        this.liveCasinoService.getHomepageGames().subscribe((res: any) => {
          this.IgtechcasinoGamelist=res.games;  
        });
    }
    openNewGameTab(gameid: any, provider:any) {
      this.router.navigate(['/casino-detail-igtech/',gameid,provider])
  }
}
