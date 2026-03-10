import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser'
import {LiveCasinoService} from "../services/livecasino.service";
import {UserService} from "../services/user.service";
import {ExposureService} from "../services/exposure.service";
import {BannerService} from "../services/banner.service";
import {environment} from "../../environments/environment";
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-livecasino-igtech',
    templateUrl: './casino.component.html',
    styleUrls: ['./casino.component.css'],
    providers: []
})
export class LivecasinoIgtechComponent implements OnInit {
    user_id = localStorage.getItem("user_id");
    username = localStorage.getItem("username");
    balance = 0;
    vendors: any = [];
    allCategories: any = [];
    categories: any = [];
    gameList: any = [];
    filtered_gameList: any = [];
    gameurl: any = "";
    activeVendor: string = "";
    activeCategory: string = "";
    searchKeyword: string = "";
    isloading: boolean = true;
    is_active: boolean = true;
    clicked = false;
    selectedGame: string = "";
    exposure: any = [];
    currentPage: number = 1;
    totalPages: number = 1;
    private typingTimer: any;
    private doneTypingInterval: number = 500; 
    banner_url: any = [];
    dcasinoGamesOld: any = [
        {
            "casinoGameId": "teenpattioneday",
            "game_name": "Teen Patti One Day",
            "logo_square": "https://sitethemedata.com/casino_icons/lc/teen.jpg",
            "provider": "DC2"
        },
        {
            "casinoGameId": "teen-patti20",
            "game_name": "Teen Patti 20",
            "logo_square": "https://sitethemedata.com/casino_icons/lc/teen20.jpg",
            "provider": "DC2"
        },
        {
            "casinoGameId": "card32a",
            "game_name": "32 Cards A",
            "logo_square": "https://sitethemedata.com/casino_icons/lc/card32.jpg",
            "provider": "DC2"
        },
        {
            "casinoGameId": "card32b",
            "game_name": "32 Cards B",
            "logo_square": "https://sitethemedata.com/casino_icons/lc/card32eu.jpg",
            "provider": "DC2"
        },
        {
            "casinoGameId": "dragontigert20",
            "game_name": "Dragon Tiger T20",
            "logo_square": "https://sitethemedata.com/casino_icons/lc/dt20.jpg",
            "provider": "DC2"
        },
        {
            "casinoGameId": "dragontigerliont20",
            "game_name": "Dragon Tiger Lion T20",
            "logo_square": "https://sitethemedata.com/casino_icons/lc/dtl20.jpg",
            "provider": "DC2"
        },
        {
            "casinoGameId": "dragontigeroneday",
            "game_name": "Dragon Tiger One Day",
            "logo_square": "https://sitethemedata.com/casino_icons/lc/dt6.jpg",
            "provider": "DC2"
        },
        {
            "casinoGameId": "lucky7",
            "game_name": "Lucky 7",
            "logo_square": "https://sitethemedata.com/casino_icons/lc/lucky7.jpg",
            "provider": "DC2"
        },
        {
            "casinoGameId": "lucky7b",
            "game_name": "Lucky 7 B",
            "logo_square": "https://sitethemedata.com/casino_icons/lc/lucky7eu.jpg",
            "provider": "DC2"
        },
        {
            "casinoGameId": "andarbahar",
            "game_name": "Andar Bahar",
            "logo_square": "https://sitethemedata.com/casino_icons/lc/ab20.jpg",
            "provider": "DC2"
        }
    ];
    dcasinoGames: any = [];

    constructor(private bannerService: BannerService,private liveCasinoService: LiveCasinoService, private sanitizer: DomSanitizer, private userService: UserService, private router: Router, private exposureService: ExposureService,private route: ActivatedRoute) {
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


    }

    getVendorList() {
        // console.log('vendor');
        
        this.liveCasinoService.getProvidersRequestsIgtech().subscribe((res: any) => {
            // console.log(res);
            
        if (res.success) {
            this.vendors = Object.entries(res.categories).map(([providerCode, providerData]:any) => ({
                providerCode,providerName: providerData.provider_name
            }));
            this.vendors.unshift({ providerCode: "All", providerName: "All" });
            this.allCategories = res.categories;
            const allCategories = Object.values(res.categories).flatMap((providerData:any) => providerData.categories);
            this.categories = Array.from(new Set(allCategories));
            // console.log(this.vendors);
            
            this.onVendorChange("All");
        }
        //this.vendors.splice(1, 0, { providerCode: "DC2", providerName: "Domestic casino" });
        });
    }
    onVendorChange(selectedVendor: string, searchKeyword: any=null) {
        this.activeVendor = ""
        this.activeVendor = selectedVendor;
        this.searchKeyword = searchKeyword;
        if (selectedVendor === "All") {
            const allCategories = Object.values(this.allCategories).flatMap((providerData:any) => providerData.categories);
            this.categories = Array.from(new Set(allCategories));
        } else if(selectedVendor === "DC2") {
            this.categories = [];
        } else {
            this.categories = this.allCategories[selectedVendor].categories;
        }
        this.onSelectCategory("All");
        //this.onSelectCategory(this.categories[0]);
    }

    onSelectCategory(category:string) {
        this.activeCategory = category;
        // this.route.params.subscribe((params: any) => {
        //     if (params['provider'] == 'evolution') {
        //         this.activeVendor = 'EVZ';
        //     }
        // });
        if (this.activeCategory) this.getGameList(this.activeVendor,this.activeCategory, null, this.searchKeyword);
    }

    getGameList(provider: string,category:string, page:any=null, searchKeyword:any) {
        this.gameurl = "";
        this.activeVendor = provider;

        this.isloading = true;
        if(provider === "DC2" && category === "All") {
            this.gameList = this.dcasinoGames;
            this.filtered_gameList = this.dcasinoGames;
            this.isloading = false;
            this.totalPages = 1;
            return;
        }
        this.liveCasinoService.getGamesByCategoryRequestsIgtech(provider,category,page,searchKeyword).subscribe((res: any) => {
            this.gameList = res.games;
            this.filtered_gameList = this.gameList;
            this.isloading = false;
            this.totalPages = res.total_pages;
        });
    }
    

    changePage(page: number) {
        if (page > 0 && page <= this.totalPages) {
            this.currentPage = page;
            this.isloading = true;
            this.getGameList(this.activeVendor,this.activeCategory,this.currentPage, this.searchKeyword);
        }
    }
  
    getPaginationRange(): any[] {
        const pages = [];
        pages.push(1);
        if (this.currentPage > 3) {
          pages.push('...');
        }
        for (let i = Math.max(2, this.currentPage - 1); i <= Math.min(this.totalPages - 1, this.currentPage + 1); i++) {
          pages.push(i);
        }
        if (this.currentPage < this.totalPages - 2) {
          pages.push('...');
        }
        if (this.totalPages > 1) {
          pages.push(this.totalPages);
        }
        return pages;
    }

    capitalizeFirstLetter(val:string) {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

    onSearch(event: Event) {
        const input = event.target as HTMLInputElement;
        const value = input.value;
    
        clearTimeout(this.typingTimer);
    
        // Set a new timer
        this.typingTimer = setTimeout(() => {
          if (value.trim() !== '') {
            this.onVendorChange("All",value);
          } else {
            this.onVendorChange("All");
          }
        }, this.doneTypingInterval);
    }

    onSearch_local(event: Event) {
        const input = event.target as HTMLInputElement;
        const value = input.value;
    
        clearTimeout(this.typingTimer);
    
        // Set a new timer
        this.typingTimer = setTimeout(() => {
          if (value.trim() !== '') {
            this.filter_games(value);
          } else {
            this.activeCategory = "All";
            //this.activeCategory = this.categories[0];
            this.filtered_gameList = this.gameList;
          }
        }, this.doneTypingInterval);
    }

    filter_games(label: string) {
        this.activeCategory = 'search';
        const normalizedSearchTerm = label.toLowerCase().replace(/\s+/g, '');
        this.filtered_gameList = this.gameList.filter((game:any) => {
            const normalizedGameName = game.game_name.toLowerCase().replace(/\s+/g, '');
            return normalizedGameName.includes(normalizedSearchTerm);
        });
    }

    openCasino(provider: any) {
        this.router.navigate(['/dashboard/casino', provider]);
    }

    getGameUrl(gameid: any) {
        const selectedgame= this.selectedGame;

        const data ={
            gameId: gameid,
            provider: this.selectedGame,
            userId: this.user_id,
            balance: this.balance,
            exposure: this.exposure
        }
        // console.log(data)

        this.liveCasinoService.getGamesUrlByidRequests(data).subscribe((res: any) => {

            this.gameurl = this.sanitizer.bypassSecurityTrustResourceUrl(res.launch_url);
            this.router.navigate(['/casino-detail/', gameid, selectedgame])
        });
    }

    openNewGameTab(gameid: any, provider:any) {
        if(provider === 'DC2') {
            this.router.navigate(['/dashboard/'+gameid])
            return;
        }
        this.router.navigate(['/casino-detail-igtech/',gameid,provider])
    }

    openLobby() {
        const url = '/casino-detail-igtech/true/lobby';
        window.open(url, '_blank');
    }      

    activateAccount() {
        this.liveCasinoService.activateAccountRequests().subscribe((res: any) => {
            this.is_active=true;
            this.getVendorList();
            alert('Account Activated');
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

    onImageLoad(event: Event) {
        const img = event.target as HTMLImageElement;
        img.classList.add('loaded');
        const wrapper = img.parentElement;
        if (wrapper) wrapper.classList.add('loaded');
    }

    onImageError(event: any) {
        event.target.src = './assets/images/no_images.png';
    }

}
