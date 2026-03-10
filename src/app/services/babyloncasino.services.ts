import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BabyLonCasinoService {

  constructor(private http: HttpClient) {
  }

  getGamesUrlByBabyLon(data:any): Observable<any> {
    return this.http.post<any>(environment.base_url + "/casino-babylon-operatorLogin",data);
  }

  getAllGames(gameIds:any): Observable<any> {
    return this.http.post<any>(environment.base_url + "/get-games-list",gameIds);

  }

  getSlotcategories(): Observable<any> {
    return this.http.get<any>(environment.base_url + "/livecasino-slots-categories");
  }

  getSlotGames(provider:any=null): Observable<any> {
    let endpoint = "/livecasino-slotgames";
    if(provider) endpoint += "/"+provider;
    return this.http.get<any>(environment.base_url + endpoint);
  }

}
