import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser'
import {BabyLonCasinoService} from "../services/babyloncasino.services";
import {LiveCasinoService} from "../services/livecasino.service";
import {UserService} from "../services/user.service";
import {ExposureService} from "../services/exposure.service";

@Component({
    selector: 'app-livecasino',
    templateUrl: './casino.component.html',
    styleUrls: ['./casino.component.css'],
    providers: []
})
export class BabylonCasinoComponent implements OnInit {
    user_id = localStorage.getItem("user_id");
    username = localStorage.getItem("username");
    balance = 0;
    gameList: any = [];
    gameurl: any = "";
    activeVendor: string = "";
    isloading: boolean = true;
    is_active: boolean = true;
    clicked = false;
    selectedGame: string = "";
    exposure: any = [];
    slotcategories:any = [];
    slotGames:any = [];
    showSlots:boolean = false;

    constructor(private liveCasinoService: LiveCasinoService,private babyLonCasinoService:BabyLonCasinoService, private sanitizer: DomSanitizer, private userService: UserService, private router: Router, private exposureService: ExposureService) {
    }

    ngOnInit(): void {
        this.getGameList();
        this.getSlotcategories();
    }

    getGameList() {
        this.isloading=false;
        this.gameList = [{
            "game_name":"reward_games",
            "url_thumb":"/assets/casino/evo_vegass.webp",
            "game_id":"12112",
            "provider_name":"evolution"
        },{
            "game_name":"ezugi",
            "url_thumb":"/assets/casino/ezugi.png",
            "game_id":"12112",
            "provider_name":"ezugi"
        }];
    }

    openGametab(game: any,slots=false) {
        if(slots){
            this.router.navigate(['/casino-detail/slots/' + game.table_id]);
        }else{
            this.router.navigate(['/casino-detail/' + game.provider_name]);
        }
    }

    activateAccount() {
        this.liveCasinoService.activateAccountRequests().subscribe((res: any) => {
            alert('Account Activated');
            location.reload();
        });
    }

    getSlotcategories(){
        this.babyLonCasinoService.getSlotcategories().subscribe((res:any) => {
            this.slotcategories = this.mergeImageUrlsWithSlotCategories(res);
        });
    }
    openSlotsGames(provider:any){
        this.getSlotGames(provider);
    }
    getSlotGames(provider=null){
        this.babyLonCasinoService.getSlotGames(provider).subscribe((res:any) => {
            this.showSlots=true;
            this.slotGames = res;
        });
    }

    mergeImageUrlsWithSlotCategories(res:any) {
        const providerImageUrls:any = {
            "BTG": "/assets/casino/btg.jpeg",
            "NetEnt": "/assets/casino/NetEnt.jpeg",
            "NetEnt Extended": "/assets/casino/NetEnt-Extended.jpeg",
            "NLC": "/assets/casino/NLC.jpeg",
            "Red Tiger": "/assets/casino/Red-Tiger.png"
        };
        res.forEach((category:any) => {
            category.imageUrl = providerImageUrls[category.provider_name];
        });
        return res;
    }

    setSelectedGame(gameName: string) {
        this.selectedGame = gameName;
    }

}
