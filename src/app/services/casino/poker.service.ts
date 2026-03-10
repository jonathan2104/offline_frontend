import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class PokerService {

  constructor(private http: HttpClient) {
  }

  getLiveData() {
    return this.http.get<any>(environment.base_url + "/get-poker20");
  }

  getResultHistory() {
    return this.http.get<any>(environment.base_url + "/get-poker20-result-history");
  }

  getLivePoker6Data() {
    return this.http.get<any>(environment.base_url + "/get-poker9");
  }

  getResultPoker6History() {
    return this.http.get<any>(environment.base_url + "/get-poker9-result-history");
  }

}
