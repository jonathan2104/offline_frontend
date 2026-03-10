import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class Lucky7Service {

  constructor(private http: HttpClient) { }
  getLiveData() {
    return this.http.get<any>(environment.base_url + "/get-lucky7");
  }
  getLiveDataEu() {
    return this.http.get<any>(environment.base_url + "/get-lucky7eu");
  }

  getResultHistory() {
    return this.http.get<any>(environment.base_url + "/get-lucky7-result-history");
  }
  getResultHistoryEu() {
    return this.http.get<any>(environment.base_url + "/get-lucky7eu-result-history");
  }
}
