import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders, HttpErrorResponse} from "@angular/common/http";
import {Observable,throwError, catchError, of, Subject, tap} from 'rxjs'
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private _RefreshDepositRequests$ = new Subject<void>();
  private _RefreshWithdrawRequests$ = new Subject<void>();
  private _RefreshWithdrawAccountsRequests$ = new Subject<void>();

  constructor(private http: HttpClient,private userService: UserService) {
  }

  get refreshDepositRequests() {
    return this._RefreshDepositRequests$;
  }
  get refreshWithdrawRequests() {
    return this._RefreshWithdrawRequests$;
  }
  get refreshWithdrawAccountsRequests() {
    return this._RefreshWithdrawAccountsRequests$;
  }

  addTransaction(transaction_details: any) {
    return this.http.post(environment.base_url + "/add-transaction", transaction_details);
  }

  getTransactionDetails(user_id: number) {
    return this.http.get(environment.base_url + "/get-transaction-details/" + user_id);
  }

  getWithdrawAccountRequests() {
    let user_id = localStorage.getItem('user_id');
    return this.http.get(environment.base_url + "/get-user-withdraw-account/" + user_id);
  }

  addUserWithdrawAccount(account: any) {
    return this.http.post(environment.base_url + "/add-withdraw-account", account).pipe(tap(() => {
      this._RefreshWithdrawAccountsRequests$.next();
    }));
  }
  changeWithdrawPassword(data: any): Observable<any> {
    return this.http.patch(environment.base_url + "/withdraw-password-change", data).pipe(
      tap(() => {
        this._RefreshWithdrawAccountsRequests$.next();
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  addDepositRequest(request_details: any) {
    return this.http.post(environment.base_url + "/add-deposit-request", request_details).pipe(tap(() => {
      this._RefreshDepositRequests$.next();
    }));
  }

  addCasinoDepositRequest(request_details: any) {
    return this.http.post(environment.base_url + "/add-casino-deposit-request", request_details).pipe(tap(() => {
      this._RefreshDepositRequests$.next();
    }));
  }

  getDepositRequests() {
    let user_id = localStorage.getItem('user_id');
    return this.http.get(environment.base_url + "/get-user-deposit-request/" + user_id).pipe(tap(() => {
      this.userService.getBalanceNext();
    }));
  }

  getCasinoDepositRequests() {
    let user_id = localStorage.getItem('user_id');
    return this.http.get(environment.base_url + "/get-casino-deposit-request/" + user_id);
  }

  addWithdrawRequest(request_details: any) {
    return this.http.post(environment.base_url + "/add-withdraw-request", request_details).pipe(tap(() => {
      this._RefreshWithdrawRequests$.next();
    }));
  }

  addCasinoWithdrawRequest(request_details: any) {
    return this.http.post(environment.base_url + "/add-casino-withdraw-request", request_details).pipe(tap(() => {
      this._RefreshWithdrawRequests$.next();
    }));
  }

  getWithdrawRequests() {
    let user_id = localStorage.getItem('user_id');
    return this.http.get(environment.base_url + "/get-user-withdraw-request/" + user_id);
  }

  getCasinoWithdrawRequests() {
    let user_id = localStorage.getItem('user_id');
    return this.http.get(environment.base_url + "/get-casino-withdraw-request/" + user_id);
  }

  getUPI() {
    return this.http.get(environment.base_url + "/get-upi");
  }

  getUPIByID() {
    const user_id = localStorage.getItem("user_id")
    return this.http.get(environment.base_url + "/get-upi-by-id/"+user_id);
  }

  getPopupDataRequests() {
    return this.http.get(environment.base_url + "/get-popup/");
  }

  getProof(withdraw_id: number){
    return this.http.get(environment.base_url + "/get-withdraw-proofs/"+ withdraw_id);
  }

  addPayInPayment(data:any){
    return this.http.post(environment.base_url+"/add-payment",data);
  }

  getMasterWhatsappByUser() {
    let user_id = localStorage.getItem('user_id');
    return this.http.get(environment.base_url + "/get-master-whatsapp-for-user/" + user_id);
  }
  getActiveAccounts(){
    return this.http.get(environment.base_url+"/active-bank-account-list");
  }
}
