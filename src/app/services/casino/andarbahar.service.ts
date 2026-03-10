import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class AndarBaharService {

  constructor(private http: HttpClient) { }
  getLiveData() {
    return this.http.get<any>(environment.base_url + "/get-ab20");
  }

  getResultHistory() {
    return this.http.get<any>(environment.base_url + "/get-ab20-result-history");
  }

  getLiveDataAbj() {
    return this.http.get<any>(environment.base_url + "/get-abj");
  }

  getResultHistoryAbj() {
    return this.http.get<any>(environment.base_url + "/get-abj-result-history");
  }
}
