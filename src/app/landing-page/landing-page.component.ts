import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {BannerService} from "../services/banner.service";
import {environment} from "../../environments/environment";
import {MatchService} from "../services/match.service";
import {Subscription} from "rxjs";
import {TennisoddsService} from "../services/tennis/tennisodds.service";
import {SocceroddsService} from "../services/soccer/soccerodds.service";
import {getCountryCode} from '../Data/Country';
import {LiveCasinoService} from "../services/livecasino.service";
import {TransactionService} from "../services/transaction.service";
import {MatDialog} from "@angular/material/dialog";
import {SupportComponent} from "../modals/support/support.component";
import {ApiproCasinoService} from "../services/apiprocasino.services";

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
    user_id = localStorage.getItem("user_id");
    banner_url: any = [];
    markets: any = [];
    tennisMarkets: any = [];
    soccerMarkets: any = [];
    tennisMarketLength: any;
    soccerMarketLength: any;
    inActiveMarkets: any = [];
    myInterval: any
    technical_whatsapp: string = '';
    instagram_channel: string = '';
    telegram_channel: string = '';
    email: string = '';
    gameList: any = [];
    isloading: boolean = false;
    gameurl: any = "";
    activeVendor: string = "";
    selectedGame: string = "";
    gameIds: string[] = ["100034", "200215" , "600000", "900000", "200828", "203982", "400000", "800001"];
    img_list = [ "/assets/images/pragmatic play.png", "/assets/images/habanero.png","/assets/images/boongo.png", "/assets/images/playson.png", "/assets/images/cq9.png",  "/assets/images/evoplay.png", "/assets/images/toptrend.png", " /assets/images/dreamtech.png", "/assets/images/pgsoft.png", "/assets/images/reel-kingdom.png", "/assets/images/ezugi.png", "/assets/images/evolution.png", "/assets/images/supernova.png", "/assets/images/baccarat-x-pro.png"]

    vendors: any = [];
    casinoGamelist: any = [];
    groupedCasinoGameList: any[] = [];
    private marketSubscription: Subscription;
    private tennisSubscription: Subscription;
    private soccerSubscription: Subscription;
    public getCountryCode = getCountryCode;

    constructor(private bannerService: BannerService,private apiproCasinoService:ApiproCasinoService, private matchService: MatchService, private soccerOddService: SocceroddsService, private tennisService: TennisoddsService, private router: Router, private liveCasinoService: LiveCasinoService, private transactionService: TransactionService, public dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.getVendorList();
        this.getPopupDataRequests();
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
        this.getGameList();
        this.getCasinoGameList();
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
      
    
      getInplayTennisOdds() {
        this.tennisSubscription = this.tennisService.getAllTennisOdds().subscribe((res: any) => {
          res.sort((a: any, b: any) => {
            const inplayA = a.inplay === '1';
            const inplayB = b.inplay === '1';
    
            if (inplayA && !inplayB) {
              return -1;
            } else if (!inplayA && inplayB) {
              return 1;
            }
    
            const startTimeA = new Date(a.start_time);
            const startTimeB = new Date(b.start_time);
            if ((inplayA && inplayB) || (!inplayA && !inplayB)) {
              if (startTimeA < startTimeB) {
                return -1;
              } else if (startTimeA > startTimeB) {
                return 1;
              }
            }
    
            return 0;
          });
    
          this.tennisMarkets = res;
          this.tennisMarketLength = this.tennisMarkets.length;
        });
      }
    
    
      getInplaySoccerOdds() {
        this.soccerSubscription = this.soccerOddService.getAllSoccerOdds().subscribe((res: any) => {
          res.sort((a: any, b: any) => {
            const inplayA = a.inplay === '1';
            const inplayB = b.inplay === '1';
    
            if (inplayA && !inplayB) {
              return -1;
            } else if (!inplayA && inplayB) {
              return 1;
            }
    
            const startTimeA = new Date(a.start_time);
            const startTimeB = new Date(b.start_time);
            if ((inplayA && inplayB) || (!inplayA && !inplayB)) {
              if (startTimeA < startTimeB) {
                return -1;
              } else if (startTimeA > startTimeB) {
                return 1;
              }
            }
    
            return 0;
          });
          this.soccerMarkets = res;
          this.soccerMarketLength = this.soccerMarkets.length;
        })
      }

    // getVendorList() {
    //     this.liveCasinoService.getVendorsRequests().subscribe((res: any) => {
    //         this.vendors = res.map((value: any, index: any) => ({
    //             name: value,
    //             imageUrl: this.img_list[index], // Use the corresponding image URL from img_list
    //         }));
    //         console.log(this.vendors)
    //         // this.vendors = res;
    //         // this.vendors = res.filter((vendor:any) => vendor === "Evolution" || vendor === "Ezugi");
    //         // console.log(this.vendors);
    //         // if(this.vendors[0]) this.getGameList(this.vendors[0]);
    //         // if(res[0]) this.getGameList(res[0]);
    //     });
    // }

    getPopupDataRequests() {
        this.transactionService.getPopupDataRequests().subscribe((res: any) => {
            this.technical_whatsapp = res[0].technical_whatsapp;
            this.instagram_channel = res[0].instagram;
            this.telegram_channel = res[0].telegram;
            this.email = res[0].email;
            console.log(res);
        });
    }

    techSupport() {
        this.openDialog();
        return true;
        location.href = "https://wa.me/91" + this.technical_whatsapp;
    }
    instagram() {
        location.href =  "https://www.instagram.com/jogobet?igsh=M2s2dGRmYjRhMmQz";
        //location.href =  this.instagram_channel;
    }
    telegram() {
        location.href =  "https://t.me/jogobet";
        //location.href =  this.telegram_channel;
    }


    openCasino(provider: any) {
        this.router.navigate(['/dashboard/casino', provider]);
    }

    openMatchDetails(event_id: any) {
        console.log("eventid", event_id);
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

    openDialog() {
        const dialogRef = this.dialog.open(SupportComponent,{minWidth: '90vw', maxHeight: '100vh' });
        dialogRef.afterClosed().subscribe((result: any) => {
        });
    
    }
    getVendorList() {
        this.liveCasinoService.getVendorsRequests().subscribe((res: any) => {
            // console.log(res.providers)
            this.vendors = res.providers.map((vendor: any, index: number) => {
                return {
                    name: vendor.name,  // or use the property that contains the vendor name
                    code: vendor.code,  // or use the property that contains the vendor code
                    image: this.img_list[index]
                };
            });
            const temp = this.vendors[1]
            this.vendors[1]= this.vendors[this.vendors.length-2]
            this.vendors[this.vendors.length-2]=temp

            const temp1 = this.vendors[2]
            this.vendors[2]= this.vendors[this.vendors.length-1]
            this.vendors[this.vendors.length-1]=temp1

            // console.log(this.vendors)
        });
    }
    getGameList() {
      this.apiproCasinoService.getAllGames({'gameids':this.gameIds}).subscribe(
        (res: any) => {
          if (res && res.data && res.data.length > 0) {
            this.gameList = this.filterLobby(res.data);
            this.isloading=false;
          } else {
            console.log('Empty or invalid response:', res);
          }
        },
        (error) => {
          console.error('Error fetching game list:', error);
        }
      );
    }

    filterLobby(data: any[]): any[] {
      const result: any[] = [];
      const encounteredGameIds: Set<string> = new Set();
  
      for (const gameId of this.gameIds) {
          const matchingEntry = data.find((entry) => entry.game_id === gameId);
  
          if (matchingEntry && !encounteredGameIds.has(matchingEntry.game_id)) {
              if (gameId === "100034") {
                  matchingEntry.url_thumb = '/assets/casino/EZUGIBANNER.png';
              }
              result.push(matchingEntry);
              encounteredGameIds.add(matchingEntry.game_id);
          }
      }

      return result;
    }

    openGametab(game: any) {
      this.router.navigate(['/casino-detail/'+game.game_id + '/' + game.provider_name]);
    }

    setSelectedGame(gameName: string) {
        this.selectedGame = gameName;
      }

      openprovider(provider:any,game:any){
        if(game!=0){
          this.router.navigate(['/dashboard/livecasino'], { queryParams: { provider: provider, game:game } });
        }
        else{
          this.router.navigate(['/dashboard/livecasino'], { queryParams: { provider: provider } });
        }
        
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
}
