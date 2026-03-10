import { Component, OnInit } from '@angular/core';
import {BannerService} from "../services/banner.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {

  constructor(private bannerService:BannerService) { }
  bannerUrl:any = []

  ngOnInit(): void {
    this.bannerService.getFrontBanner().subscribe((res: any) => {
      const imageBaseUrl = environment.image_url;
      this.bannerUrl = res.map((obj: any) => {
        return {
          ...obj,
          path: imageBaseUrl + obj.path,
        };
      });
      //console.log(this.bannerUrl);
    });
  }

}
