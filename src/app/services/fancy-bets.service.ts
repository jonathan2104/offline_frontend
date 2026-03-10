import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable, Subject, tap} from "rxjs";
import {ExposureService} from "./exposure.service";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class FancyBetsService {
  private _RefreshFancyBets$ = new Subject<void>();

  constructor(private http: HttpClient, private exposureService: ExposureService, private userService: UserService) {
  }

  get refreshFancyBets() {
    return this._RefreshFancyBets$;
  }

  addFancyBet(fancybet_details: any): Observable<any> {
    return this.http.post<any>(environment.base_url + "/add-fancybet", fancybet_details).pipe(tap(() => {
      this._RefreshFancyBets$.next();
      this.exposureService.getExposureNext();
      this.exposureService.getFancyExposureByRunnerNext();
      this.userService.getBalanceNext();
    }));
  }

  getFancyBets(event_id: any): Observable<any> {
    let user_id = localStorage.getItem("user_id")
    return this.http.get<any>(environment.base_url + "/fancybets-byevent/" + event_id + "/" + user_id);
  }

  getUserFancyBetsByEventId(event_id: any): Observable<any> {
    let user_id = localStorage.getItem("user_id")
    return this.http.get<any>(environment.base_url + "/get-fancybet-byeventid-foruser/" + event_id + "/" + user_id);
  }

  getFancyBetsByRunnerEvent(event_id:any,runner_name:any){
    let user_id = localStorage.getItem("user_id");
    return this.http.get<any>(environment.base_url + "/get-fancy-byrunner-event/" +user_id+"/"+event_id+"/"+runner_name);
  }

  getCloseBetsforFancy(days:any): Observable<any> {
    let user_id = localStorage.getItem("user_id");
    return this.http.get<any>(environment.base_url + "/get-openfancybets/" + user_id+ "/0/" + days);
  }

  getOpenBetsforFancy(): Observable<any> {
    let user_id = localStorage.getItem("user_id");
    return this.http.get<any>(environment.base_url + "/get-openfancybets/" + user_id + '/1/180');
  }
}
