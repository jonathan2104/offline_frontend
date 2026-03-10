import {Component, OnInit, HostListener, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser'
import {BabyLonCasinoService} from "../services/babyloncasino.services";
import {LiveCasinoService} from "../services/livecasino.service";
import {Location} from '@angular/common';
import {UserService} from "../services/user.service";
import {environment} from "../../environments/environment";

@Component({
    selector: 'app-casino-details',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css']
})
export class BabylonCasinoDetailComponent implements OnInit {
    user_id = localStorage.getItem("user_id");
    username = localStorage.getItem("username");
    public gameid: any;
    public table_id: any;
    public provider: any;
    gameurl: SafeResourceUrl;
    is_active: boolean = true;
    balance = 0;
    clicked = false;
    public selectedGame: any;
    public loading: boolean = true;
    @ViewChild('gameIframe') gameIframe: ElementRef | undefined;

    constructor(private liveCasinoService: LiveCasinoService,private babyLonCasinoService:BabyLonCasinoService, private sanitizer: DomSanitizer, private route: ActivatedRoute, private _location: Location, private userService: UserService) {

    }

    ngOnInit(): void {
        this.userService.refreshBalance.subscribe(() => {
            this.getBalance();
        })
        this.getBalance();
        this.route.params.subscribe((param: any) => {
            this.provider = param['provider'];
            this.table_id = param['table_id'];
            this.loading = true;
            this.getGameUrl(this.provider);
        })
    }

    ngAfterViewInit() {
        if (this.gameIframe) {
          this.gameIframe.nativeElement.addEventListener('load', () => {
            this.loading = false;
          });
        }
    }

    getBalance() {
        this.userService.getUserBalance(this.user_id).subscribe((data: any) => {
            this.balance = data.casino_balance;
            this.is_active = data.casino_active;
        })
    }

    getGameUrl(provider:any) {
        const need_update = true;
        const data:any = {};
        data.provider = provider;
        if(this.table_id) data.table_id=this.table_id;
        if(need_update) data.update_status=true;

        this.babyLonCasinoService.getGamesUrlByBabyLon(data).subscribe((res: any) => {
            if(res.status == 'success') {
                const gameurl = res.gameurl;
                this.gameurl = this.sanitizer.bypassSecurityTrustResourceUrl(gameurl);
            }else{
                alert(res.message);
                this.backClicked();
            }
        })
    }

    activateAccount(){
        return ;
    }

    backClicked() {
        this._location.back();
    }
}
