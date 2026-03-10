import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiproCasinoService {

  constructor(private http: HttpClient) {
  }

  getGamesUrlByApipro(data:any): Observable<any> {
    return this.http.post<any>(environment.base_url + "/casino-operatorLogin",data);
  }

  getAllGames(gameIds:any): Observable<any> {
    return this.http.post<any>(environment.base_url + "/get-games-list",gameIds);

  }

  getAllGamesByPage(page: number): Observable<any> {
    return this.http.get<any>(`${environment.base_url}/casino/get-games-list?page=${page}`);
  }

  getGamesUrl(gameid: string): Observable<any> {
    return this.http.get<any>(`${environment.base_url}/casino/game-init/${gameid}`);
  }

}
