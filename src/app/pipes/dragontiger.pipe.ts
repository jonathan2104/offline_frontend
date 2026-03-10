import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dragontiger'
})
export class DragonTigerPipe implements PipeTransform {

  players = [
    {sid: 1, name:'D'},
    {sid: 2, name: "T"},
    {sid: 3, name: "T"},
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
