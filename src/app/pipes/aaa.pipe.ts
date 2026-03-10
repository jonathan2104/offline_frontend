import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'aaa'
})
export class AaaPipe implements PipeTransform {

  players = [
    {sid: 1, name:'A'},
    {sid: 2, name: "B"},
    {sid: 3, name: "C"},
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
