import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class TeenPattiService {

  constructor(private http: HttpClient) {
  }

  getLiveData() {
    return this.http.get<any>(environment.base_url + "/get-teenpatti20");
  }

  getResultHistory() {
    return this.http.get<any>(environment.base_url + "/get-teenpatti20-result-history");
  }

  getLiveDataTest() {
    return this.http.get<any>(environment.base_url + "/get-teenpattitest");
  }

  getResultHistoryTest() {
    return this.http.get<any>(environment.base_url + "/get-teenpattitest-result-history");
  }

  getLiveDataOneDay() {
    return this.http.get<any>(environment.base_url + "/get-teenpattioneday");
  }

  getResultHistoryOneDay() {
    return this.http.get<any>(environment.base_url + "/get-teenpattioneday-result-history");
  }

  getLiveDataOpen() {
    return this.http.get<any>(environment.base_url + "/get-teenpatti8open");
  }

  getResultHistoryOpen() {
    return this.http.get<any>(environment.base_url + "/get-teenpatti8open-result-history");
  }

}
