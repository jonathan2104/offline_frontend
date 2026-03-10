import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {SetButtonService} from "../services/setbuttonvalues.services";
import {BetSlipService} from "../services/betslip.service";
import {CasinoBetsService} from "../services/casino/casino-bets.service";


@Component({
    selector: 'app-casino-bet-slip-plain',
    templateUrl: '../casino-bet-slip/casino-bet-slip.component.html',
    styleUrls: ['../casino-bet-slip/casino-bet-slip.component.css']
})
export class CasinoBetSlip2Component implements OnInit {
    showTimerOverlay: boolean = false;
    timerActive: boolean = false;
    count: number =0;
    public buttonData: any = [];
    finalLoss: number;
    finalProfit: number;
    price: number;
    size: any;
    submitted_disabled = false;
    existing_casinoBets: any = [];
    exp_amount1: number = 0;
    exp_amount2: number = 0;
    exp_amount3: number = 0;
    exp_amount4: number = 0;
    exp_amount5: number = 0;
    exp_amount6: number = 0;
    exp_amount7: number = 0;
    exp_amount8: number = 0;
    exp_amount9: number = 0;
    exp_amount10: number = 0;
    exp_amount11: number = 0;
    exp_amount12: number = 0;
    exp_amount13: number = 0;
    exp_amount14: number = 0;
    exp_amount15: number = 0;
    exp_amount16: number = 0;
    exp_amount17: number = 0;
    exp_amount18: number = 0;
    exp_amount19: number = 0;
    @Input() data!: any;

    constructor(private toastr: ToastrService, private setButtonService: SetButtonService, private casinobetService: CasinoBetsService, private betSlipService: BetSlipService,) {
    }

    ngOnInit(): void {
        // this.dialogRef.updateSize('100%',);
        console.log('this data 2-->', this.data);
        this.price = this.data.bet.rate;
        this.getButtondata();
    }

    getButtondata() {
        this.setButtonService.getButtonValueList().subscribe((res: any) => {
          this.buttonData = res.map((item: any) => ({
            button_id: item.button_id,
            type: item.type,
            price_label: item.price_label || '',
            price_value: item.price_value || ''
          }));
          this.buttonData=this.buttonData.filter((item:any)=>item.type==='c');
          this.buttonData = this.convertToGroupsOfFour(this.buttonData);
        });
      }

    // getButtondata() {
    //     this.buttonData = [{price_label: 25, price_value: 25}, {price_label: 50, price_value: 50}, {
    //         price_label: 100,
    //         price_value: 100
    //     }, {price_label: 200, price_value: 200}, {price_label: 500, price_value: 500}, {
    //         price_label: 1000,
    //         price_value: 1000
    //     },];
    //     this.buttonData = this.convertToGroupsOfFour(this.buttonData);
    //     // this.setButtonService.getButtonValueList().subscribe((res: any) => {
    //     //     this.buttonData = res.map((item: any) => ({
    //     //         button_id: item.button_id,
    //     //         price_label: item.price_label || '',
    //     //         price_value: item.price_value || ''
    //     //     }));
    //     //     this.buttonData = this.convertToGroupsOfFour(this.buttonData);
    //     // });
    // }

    private convertToGroupsOfFour(buttons: any): any[] {
        const groups: any[] = [];
        for (let i = 0; i < buttons.length; i += 3) {
            groups.push(buttons.slice(i, i + 3));
        }
        return groups;
    }


    incre(value?: number) {
        if (!value) {
            this.count = this.count + 1000;
        } else {
            this.count = Number(value);
        }
        this.calculate();
    }

    calculate() {
        switch (this.data.m_type) {
            case 'teen20':
                this.casinobetService.getCasinoBetsByMarketId(this.data.bet.mid, this.data.m_type).subscribe((res: any) => {
                    this.existing_casinoBets = res;
                    if (this.existing_casinoBets.length == 0) {
                        this.calculateTeen20();
                    } else {
                        console.log(this.existing_casinoBets[0].sid);
                        this.calculateTeen20ByIndex(this.data.bet.sid);
                    }
                });
                break;
            case 'lucky7eu':
            case 'lucky7':
                console.log('lucky 7 calcu');
                this.casinobetService.getCasinoBetsByMarketId(this.data.bet.mid, this.data.m_type).subscribe((res: any) => {
                    this.existing_casinoBets = res;
                    this.calculateLucky7();

                });
                break;
            case 'teen9':
                console.log('teen9');
                this.casinobetService.getCasinoBetsByMarketId(this.data.bet.mid, this.data.m_type).subscribe((res: any) => {
                    this.existing_casinoBets = res;
                    this.calculateTeen9();

                });
                break;
            case 'teen':
                console.log('teen');
                this.casinobetService.getCasinoBetsByMarketId(this.data.bet.mid, this.data.m_type).subscribe((res: any) => {
                    this.existing_casinoBets = res;
                    this.calculateTeenOneDay();
                });
                break;
            case 'card32':
                console.log('card32');
                this.casinobetService.getCasinoBetsByMarketId(this.data.bet.mid, this.data.m_type).subscribe((res: any) => {
                    this.existing_casinoBets = res;
                    this.calculateCard32();
                });
                break;
            case 'card32eufancy':
            case 'card32eufancy1':
            case 'card32eu':
                console.log(this.data.m_type);
                this.casinobetService.getCasinoBetsByMarketId(this.data.bet.mid, this.data.m_type).subscribe((res: any) => {
                    this.existing_casinoBets = res;
                    this.calculateCard32eu();
                });
                break;
            case 'ab20':
                console.log('ab20');
                this.casinobetService.getCasinoBetsByMarketId(this.data.bet.mid, this.data.m_type).subscribe((res: any) => {
                    this.existing_casinoBets = res;
                    this.calculateTeenOneDay();
                });
                break;
            case 'abj':
                console.log('abj');
                this.casinobetService.getCasinoBetsByMarketId(this.data.bet.mid, this.data.m_type).subscribe((res: any) => {
                    this.existing_casinoBets = res;
                    this.calculateTeenOneDay();
                });
                break;
            case 'dt202':
            case 'dt6':
            case 'dt20':
            case 'dt6fancy':
                console.log('dt20');
                this.casinobetService.getCasinoBetsByMarketId(this.data.bet.mid, this.data.m_type).subscribe((res: any) => {
                    this.existing_casinoBets = res;
                    this.calculateTeenOneDay();
                });
                break;
            case 'poker20':
                console.log('poker20');
                this.casinobetService.getCasinoBetsByMarketId(this.data.bet.mid, this.data.m_type).subscribe((res: any) => {
                    this.existing_casinoBets = res;
                    this.calculateLucky7();
                });
                break;
            case 'poker9':
                console.log('poker9');
                this.casinobetService.getCasinoBetsByMarketId(this.data.bet.mid, this.data.m_type).subscribe((res: any) => {
                        this.existing_casinoBets = res;
                        this.calculateLucky7();
                    });
                    break;
            case 'poker':
            case 'pokerfancy':
                console.log('poker pokerfancy');
                this.casinobetService.getCasinoBetsByMarketId(this.data.bet.mid, this.data.m_type).subscribe((res: any) => {
                    this.existing_casinoBets = res;
                    this.calculateLucky7();
                });
                break;
                case 'baccarat':
                    console.log('baccarat');
                    this.casinobetService.getCasinoBetsByMarketId(this.data.bet.mid, this.data.m_type).subscribe((res: any) => {
                        this.existing_casinoBets = res;
                        this.calculateLucky7();
                    });
                    break;
                case 'baccarat2':
                    console.log('baccarat2');
                    this.casinobetService.getCasinoBetsByMarketId(this.data.bet.mid, this.data.m_type).subscribe((res: any) => {
                        this.existing_casinoBets = res;
                        this.calculateLucky7();
                    });
                    break;
            default:
                break;
        }
    }

    submit() {
        this.submitted_disabled = true;
        let runnername = '';
        console.log('runner name', this.data.bet.sid, typeof this.data.bet.sid)
        switch (this.data.m_type) {
            case 'teen20':
                switch (this.data.bet.sid) {
                    case '1':
                        runnername = 'Player A';
                        break;
                    case '3':
                        runnername = 'Player B';
                        break;
                    case '2':
                        runnername = 'Pair plus A';
                        break;
                    case '4':
                        runnername = 'Pair plus B';
                        break;
                    default:
                        break;
                }
                let casino_bet: any = {
                    user_id: this.data.user_id,
                    game_name: this.data.m_type,
                    g_type: 'casino',
                    bet_amount: this.count,
                    type: this.data.type,
                    m_id: this.data.mid,
                    s_id: this.data.bet.sid,
                    game_id: 4,
                    runner_name: runnername,
                    odds: this.data.bet.rate,
                    loss_amount: this.finalLoss,
                    win_amount: this.finalProfit,
                    exp_amount1: this.exp_amount1.toFixed(2),
                    exp_amount2: this.exp_amount2.toFixed(2),
                }
                this.casinobetService.addCasinoBet(casino_bet).subscribe((res: any) => {
                    if (res.error) {
                        this.toastr.error(res.error);
                    } else {
                        this.toastr.success(res.message);
                        this.betSlipService.callParentClearFunction();
                    }
                    // this.dialogRef.close(false);
                });
                break;
            case 'teen':
                runnername = this.data.bet.nat;
                let teen1day_bet: any = {
                    user_id: this.data.user_id,
                    game_name: this.data.m_type,
                    g_type: 'teen',
                    bet_amount: this.count,
                    type: this.data.type,
                    m_id: this.data.mid,
                    s_id: this.data.bet.sid,
                    game_id: 10,
                    runner_name: runnername,
                    odds: this.data.bet.rate,
                    loss_amount: this.finalLoss,
                    win_amount: this.finalProfit,
                    index: this.data.bet.index,
                    exp_amount1: this.exp_amount1.toFixed(2),
                    exp_amount2: this.exp_amount2.toFixed(2),
                }
                this.casinobetService.addTeenpattiOneDayCasinoBet(teen1day_bet).subscribe((res: any) => {
                    if (res.error) {
                        this.toastr.error(res.error);
                    } else {
                        this.toastr.success(res.message);
                        this.betSlipService.callParentClearFunction();
                    }
                    // this.dialogRef.close(false);
                });
                break;
            case 'teen9':
                console.log('in teen 9');
                let teentest_runnername = this.data.bet.nat.toLowerCase();
                let teen9_bet: any = {
                    user_id: this.data.user_id,
                    game_name: this.data.m_type,
                    g_type: 'casino',
                    bet_amount: this.count,
                    type: this.data.type,
                    m_id: this.data.mid,
                    s_id: this.data.bet.sid,
                    game_id: 7,
                    runner_name: teentest_runnername,
                    odds: this.data.bet.rate,
                    loss_amount: this.finalLoss,
                    win_amount: this.finalProfit,
                    exp_amount1: this.exp_amount1,
                    exp_amount2: this.exp_amount2,
                    exp_amount3: this.exp_amount3,
                    exp_amount4: this.exp_amount4,
                    exp_amount5: this.exp_amount5,
                    exp_amount6: this.exp_amount6,
                    exp_amount7: this.exp_amount7,
                    exp_amount8: this.exp_amount8,
                    exp_amount9: this.exp_amount9,
                    exp_amount10: this.exp_amount10,
                    exp_amount11: this.exp_amount11,
                    exp_amount12: this.exp_amount12,
                    exp_amount13: this.exp_amount13,
                    exp_amount14: this.exp_amount14,
                    exp_amount15: this.exp_amount15,
                    exp_amount16: this.exp_amount16,
                    exp_amount17: this.exp_amount17,
                    exp_amount18: this.exp_amount18,
                    exp_amount19: this.exp_amount19,
                }
                console.log('bet details--->', teen9_bet);
                this.casinobetService.addCasinoBet(teen9_bet).subscribe((res: any) => {
                    if (res.error) {
                        this.toastr.error(res.error);
                    } else {
                        this.toastr.success(res.message);
                        this.betSlipService.callParentClearFunction();
                    }
                });
                break;
            case 'teen8':
                let teen8_runnername = this.data.bet.nat;
                console.log('teen8_runnername',teen8_runnername)
                let teen8_bet: any = {
                    user_id: this.data.user_id,
                    game_name: this.data.m_type,
                    g_type: 'casino',
                    bet_amount: this.count,
                    type: this.data.type,
                    m_id: this.data.mid,
                    s_id: this.data.bet.sid,
                    game_id: 10,
                    runner_name: teen8_runnername,
                    odds: this.data.bet.rate,
                    loss_amount: this.finalLoss,
                    win_amount: this.finalProfit,
                    index: this.data.bet.index,
                    exp_amount1: this.exp_amount1.toFixed(2),
                    exp_amount2: this.exp_amount2.toFixed(2),
                }
                this.casinobetService.addCasinoBet(teen8_bet).subscribe((res: any) => {
                    if (res.error) {
                        this.toastr.error(res.error);
                    } else {
                        this.toastr.success(res.message);
                        this.betSlipService.callParentClearFunction();
                    }
                });
                break;
            case 'lucky7eu':
            case 'lucky7':
                console.log('lucky 7 submit');
                let temp_runner_name = this.data.bet.nat.toLowerCase();
                temp_runner_name = temp_runner_name.split(' ').map((word: any) => word[0].toUpperCase() + word.substring(1)).join(' ');

                let lucky7_bet: any = {
                    user_id: this.data.user_id,
                    game_name: this.data.m_type,
                    g_type: 'casino',
                    bet_amount: this.count,
                    type: this.data.type,
                    m_id: this.data.mid,
                    s_id: this.data.bet.sid,
                    game_id: 7,
                    runner_name: temp_runner_name,
                    odds: this.data.bet.rate,
                    loss_amount: this.finalLoss,
                    win_amount: this.finalProfit,
                    exp_amount1: this.exp_amount1,
                    exp_amount2: this.exp_amount2,
                    exp_amount3: this.exp_amount3,
                    exp_amount4: this.exp_amount4,
                    exp_amount5: this.exp_amount5,
                    exp_amount6: this.exp_amount6,
                    exp_amount7: this.exp_amount7,
                    exp_amount8: this.exp_amount8,
                    exp_amount9: this.exp_amount9,
                    exp_amount10: this.exp_amount10,
                    exp_amount11: this.exp_amount11,
                    exp_amount12: this.exp_amount12,
                    exp_amount13: this.exp_amount13,
                    exp_amount14: this.exp_amount14,
                    exp_amount15: this.exp_amount15,
                    exp_amount16: this.exp_amount16,
                    exp_amount17: this.exp_amount17,
                    exp_amount18: this.exp_amount18,
                    exp_amount19: this.exp_amount19,
                }
                console.log('bet details', lucky7_bet);
                this.casinobetService.addCasinoBet(lucky7_bet).subscribe((res: any) => {
                    if (res.error) {
                        this.toastr.error(res.error);
                    } else {
                        this.toastr.success(res.message);
                        this.betSlipService.callParentClearFunction();
                    }
                    // this.dialogRef.close();
                    console.log('closed');
                });
                break;
            case 'card32':
                runnername = this.data.bet.nat;
                let card32_bet: any = {
                    user_id: this.data.user_id,
                    game_name: this.data.m_type,
                    g_type: 'casino',
                    bet_amount: this.count,
                    type: this.data.type,
                    m_id: this.data.mid,
                    s_id: this.data.bet.sid,
                    game_id: 10,
                    runner_name: runnername,
                    odds: this.data.bet.rate,
                    loss_amount: this.finalLoss,
                    win_amount: this.finalProfit,
                    index: this.data.bet.index,
                    exp_amount1: this.exp_amount1,
                    exp_amount2: this.exp_amount2,
                    exp_amount3: this.exp_amount3,
                    exp_amount4: this.exp_amount4
                }
                console.log('BET-->', card32_bet);
                this.casinobetService.addTeenpattiOneDayCasinoBet(card32_bet).subscribe((res: any) => {
                    if (res.error) {
                        this.toastr.error(res.error);
                    } else {
                        this.toastr.success(res.message);
                        this.betSlipService.callParentClearFunction();
                    }
                    // this.dialogRef.close();
                });
                break;
            case 'card32eu':
            case 'card32eufancy':
            case 'card32eufancy1':
                let card32eu_bet: any = {
                    user_id: this.data.user_id,
                    game_name: this.data.m_type,
                    g_type: 'casino',
                    bet_amount: this.count,
                    type: this.data.type,
                    m_id: this.data.mid,
                    s_id: this.data.bet.sid,
                    game_id: 10,
                    runner_name: runnername,
                    odds: this.data.bet.rate,
                    loss_amount: this.finalLoss,
                    win_amount: this.finalProfit,
                    index: this.data.bet.index,
                    exp_amount1: this.exp_amount1,
                    exp_amount2: this.exp_amount2,
                    exp_amount3: this.exp_amount3,
                    exp_amount4: this.exp_amount4
                }
                console.log('BET-->', card32eu_bet);
                this.casinobetService.addCard32BCasinoBet(card32eu_bet).subscribe((res: any) => {
                    if (res.error) {
                        this.toastr.error(res.error);
                    } else {
                        this.toastr.success(res.message);
                        this.betSlipService.callParentClearFunction();
                    }
                });
                break;
            case 'ab20':
                runnername = this.data.bet.nat;
                let ab20_bet: any = {
                    user_id: this.data.user_id,
                    game_name: this.data.m_type,
                    g_type: 'casino',
                    bet_amount: this.count,
                    type: this.data.type,
                    m_id: this.data.mid,
                    s_id: this.data.bet.sid,
                    game_id: 10,
                    runner_name: runnername,
                    odds: this.data.bet.rate,
                    loss_amount: this.finalLoss,
                    win_amount: this.finalProfit,
                    index: this.data.bet.index,
                    exp_amount1: this.exp_amount1.toFixed(2),
                    exp_amount2: this.exp_amount2.toFixed(2),
                }
                this.casinobetService.addCasinoBet(ab20_bet).subscribe((res: any) => {
                    if (res.error) {
                        this.toastr.error(res.error);
                    } else {
                        this.toastr.success(res.message);
                        this.betSlipService.callParentClearFunction();
                    }
                    // this.dialogRef.close(false);
                });
                break;
            case 'abj':
                runnername = this.data.bet.nat;
                switch (this.data.bet.sid) {
                    case 2:
                    case 3:
                        runnername = this.data.bet.nat + "A";
                        break;
                    case 5:
                    case 6:
                        runnername = this.data.bet.nat + "B";
                        break;
                }
                let abj_bet: any = {
                    user_id: this.data.user_id,
                    game_name: this.data.m_type,
                    g_type: 'casino',
                    bet_amount: this.count,
                    type: this.data.type,
                    m_id: this.data.mid,
                    s_id: this.data.bet.sid,
                    game_id: 10,
                    runner_name: runnername,
                    odds: this.data.bet.rate,
                    loss_amount: this.finalLoss,
                    win_amount: this.finalProfit,
                    index: this.data.bet.index,
                    exp_amount1: this.exp_amount1.toFixed(2),
                    exp_amount2: this.exp_amount2.toFixed(2),
                }
                this.casinobetService.addABJCasinoBet(abj_bet).subscribe((res: any) => {
                    if (res.error) {
                        this.toastr.error(res.error);
                    } else {
                        this.toastr.success(res.message);
                        this.betSlipService.callParentClearFunction();
                    }
                });
                break;
            case 'dt20':
                let dt20_runner_name = this.data.bet.nat;
                console.log(dt20_runner_name);
                switch (this.data.bet.sid) {
                    case '4':
                        console.log('in');
                        dt20_runner_name = "Is Pair";
                        break;
                    default:
                        dt20_runner_name = this.data.bet.nat;
                }
                console.log(dt20_runner_name);

                let dt20_bet: any = {
                    user_id: this.data.user_id,
                    game_name: this.data.m_type,
                    g_type: 'casino',
                    bet_amount: this.count,
                    type: this.data.type,
                    m_id: this.data.mid,
                    s_id: this.data.bet.sid,
                    game_id: 10,
                    runner_name: dt20_runner_name,
                    odds: this.data.bet.rate,
                    loss_amount: this.finalLoss,
                    win_amount: this.finalProfit,
                    index: this.data.bet.index,
                }
                console.log('BET-->', dt20_bet);
                this.casinobetService.addCasinoBet(dt20_bet).subscribe((res: any) => {
                    if (res.error) {
                        this.toastr.error(res.error);
                    } else {
                        this.toastr.success(res.message);
                        this.betSlipService.callParentClearFunction();
                    }
                    // this.dialogRef.close();
                });
                break;
            case 'dt202':
                
                let dt202_runner_name = this.data.bet.nat;
                console.log(dt202_runner_name);
                switch (this.data.bet.sid) {
                    case '4':
                        console.log('in');
                        dt202_runner_name = "Is Pair";
                        break;
                    default:
                        dt202_runner_name = this.data.bet.nat;
                }
                console.log(dt202_runner_name);

                let dt202_bet: any = {
                    user_id: this.data.user_id,
                    game_name: this.data.m_type,
                    g_type: 'casino',
                    bet_amount: this.count,
                    type: this.data.type,
                    m_id: this.data.mid,
                    s_id: this.data.bet.sid,
                    game_id: 10,
                    runner_name: dt202_runner_name,
                    odds: this.data.bet.rate,
                    loss_amount: this.finalLoss,
                    win_amount: this.finalProfit,
                    index: this.data.bet.index,
                }
                console.log('BET-->', dt202_bet);
                this.casinobetService.addCasinoBet(dt202_bet).subscribe((res: any) => {
                    console.log('res---->', res);
                    if (res.error) {
                        this.toastr.error(res.error);
                    } else {
                        this.toastr.success(res.message);
                        this.betSlipService.callParentClearFunction();
                    }
                    // this.dialogRef.close();
                });
                break;
            case 'dt6':
            case 'dt6fancy':
                let dt6_runner_name = this.data.bet.nat;
                console.log(dt6_runner_name);
                switch (this.data.bet.sid) {
                    case '3':
                        console.log('in');
                        dt6_runner_name = "Is Pair";
                        break;
                    default:
                        dt6_runner_name = this.data.bet.nat;
                }
                console.log(dt6_runner_name);

                let dt6_bet: any = {
                    user_id: this.data.user_id,
                    game_name: this.data.m_type,
                    g_type: 'casino',
                    bet_amount: this.count,
                    type: this.data.type,
                    m_id: this.data.mid,
                    s_id: this.data.bet.sid,
                    game_id: 10,
                    runner_name: dt6_runner_name,
                    odds: this.data.bet.rate,
                    loss_amount: this.finalLoss,
                    win_amount: this.finalProfit,
                    index: this.data.bet.index,
                }
                console.log('BET-->', dt6_bet);
                this.casinobetService.addDTOneDayCasinoBet(dt6_bet).subscribe((res: any) => {
                    if (res.error) {
                        this.toastr.error(res.error);
                    } else {
                        this.toastr.success(res.message);
                        this.betSlipService.callParentClearFunction();
                    }
                    // this.dialogRef.close();
                });
                break;
            case 'dtl20':
                runnername = this.data.bet.nat;
                let dtl20_bet: any = {
                    user_id: this.data.user_id,
                    game_name: this.data.m_type,
                    g_type: 'casino',
                    bet_amount: this.count,
                    type: this.data.type,
                    m_id: this.data.mid,
                    s_id: this.data.bet.sid,
                    game_id: 10,
                    runner_name: runnername,
                    odds: this.data.bet.rate,
                    loss_amount: this.finalLoss,
                    win_amount: this.finalProfit,
                    index: this.data.bet.index,
                    exp_amount1: this.exp_amount1.toFixed(2),
                    exp_amount2: this.exp_amount2.toFixed(2),
                }
                this.casinobetService.addCasinoBet(dtl20_bet).subscribe((res: any) => {
                    if (res.error) {
                        this.toastr.error(res.error);
                    } else {
                        this.toastr.success(res.message);
                        this.betSlipService.callParentClearFunction();
                    }
                });
                break;
            case 'aaa':
            case 'aaafancy':
                let aaa_runnername = this.data.bet.nat;
                let aaa_bet: any = {
                    user_id: this.data.user_id,
                    game_name: this.data.m_type,
                    g_type: 'casino',
                    bet_amount: this.count,
                    type: this.data.type,
                    m_id: this.data.mid,
                    s_id: this.data.bet.sid,
                    game_id: 10,
                    runner_name: aaa_runnername,
                    odds: this.data.bet.rate,
                    loss_amount: this.finalLoss,
                    win_amount: this.finalProfit,
                    index: this.data.bet.index,
                    exp_amount1: this.exp_amount1,
                    exp_amount2: this.exp_amount2,
                    exp_amount3: this.exp_amount3,
                    exp_amount4: this.exp_amount4
                }
                console.log('BET-->', aaa_bet);
                this.casinobetService.addAAACasinoBet(aaa_bet).subscribe((res: any) => {
                    if (res.error) {
                        this.toastr.error(res.error);
                    } else {
                        this.toastr.success(res.message);
                        this.betSlipService.callParentClearFunction();
                    }
                });
                break;
            case 'poker20':
                runnername = this.data.bet.nat;
                let poker20_bet: any = {
                    user_id: this.data.user_id,
                    game_name: this.data.m_type,
                    g_type: 'casino',
                    bet_amount: this.count,
                    type: this.data.type,
                    m_id: this.data.mid,
                    s_id: this.data.bet.sid,
                    game_id: 10,
                    runner_name: runnername,
                    odds: this.data.bet.rate,
                    loss_amount: this.finalLoss,
                    win_amount: this.finalProfit,
                    index: this.data.bet.index,
                    exp_amount1: this.exp_amount1.toFixed(2),
                    exp_amount2: this.exp_amount2.toFixed(2),
                }
                this.casinobetService.addCasinoBet(poker20_bet).subscribe((res: any) => {
                    if (res.error) {
                        this.toastr.error(res.error);
                    } else {
                        this.toastr.success(res.message);
                    }
                    console.log('closed');
                });
                break;
                case 'poker9':
                    runnername = this.data.bet.nat;
                    let poker9_bet: any = {
                        user_id: this.data.user_id,
                        game_name: this.data.m_type,
                        g_type: 'casino',
                        bet_amount: this.count,
                        type: this.data.type,
                        m_id: this.data.mid,
                        s_id: this.data.bet.sid,
                        game_id: 10,
                        runner_name: runnername,
                        odds: this.data.bet.rate,
                        loss_amount: this.finalLoss,
                        win_amount: this.finalProfit,
                        index: this.data.bet.index,
                        exp_amount1: this.exp_amount1.toFixed(2),
                        exp_amount2: this.exp_amount2.toFixed(2),
                    }
                    this.casinobetService.addCasinoBet(poker9_bet).subscribe((res: any) => {
                        if (res.error) {
                            this.toastr.error(res.error);
                        } else {
                            this.toastr.success(res.message);
                        }
                        console.log('closed');
                    });
                    break;
            case 'poker':
            case 'pokerfancy':
                let poker_runnername = this.data.bet.nat;
                let poker_bet: any = {
                    user_id: this.data.user_id,
                    game_name: this.data.m_type,
                    g_type: 'casino',
                    bet_amount: this.count,
                    type: this.data.type,
                    m_id: this.data.mid,
                    s_id: this.data.bet.sid,
                    game_id: 10,
                    runner_name: poker_runnername,
                    odds: this.data.bet.rate,
                    loss_amount: this.finalLoss,
                    win_amount: this.finalProfit,
                    index: this.data.bet.index,
                    exp_amount1: this.exp_amount1,
                    exp_amount2: this.exp_amount2,
                    exp_amount3: this.exp_amount3,
                    exp_amount4: this.exp_amount4
                }
                console.log('BET-->', poker_bet);
                this.casinobetService.addPokerOneDayCasinoBet(poker_bet).subscribe((res: any) => {
                    if (res.error) {
                        this.toastr.error(res.error);
                    } else {
                        this.toastr.success(res.message);
                    }
                });
                break;
                case 'baccarat':
                    runnername = this.data.bet.nat;
                    let baccarat_bet: any = {
                        user_id: this.data.user_id,
                        game_name: this.data.m_type,
                        g_type: 'casino',
                        bet_amount: this.count,
                        type: this.data.type,
                        m_id: this.data.mid,
                        s_id: this.data.bet.sid,
                        game_id: 10,
                        runner_name: runnername,
                        odds: this.data.bet.rate,
                        loss_amount: this.finalLoss,
                        win_amount: this.finalProfit,
                        index: this.data.bet.index,
                        exp_amount1: this.exp_amount1.toFixed(2),
                        exp_amount2: this.exp_amount2.toFixed(2),
                    }
                    this.casinobetService.addCasinoBet(baccarat_bet).subscribe((res: any) => {
                        if (res.error) {
                            this.toastr.error(res.error);
                        } else {
                            this.toastr.success(res.message);
                        }
                        console.log('closed');
                    });
                    break;
                case 'baccarat2':
                    runnername = this.data.bet.nat;
                    let baccarat2_bet: any = {
                        user_id: this.data.user_id,
                        game_name: this.data.m_type,
                        g_type: 'casino',
                        bet_amount: this.count,
                        type: this.data.type,
                        m_id: this.data.mid,
                        s_id: this.data.bet.sid,
                        game_id: 10,
                        runner_name: runnername,
                        odds: this.data.bet.rate,
                        loss_amount: this.finalLoss,
                        win_amount: this.finalProfit,
                        index: this.data.bet.index,
                        exp_amount1: this.exp_amount1.toFixed(2),
                        exp_amount2: this.exp_amount2.toFixed(2),
                    }
                    this.casinobetService.addCasinoBet(baccarat2_bet).subscribe((res: any) => {
                        if (res.error) {
                            this.toastr.error(res.error);
                        } else {
                            this.toastr.success(res.message);
                        }
                        console.log('closed');
                    });
                    break;
            default:
                // this.dialogRef.close();
                break;
        }
    }

    openTimerOverlay() {
        //const deplay = 4000;
        const deplay = 0;
        this.showTimerOverlay = true;
        this.timerActive = true;

        setTimeout(() => {
            // Code to execute when the timer completes
            console.log('Submit data...');
            this.timerActive = false;
            this.showTimerOverlay = false;
            this.submit();
        }, deplay);
    }

    closeDialog() {
        //this.dialogRef.close();
    }

    dismiss() {
        // this.dialogRef.close();
    }

    calculateTeen20() {
        console.log('sid-->', this.data.bet.sid);
        console.log('price-->', this.price);
        console.log('count-->', this.count);
        switch (this.data.bet.sid) {
            case '1':
                this.finalProfit = (+(this.price * this.count).toFixed(2)) - this.count;
                this.finalLoss = 0 - this.count;
                this.exp_amount1 = this.finalProfit;
                this.exp_amount2 = this.finalLoss;
                break;
            case '3':
                this.finalProfit = (+(this.price * this.count).toFixed(2)) - this.count;
                this.finalLoss = 0 - this.count;
                this.exp_amount1 = this.finalLoss;
                this.exp_amount2 = this.finalProfit;
                break;
            case '2':
                this.finalProfit = (+(this.price * this.count).toFixed(2)) - this.count;
                this.finalLoss = 0 - this.count;
                this.exp_amount3 = this.finalProfit;
                this.exp_amount4 = this.finalLoss;
                break;
            case '4':
                this.finalProfit = (+(this.price * this.count).toFixed(2)) - this.count;
                this.finalLoss = 0 - this.count;
                this.exp_amount3 = this.finalLoss;
                this.exp_amount4 = this.finalProfit;
                break;
        }
        console.log('exp1', this.exp_amount1)
        console.log('exp2', this.exp_amount2)
        console.log('finalLoss', this.finalLoss)
        console.log('finalProfit', this.finalProfit)
    }

    calculateTeen20ByIndex(index: any) {
        console.log(typeof (index));
        switch (index) {
            case '1':
                this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
                this.finalLoss = 0 - this.count;
                this.exp_amount1 = this.existing_casinoBets[0].exp_amount1 + this.finalProfit;
                this.exp_amount2 = this.existing_casinoBets[0].exp_amount2 + this.finalLoss;
                break;
            case '3':
                this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
                this.finalLoss = 0 - this.count;
                this.exp_amount1 = this.existing_casinoBets[0].exp_amount1 + this.finalLoss;
                this.exp_amount2 = this.existing_casinoBets[0].exp_amount2 + this.finalProfit;
                break;
            case '2':
                this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
                this.finalLoss = 0 - this.count;
                this.exp_amount3 = this.existing_casinoBets[0].exp_amount3 + this.finalProfit;
                this.exp_amount4 = this.existing_casinoBets[0].exp_amount4 + this.finalLoss;
                break;
            case '4':
                this.finalProfit = +(this.price * this.count).toFixed(2) - this.count;
                this.finalLoss = 0 - this.count;
                this.exp_amount3 = this.existing_casinoBets[0].exp_amount3 + this.finalLoss;
                this.exp_amount4 = this.existing_casinoBets[0].exp_amount4 + this.finalProfit;
                break;
        }
        console.log(this.exp_amount1);
        console.log(this.exp_amount2);
        console.log(this.exp_amount3);
        console.log(this.exp_amount4);
    }

    calculateLucky7() {

        console.log('sid-->', this.data.bet.sid);
        console.log('price-->', this.price);
        console.log('count-->', this.count);
        this.finalProfit = (+(this.price * this.count).toFixed(2)) - this.count;
        this.finalLoss = 0 - this.count;

    }

    calculateTeen9() {
        console.log('sid-->', this.data.bet.sid);
        console.log('price-->', this.price);
        console.log('count-->', this.count);
        this.finalProfit = (+(this.price * this.count).toFixed(2)) - this.count;
        this.finalLoss = 0 - this.count;
    }

    calculateTeenOneDay() {
        console.log('sid-->', this.data.bet.sid);
        console.log('price-->', this.price);
        console.log('count-->', this.count);
        this.finalProfit = (+(this.price * this.count).toFixed(2)) - this.count;
        this.finalLoss = 0 - this.count;
    }

    calculateCard32() {
        console.log('sid-->', this.data.bet.sid);
        console.log('price-->', this.price);
        console.log('count-->', this.count);
        this.finalProfit = (+(this.price * this.count).toFixed(2)) - this.count;
        this.finalLoss = 0 - this.count;
    }

    calculateCard32eu() {
        console.log('sid-->', this.data.bet.sid);
        console.log('price-->', this.price);
        console.log('count-->', this.count);
        this.finalProfit = (+(this.price * this.count).toFixed(2)) - this.count;
        this.finalLoss = 0 - this.count;
    }
}
