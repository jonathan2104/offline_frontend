import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  displayNav = false;
  constructor(private router:Router, private location:Location){
    if(this.location.path() != "/login"){
      this.displayNav = true;
    }

  }
  ngOnInit(): void {


  }

  title = 'BazeePlay';


}
