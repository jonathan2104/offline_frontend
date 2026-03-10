import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class Card32aService {
constructor(private http: HttpClient) { }
   getLiveData() {
    return this.http.get<any>(environment.base_url + "/get-card32a");
  }

  getResultHistory() {
    return this.http.get<any>(environment.base_url + "/get-card32a-result-history");
  }

  getLiveDataEu() {
    return this.http.get<any>(environment.base_url + "/get-card32b");
  }

  getResultHistoryEu() {
    return this.http.get<any>(environment.base_url + "/get-card32b-result-history");
  }
}
