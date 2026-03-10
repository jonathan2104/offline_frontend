import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class AaaService {

  constructor(private http: HttpClient) { }
  getLiveData() {
    return this.http.get<any>(environment.base_url + "/get-aaa");
  }

  getResultHistory() {
    return this.http.get<any>(environment.base_url + "/get-aaa-result-history");
  }
}
