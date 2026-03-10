import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class SetButtonService {

    constructor(private http: HttpClient) {
    }

    getButtonValueList() {
        let user_id = localStorage.getItem("user_id");
        return this.http.get(environment.base_url + "/getprice-buttons/" + user_id);
    }

    setButtonValueData(button_data: any) {
        let user_id = localStorage.getItem("user_id");
        return this.http.post(environment.base_url + "/updateprice-buttons/"+user_id, button_data);
    }
}
