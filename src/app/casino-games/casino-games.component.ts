import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser'
import {LiveCasinoService} from "../services/livecasino.service";
import {UserService} from "../services/user.service";
import { ActivatedRoute } from '@angular/router';
import {ExposureService} from "../services/exposure.service";
import {ToastrService} from "ngx-toastr";
import {NavbarComponent} from "../navbar/navbar.component";
import { ReloadService } from '../services/reload.service';


@Component({
    selector: 'app-casino-games',
    templateUrl: './casino-games.component.html',
    styleUrls: ['./casino-games.component.css'],
    providers: []
})
export class LivecasinoGamesComponent implements OnInit {
    user_id = localStorage.getItem("user_id");
    username = localStorage.getItem("username");
    balance = 0;
    vendors: any = [];
    gameList: any = [];
    gameurl: any = "";
    activeVendor: string = "";
    isloading: boolean = false;
    isscreenloading: boolean = false;
    is_active: boolean = false;
    clicked = false;
    img_list = [ "/assets/images/pragmatic play.png", "/assets/images/habanero.png","/assets/images/boongo.png", "/assets/images/playson.png", "/assets/images/cq9.png",  "/assets/images/evoplay.png", "/assets/images/toptrend.png", " /assets/images/dreamtech.png", "/assets/images/pgsoft.png", "/assets/images/reel-kingdom.png", "/assets/images/ezugi.png", "/assets/images/evolution.png", "/assets/images/supernova.png", "/assets/images/baccarat-x-pro.png"]
    selectedGame: string = "";
    provider: any;
    exposure: any = [];
    isLoggedIn: boolean = false;

    constructor(private liveCasinoService: LiveCasinoService, private sanitizer: DomSanitizer, private userService: UserService, private router: Router, private route: ActivatedRoute, private exposureService: ExposureService, private toasterService: ToastrService, private reloadService: ReloadService) {
    }

    ngOnInit(): void {
        this.getVendorList();

        this.userService.refreshBalance.subscribe(() => {
            this.getBalance();
        })
        this.getBalance();

        this.provider = this.route.snapshot.paramMap.get('gameid');

        this.getGameList(this.provider)
        
        this.getExposureDetails();

        setTimeout(() => {
            this.reloadService.triggerReload();
          }, 3000);

    }


    // getBalance() {
    //     this.userService.getUserBalance(this.user_id).subscribe((data: any) => {
    //         this.balance = data.balance;
    //         this.is_active = data.casino_active;
    //         console.log(this.balance)
    //     })
    // }
    async getBalance() {
        return new Promise<void>((resolve) => {
            this.userService.getUserBalance(this.user_id).subscribe((data: any) => {
                this.balance = data.balance;
                this.is_active = data.casino_active;
                // console.log(this.balance)
                resolve();
            });
        });
    }

    // getVendorList() {
    //     this.liveCasinoService.getVendorsRequests().subscribe((res: any) => {
    //         this.vendors = res;
    //         if (res[0]) this.getGameList(res[0]);
    //     });
    // }

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
            // console.log(this.vendors)
            // this.vendors = res;
            // this.vendors = res.filter((vendor:any) => vendor === "Evolution" || vendor === "Ezugi");
            // console.log(res.providers[0].code);
            // if(this.vendors[0]) this.getGameList(this.vendors[0]);
            // if(res.providers[0]) this.getGameList(res.providers[0].code);
        });
    }

    getGameList(provider: any) {
        this.gameurl = "";
        this.activeVendor = provider;

        this.isloading = true;
        this.liveCasinoService.getGamesByProviderRequests(provider).subscribe((res: any) => {
            // this.router.navigate(['/dashboard/home'])
            this.gameList = res.games;
            this.isloading = false;
        });
    }

    openCasino(provider: any) {
        this.router.navigate(['/dashboard/casino', provider]);
    }

    async getGameUrl(gameid: any) {
        this.isloading=true;
        this.isscreenloading=true;
        await this.getBalance();
        if(this.balance+this.exposure==0){
            this.toasterService.error('Low Balance');
            return;
        }
        this.provider = this.route.snapshot.paramMap.get('gameid');
        const selectedgame= this.selectedGame;
        // console.log(this.provider)

        const data ={
            gameId: gameid,
            provider: this.provider,
            userId: this.user_id,
            balance: this.balance,
            exposure: this.exposure
        }
        // console.log(data)
        
        this.liveCasinoService.getGamesUrlByidRequests(data).subscribe((res: any) => {
            if(res.status==0){                
                if(res.msg=="Invalid User"){
                this.activateAccount()
            }
            else{
                this.toasterService.error('Internal Error')
            }
        }
            
            this.gameurl = this.sanitizer.bypassSecurityTrustResourceUrl(res.launch_url);

            this.isloading=false;
            this.isscreenloading=false;
            this.router.navigate(['/casino-detail/', gameid, this.provider], { queryParams: { gameurl: res.launch_url } })
        });
    }

    openNewGameTab(gameid: any) {
  
        this.router.navigate(['/casino-detail/', gameid])
    }

    activateAccount() {
        this.liveCasinoService.activateAccountRequests().subscribe((res: any) => {
            alert('Account Activated');
            location.reload();
        });
    }

    setSelectedGame(gameName: string) {
        this.selectedGame = gameName;
      }

    getExposureDetails() {
        this.exposureService.getExposure().subscribe((data: any) => {
            this.exposure = data[0].exp_amount;
        }, (error) => {
          this.exposure = [];
        })
      }

}
