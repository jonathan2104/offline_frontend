import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable, Subject, tap} from "rxjs";
import {ExposureService} from "./exposure.service";
import {UserService} from "./user.service";
import {EncypteService} from "./encrypt-data.services";

@Injectable({
  providedIn: 'root'
})
export class BookmakerBetsService {
  private _RefreshBookmakerBets$ = new Subject<void>();

  constructor(private http: HttpClient, private exposureService: ExposureService, private userService: UserService, private encypteService: EncypteService) {
  }

  get refreshBookmakerBets() {
    return this._RefreshBookmakerBets$;
  }

  addBookmakerBet(matchbet_details: any): Observable<any> {
    const userId = localStorage.getItem('user_id');

    // Encrypt the data
    const encryptedPayload = {
      encryptedData: this.encypteService.encryptData(matchbet_details, userId)
    };
    return this.http.post<any>(environment.base_url + "/add-bookmakerbet", encryptedPayload).pipe(tap(() => {
      this._RefreshBookmakerBets$.next();
      this.exposureService.getExposureNext();
      this.exposureService.getExposureByRunnerNext();
      this.userService.getBalanceNext();
    }));
  }

  getBookmakerBets(event_id: any): Observable<any> {
    let user_id = localStorage.getItem("user_id")
    return this.http.get<any>(environment.base_url + "/allmatchbets-byevent/" + event_id + "/" + user_id);
  }

  getBookmakerUserBetsByEventId(event_id: any): Observable<any> {
    let user_id = localStorage.getItem("user_id")
    return this.http.get<any>(environment.base_url + "/bookmakerbets-byeventbyuser/" + event_id + "/" + user_id);
  }

  getCloseBetsForBookmaker(days:any): Observable<any> {
    let user_id = localStorage.getItem("user_id")
    return this.http.get<any>(environment.base_url + "/get-openbookmakerbets/" + user_id+ "/0/" + days);
  }

  getOpenBetsForBookmaker(): Observable<any> {
    let user_id = localStorage.getItem("user_id")
    return this.http.get<any>(environment.base_url + "/get-openbookmakerbets/" + user_id + '/1/180');
  }
}
