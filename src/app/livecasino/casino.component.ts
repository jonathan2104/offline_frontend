import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { LiveCasinoService } from "../services/livecasino.service";

interface CasinoFilter {
  category: string;
  provider_name: string;
}

interface Game {
  game_id: string;
  game_name: string;
  provider_name: string;
  category: string;
  url_thumb: string;
}

@Component({
  selector: 'app-livecasino',
  templateUrl: './casino.component.html',
  styleUrls: ['./casino.component.css']
})
export class LivecasinoComponent implements OnInit {
  categories: string[] = [];
  providers: string[] = [];
  categoryProviderMap: { [key: string]: string[] } = {};
  selectedCategory: string = "";
  selectedProvider: string = "";
  lobbyData: any = [];
  gameList: Game[] = [];
  isLoading: boolean = false;
  loadingLobby: boolean = false;
  isLobby:boolean = false;
  activeCategory:any = "all";
  activeVendor:any = "all";
  currentPage: number = 1;
  totalPages: number = 1;
  current_game_id: string = '';
  gameFilter: string = '';
  newgameFilter: string = '';
  filteredgames: any = [];
  livecasino:boolean=false;
  constructor(private liveCasinoService: LiveCasinoService, private router: Router,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.fetchFilters();
    this.fetchCasinos();

    this.route.queryParams.subscribe(params => {
      const provider = params['provider'];
      const game = params['game'];
      if(game){
        this.activeVendor=provider
        this.newgameFilter=game
        this.fetchFilters();
        this.fetchCasinos(); 
      }
      if(provider && !game){
        this.activeVendor=provider
        this.fetchFilters();
        this.fetchCasinos(); 
      }
    });
  }

  fetchFilters() {
    this.liveCasinoService.getCasinoFilters().subscribe({
      next: (filters: CasinoFilter[]) => {
        // Use Sets for categories and providers to ensure uniqueness
        const uniqueCategories = new Set<string>();
        const uniqueProviders = new Set<string>();
        const categoryProviderMap: { [key: string]: Set<string> } = {};
  
        filters.forEach(filter => {
          // Add category to the categories set
          uniqueCategories.add(filter.category.toLowerCase());
          
          // Add provider to the providers set
          uniqueProviders.add(filter.provider_name);
  
          // Initialize provider map for category if it doesn't exist
          if (!categoryProviderMap[filter.category]) {
            categoryProviderMap[filter.category] = new Set<string>();
          }
  
          // Add provider name to the category's provider set
          categoryProviderMap[filter.category].add(filter.provider_name);
        });
  
        // Update the categories array with unique values
        this.categories = Array.from(uniqueCategories);
  
        // Update the providers array with unique values
        this.providers = Array.from(uniqueProviders).sort((a, b) => a.localeCompare(b));

        
  
        // Convert sets to arrays and update the categoryProviderMap
        for (const category in categoryProviderMap) {
          if (categoryProviderMap.hasOwnProperty(category)) {
            this.categoryProviderMap[category] = Array.from(categoryProviderMap[category]);
          }
        }
      },
      error: (err) => {
        console.error("Error fetching filters: ", err);
        // Additional error handling logic can go here
      }
    });
  }
  
  filterByCategory(category:any){
    this.activeCategory = category;
    this.fetchCasinos();
  }
  filterByProvider(provider:any){
    this.activeVendor = provider;
    this.fetchCasinos();
  }

  checkLobby(){
    this.fetchCasinos();
  }

  private fetchCasinos() {
    this.isLoading = true;
    const filterData = {lobby:this.isLobby,page:this.currentPage,provider:this.activeVendor, category:this.activeCategory};
    console.log(filterData);
    
    this.liveCasinoService.getProviderGamesRequests(filterData).subscribe({
      next: (res: any) => {
        this.gameList = res.games
          .filter((game: any) => game.is_active === 1)
          .sort((a: any, b: any) => (a.name?.localeCompare(b.name) || 0)) as Game[];
        this.totalPages = res.total_pages;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error fetching games: ", err);
        this.isLoading = false;
      }
    });
  }

  changePage(page: number) {
      if (page > 0 && page <= this.totalPages) {
          this.currentPage = page;
          this.isLoading = true;
          if(this.livecasino==false){
            this.fetchCasinos();
          }
          else{
            this.fetchLiveCasinos()
          }

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

  openGametab(game: any) {
    if(game.casinoGameId=='1'){
      this.current_game_id=game.game_id;
      this.openLobbytab(null);
      //this.openLobbyTable(game);
    }else{
      this.router.navigate(['/casino-detail/'+game.game_id]);
    }
  }
  openLobbytab(lobbydata=null) {
    this.router.navigate(['/casino-detail/lobby/'+this.current_game_id+'/'+lobbydata]);
  }

  private openLobbyTable(game: any) {
    this.loadingLobby = true;
    this.lobbyData = [];
    this.current_game_id=game.game_id;
    this.liveCasinoService.getLobbyData(this.current_game_id).subscribe({
      next: (res: any) => {
        if (res && res.res && res.res.lobby) {
          this.lobbyData = res.res.lobby;
        } else {
          this.lobbyData = [];
        }
        this.loadingLobby = false;
      },
      error: (err: any) => {
        this.loadingLobby = false;
        console.error("Error fetching lobby data for game:", this.current_game_id, err);
      }
    });
  }

  onFilterChange(){
    this.liveCasinoService.filteredgames(this.gameFilter).subscribe({
      next: (res: any) => {
        this.filteredgames=res
      },
      error: (err: any) => {
      }
    });
  }

   fetchLiveCasinos() {
    this.isLoading = true;
    this.livecasino = true;
    const filterData = {lobby:this.isLobby,page:this.currentPage,provider:'livecasino'};
    console.log(filterData);
    this.liveCasinoService.getProviderGamesRequests(filterData).subscribe({
      next: (res: any) => {
        this.gameList = res.games
          .filter((game: any) => game.is_active === 1)
          .sort((a: any, b: any) => this.customProviderSort(a, b)) as Game[];
        this.totalPages = res.total_pages;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error fetching games: ", err);
        this.isLoading = false;
      }
    });
  }


  private customProviderSort(a: Game, b: Game): number {
    const getPriority = (provider: string): number => {
      const name = provider.toLowerCase();
      if (name.includes('ezugi')) return 0; // First
      if (name.includes('xprogaming') || name.includes('pragmaticplaylive')) return 2; // Last
      return 1; // Middle
    };

    const priorityA = getPriority(a.provider_name);
    const priorityB = getPriority(b.provider_name);

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    return a.game_name.localeCompare(b.game_name);
  }

}
