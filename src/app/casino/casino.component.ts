import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-casino',
  templateUrl: './casino.component.html',
  styleUrls: ['./casino.component.css']
})
export class CasinoComponent implements OnInit {

  game:any = 'all'
  constructor() { }

  ngOnInit(): void {
  }

  setGame(game:any){
    this.game = game;
    console.log(this.game);
  }

}
