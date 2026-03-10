import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {of,Observable} from "rxjs";
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LiveCasinoService {

  constructor(private http: HttpClient) {
  }

  getVendorsRequests(): Observable<any> {
    //let user_id = localStorage.getItem("user_id")
    return this.http.get<any>(environment.base_url + "/casino/vendorlist");
  }
  getCasinoFilters(): Observable<any> {
    //let user_id = localStorage.getItem("user_id")
    return this.http.get<any>(environment.base_url + "/casinos/filters");
  }

  getGamesByProviderRequests(provider:any): Observable<any> {
    return this.http.get<any>(environment.base_url + "/casino/gamelist/"+provider);
  }

  getProviderGamesRequests(searchData: { lobby?:boolean, page?: number; provider?: string; category?: string;} = {}) {
    let url = environment.base_url + "/casinos/gameslist";
    const queryParams = new URLSearchParams();
    if (searchData.page) {
      queryParams.append('page', String(searchData.page));
    }
    if(searchData.lobby){
      queryParams.append('lobby', "true");
    }else{
      if (searchData.category && searchData.category!='all') {
        queryParams.append('category', searchData.category);
      }
      if (searchData.provider && searchData.provider!='all') {
        queryParams.append('provider', searchData.provider);
      }
    }
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    return this.http.get<any[]>(url);
  }

  getLobbyData(game_id:any): Observable<any> {
    return this.http.get<any>(environment.base_url + "/casino/lobby-data/"+game_id);
  }
  getGamesUrlByidRequests(data:any): Observable<any> {
    return this.http.post<any>(environment.base_url + "/casino/gameUrl/",data);
  }

  activateAccountRequests(): Observable<any> {
    return this.http.get<any>(environment.base_url + "/casino/account-activation");
  }

  convertCasinoBalance(user_id:any): Observable<any> {
    return this.http.post<any>(environment.base_url + "/casino/convert-balance/",user_id);
  }

  ledgerEntryCasino(user_id:any): Observable<any> {
    return this.http.get<any>(environment.base_url + "/casino/make-ledger/"+user_id);
  }
    
  filteredgames(gamename:any): Observable<any> {
    return this.http.get<any>(environment.base_url + "/get-filtered-game/" + gamename);
  }
  getGameList(): Observable<any> {
    return this.http.get<any>(environment.base_url + "/get-casino-games" );
  }

  getProvidersRequestsIgtech(): Observable<any> {
    return this.http.get<any>(environment.base_url + "/casino/igtech/providers");
  }
  getGamesByCategoryRequestsIgtech(provider: string, category: string, page: any, searchKeyword: any): Observable<any> {
    let queryParams = [];
    if (page) {
        queryParams.push(`page=${page}`);
    }
    if (searchKeyword) {
        queryParams.push(`search=${encodeURIComponent(searchKeyword)}`);
    }
    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
    return this.http.get<any>(`${environment.base_url}/casino/igtech/gamelist/${provider}/${category}${queryString}`);
  }

  getGamesUrlByidRequestsIgtech(data: any): Observable<any> {
    let openLobby = '';
    if (data.openLobby) {
      openLobby += "/true";
    }

    const url = `${environment.base_url}/casino/igtech/gameUrl/${data.gameId}/${data.provider}${openLobby}`;

    return this.http.get<any>(url).pipe(
      catchError((error) => {
        return of({
          success: false,
          message: error?.error?.message || "Failed to fetch game URL",
          status: error.status || 500
        });
      })
    );
  }

  
  getHomepageGames(): Observable<any> {
    return this.http.get<any>(environment.base_url + "/casino/get-homepage-games" );
  }

  getUserCasinoResults(days:any):Observable<any>{
    let user_id = localStorage.getItem("user_id");
    return this.http.get<any>(environment.base_url + "/casino/get-results/" +user_id+ "/" + days);
  }

}
