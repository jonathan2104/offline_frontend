import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'card32name'
})
export class Card32namePipe implements PipeTransform {

  players = [
    {sid: 1, name:'8'},
    {sid: 2, name: "9"},
    {sid: 3, name: "10"},
    {sid: 4, name: "11"}
  ]
 transform(value: unknown, ...args: unknown[]): unknown {
    let r = this.players.filter((player: any) => {
      if (player.sid == value) {
        return player.name
      }
    })
    return r[0].name;
  }


}
