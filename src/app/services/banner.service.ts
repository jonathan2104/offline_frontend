import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
@Injectable({
  providedIn: 'root'
})
export class BannerService {

  constructor(private http: HttpClient) { }
  getBanner() {
    return this.http.get(environment.base_url + "/get-banner");
  }

   getFrontBanner() {
    return this.http.get(environment.base_url + "/get-frontbanner");
  }

}
