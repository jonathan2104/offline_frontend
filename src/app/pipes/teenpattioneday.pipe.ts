import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'teenpattioneday'
})
export class TeenPattiOneDayPipe implements PipeTransform {
 players = [
    {sid: 0, name:'TIE'},
    {sid: 1, name: "A"},
    {sid: 2, name: "B"}
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
