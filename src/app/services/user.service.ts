import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError, Subject, tap} from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
  private _refreshBalance$ = new Subject<void>();

  get refreshBalance() {
    return this._refreshBalance$;
  }

  constructor(private http: HttpClient) {
  }

  createUser(user: any): Observable<any> {
    return this.http.post(environment.base_url + "/register", user, this.httpOptions).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  getUserBalance(user_id: any) {
    return this.http.get(environment.base_url + "/get-balance/" + user_id);
  }

  getBalanceNext() {
    console.log('resfresh')
    this._refreshBalance$.next();
  }

  getUserDetailsByUsername(username: any) {

    return this.http.get(environment.base_url + "/get-user-byusername/" + username);
  }

  updateLastActivity() {
    let user_id = localStorage.getItem('user_id');
    let user_details = {'user_id': user_id};
    return this.http.patch(environment.base_url + "/update-last-activty", user_details);
  }

  //deduct match fees only first time
  deductFees(event_id:any,name:any,type:any) {
    let user_id = localStorage.getItem('user_id')
    let user_details = {user_id: user_id,event_id:event_id,event_name:name,event_type:type};
    return this.http.post(environment.base_url + "/deduct-fees", user_details).pipe(tap(() => {
      this.getBalanceNext();
    }));
    ;
  }

  getFees(){
    return this.http.get(environment.base_url+"/get-fees");
  }

  getEventFeesDetails(event_id:any){
    let user_id = localStorage.getItem('user_id')
    return this.http.get(environment.base_url+"/get-event-fees/"+user_id+"/"+event_id);
  }


  changePassword(user_data: any) {
    return this.http.patch(environment.base_url + "/change-password", user_data);
  }

  transferFund(transfer_data: any) {
    return this.http.post(environment.base_url + "/fundtransfer", transfer_data);
  }

  getUserBonus(user_id: any) {
    return this.http.get(environment.base_url + "/get-bonus/" + user_id);
  }

  convertBonus( bonus_data: any) {
    // let user_id = localStorage.getItem('user_id');
    return this.http.patch(environment.base_url + "/convert-bonus",bonus_data);
  }
  transferAllLossBacksToBalance() {
    return this.http.get(environment.base_url + "/claim-lossback");
  }
  getNotifications() {
    return this.http.get(environment.base_url + "/get-notification");
  }

  getSelfDetails() {
    return this.http.get(environment.base_url + "/self-details");
  }
  getUserProfitLoss(user_id: any, searchData: { startdate?: string; enddate?: string}) {
    let url = environment.base_url + "/get-user-profitloss/"+ user_id;
    const queryParams = new URLSearchParams();

    if (searchData.startdate &&  searchData.enddate) {
      queryParams.append('startdate', searchData.startdate);
      queryParams.append('enddate', searchData.enddate);
    }

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    return this.http.get(url) ;
  }
  getUserMaster(user_id: any) {
    return this.http.get(environment.base_url + "/get-masterId/" + user_id);
  }
  getMyReferralusers() {
    return this.http.get(environment.base_url + "/get-my-referral-users");
  }
  getUsersReport(data?: any) {
    let params = new HttpParams();
    if (data) {
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          params = params.set(key, data[key]);
        }
      });
    }
    return this.http.get(environment.base_url + "/get-users-report", { params });
  }
  getUserLossBacksReport(data?: any) {
    let params = new HttpParams();
    if (data) {
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          params = params.set(key, data[key]);
        }
      });
    }
    return this.http.get(environment.base_url + "/get-users-lossback-report", { params });
  }
}
