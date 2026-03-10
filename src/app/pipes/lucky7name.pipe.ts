import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lucky7name'
})
export class Lucky7namePipe implements PipeTransform {
 players = [
    {sid: 0, name:'TIE'},
    {sid: 1, name: "L"},
    {sid: 2, name: "H"}
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
