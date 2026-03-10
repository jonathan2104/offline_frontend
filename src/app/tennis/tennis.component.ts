import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatchService} from "../services/match.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {TennisoddsService} from "../services/tennis/tennisodds.service";
import {BannerService} from "../services/banner.service";
import {environment} from "../../environments/environment";
import {SocceroddsService} from "../services/soccer/soccerodds.service";
import {NgbCarouselConfig} from "@ng-bootstrap/ng-bootstrap";
import {LiveCasinoService} from "../services/livecasino.service";

@Component({
    selector: 'app-tennis',
    templateUrl: './tennis.component.html',
    styleUrls: ['./tennis.component.css'],
    providers: [NgbCarouselConfig]
})
export class TennisComponent implements OnInit, OnDestroy {

    markets: any = [];
    marketLength: any;
    tennisMarketLength: any;
    soccerMarketLength: any;
    tennisMarkets: any = [];
    soccerMarkets: any = [];
    inActiveTennisMarkets: any = [];
    inActiveSoccerMarkets: any = [];
    inActiveMarkets: any = [];
    myInterval: any
    banner_url: any = [];


    private marketSubscription: Subscription;
    private tennisSubscription: Subscription;
    private soccerSubscription: Subscription;


    constructor(private matchService: MatchService, private soccerOddsService: SocceroddsService, private bannerService: BannerService, private tennsiOddsService: TennisoddsService, private router: Router, config: NgbCarouselConfig,) {
        config.interval = 3000;
        config.wrap = true;
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
        this.getAllTennisOdds();
        this.getAllSoccerOdds();
        this.myInterval = setInterval(() => {
            this.getMatches();
            this.getAllTennisOdds();
            this.getAllSoccerOdds();
        }, 5000);


    }

    getMatches() {
        this.marketSubscription = this.matchService.getMatches().subscribe((res: any) => {
            this.marketLength = res.length;
            this.markets = res.filter((item: any) => item.inplay);

            //sort res by start time
            res.sort((a: any, b: any) => {
                const startTimeA = new Date(a.start_time);
                const startTimeB = new Date(b.start_time);
                if (startTimeA < startTimeB) {
                    return -1;
                }
                if (startTimeA > startTimeB) {
                    return 1;
                }
                return 0;
            });
            this.inActiveMarkets = res.filter((item: any) => !item.inplay);
        })
    }

    getAllTennisOdds() {
        this.tennisSubscription = this.tennsiOddsService.getAllTennisOdds().subscribe((res: any) => {
            this.tennisMarketLength = res.length;
            this.tennisMarkets = res.filter((item: any) => item.inplay == "1");


            //sort res by start time
            res.sort((a: any, b: any) => {
                const startTimeA = new Date(a.start_time);
                const startTimeB = new Date(b.start_time);
                if (startTimeA < startTimeB) {
                    return -1;
                }
                if (startTimeA > startTimeB) {
                    return 1;
                }
                return 0;
            });
            this.inActiveTennisMarkets = res.filter((item: any) => item.inplay == "0");

        })
    }

    getAllSoccerOdds() {
        this.soccerSubscription = this.soccerOddsService.getAllSoccerOdds().subscribe((res: any) => {
            this.soccerMarketLength = res.length;
            this.soccerMarkets = res.filter((item: any) => item.inplay == "1");


            //sort res by start time
            res.sort((a: any, b: any) => {
                const startTimeA = new Date(a.start_time);
                const startTimeB = new Date(b.start_time);
                if (startTimeA < startTimeB) {
                    return -1;
                }
                if (startTimeA > startTimeB) {
                    return 1;
                }
                return 0;
            });
            this.inActiveSoccerMarkets = res.filter((item: any) => item.inplay == "0");

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
