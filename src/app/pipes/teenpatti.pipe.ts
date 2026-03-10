import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'teenpattitest'
})
export class TeenPattiTestnamePipe implements PipeTransform {
 players = [
    {sid: 0, name:'TIE'},
    {sid: 11, name: "T"},
    {sid: 21, name: "L"},
    {sid: 31, name: "D"}
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
