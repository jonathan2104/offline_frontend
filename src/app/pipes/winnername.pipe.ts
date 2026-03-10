import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'winnername'
})
export class WinnernamePipe implements PipeTransform {

  transform(win: any, gamename: string): string {
    let winner_name = '';
    switch(gamename){
      case 'teen20':
      case 'Teen':
        switch(win){
          case '1':
            winner_name = 'Player A'
            break;
          case '3':
          case '2':
            winner_name = 'Player B'
            break;
        }
        break;
      case 'teen9':
        switch(win){
          case '11':
            winner_name = 'Tiger'
            break;
          case '21':
            winner_name = 'Lion'
            break;
          case '31':
            winner_name = 'Dragon'
            break;
        }
        break;
      case 'dt6':
      case 'dt20':
      case 'dt202':
        switch(win){
          case '1':
            winner_name = 'Dragon'
            break;
          case '2':
            winner_name = 'Tiger'
            break;
          default:
            winner_name = 'Tie'
            break;
        }
        break;
        case 'dtl20':
          switch(win){
            case '1':
              winner_name = 'Dragon'
              break;
            case '21':
              winner_name = 'Tiger'
              break;
            case '41':
              winner_name = 'Lion'
              break;
          }
          break;
        case 'poker20':
        case 'poker':
          switch(win){
            case '11':
              winner_name = 'Player A'
              break;
            case '21':
              winner_name = 'Player B'
              break;
            default:
              winner_name = 'Tie'
              break;
          }
          break;
        case 'poker9':
          switch(win){
            case '11':
              winner_name = 'Player 1'
              break;
            case '12':
              winner_name = 'Player 2'
              break;
            case '13':
              winner_name = 'Player 3'
              break;
            case '14':
              winner_name = 'Player 4'
              break;
            case '15':
              winner_name = 'Player 5'
              break;
            case '16':
              winner_name = 'Player 6'
              break;
            default:
              winner_name = 'Tie'
              break;
          }
          break;
        case 'aaa':
          switch(win){
            case '1':
              winner_name = 'Amar'
              break;
            case '2':
              winner_name = 'Akbar'
              break;
            case '3':
              winner_name = 'Anthony'
              break;
            default:
              winner_name = 'Tie'
              break;
          }
          break;
        case 'abj':
          switch(win){
            case '1':
              winner_name = 'Andar'
              break;
            case '2':
              winner_name = 'Bahar'
              break;
            default:
              winner_name = 'Tie'
              break;
          }
          break;
          case 'card32':
            case 'card32eu':
            switch(win){
              case '1':
                winner_name = 'Player8'
                break;
              case '2':
                winner_name = 'Player9'
                break;
              case '3':
                winner_name = 'Player10'
                break;
              case '4':
                winner_name = 'Player11'
                break;
              default:
                winner_name = 'Tie'
                break;
            }
            break;
        
          case 'baccarat':
          case 'baccarat2':
            switch(win){
              case '1':
                winner_name = 'Player'
                break;
              case '2':
              case '4':
                winner_name = 'Banker'
                break;
              case '3':
                winner_name = 'Tie'
                break;
            }
            break;
        case 'lucky7':
        case 'lucky7eu':
          switch(win){
            case '1':
              winner_name = 'Low Card'
              break;
            case '2':
              winner_name = 'High Card'
              break;
            default:
              winner_name = 'Tie'
              break;
          }
          break;
    }
    return winner_name;

  }

}
