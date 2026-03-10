import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'playername'
})
export class PlayernamePipe implements PipeTransform {
  players = [
    {sid: 0, name:'-'},
    {sid: 1, name: "A"},
    {sid: 2, name: "P+A"},
    {sid: 3, name: "B"},
    {sid: 4, name: "P+B"},
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
