import {Component, OnInit} from '@angular/core';
import {LedgerService} from "../services/ledger.service";
import {UserService} from "../services/user.service";
import {FormBuilder, Validators} from "@angular/forms";
import {Location} from '@angular/common';
import {ExposureService} from "../services/exposure.service";
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import {BetDetailComponent} from "../modals/bet-details/detail.component";
// import {CasinoBetDetailComponent} from "../modals/casino-bet-details/detail.component";
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.css'],
})
export class LedgerComponent implements OnInit {
  panelOpenState = false;
  user_balance: any;
  FilterForm:any;
  submitted = false;
  type_filter: string = 'all';
  currentPage: number = 1;
  itemsPerPage = 10;
  entriesOptions = [10, 20, 50];

  ledger_data: any = [];
  casino_ledger_data: any = [];
  updated_ledger_data: any = [];
  updated_casino_ledger_data: any = [];
  user_id = localStorage.getItem('user_id');
  exposure: any = [];
  isLoading = false;

  today: string = '';

  constructor(private fb: FormBuilder,private ledgerService: LedgerService, private userService: UserService, private _location: Location, private exposureService: ExposureService,private imageLightBoxService: NgbModal) {
  }

  ngOnInit(): void {
    const currentDate = new Date();
    const localDate = currentDate.getFullYear() +
      '-' + String(currentDate.getMonth() + 1).padStart(2, '0') +
      '-' + String(currentDate.getDate()).padStart(2, '0');

    this.FilterForm = this.fb.group({
      typefilter: [],
      from: [new Date().toISOString().substring(0, 10), Validators.required],
      to: [localDate, Validators.required],
    });
    
    const threeDaysBefore = new Date();
    threeDaysBefore.setDate(currentDate.getDate() - 3);
    this.FilterForm.get('from').setValue(threeDaysBefore.toISOString().substring(0, 10));
    this.getExposureDetails();
    this.today = localDate;
  }

  get filterFormControl() {
    return this.FilterForm.controls;
  }

  daysDiff(start:any,end:any) {
    let start_date = new Date(start);
    let end_date = new Date(end);
    const startUTC = Date.UTC(start_date.getFullYear(), start_date.getMonth(), start_date.getDate());
    const endUTC = Date.UTC(end_date.getFullYear(), end_date.getMonth(), end_date.getDate());

    const diffInMs = endUTC - startUTC;
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  }

  filter () {
    this.updated_casino_ledger_data=[];
    const days = this.daysDiff(this.FilterForm.value.from,this.FilterForm.value.to);
    const typefilter = this.FilterForm.value.typefilter;
    // if(typefilter=='casino' || typefilter=='all'){
    //   this.getCasinoLedgerDataByDays(days)
    //   }
        // this.getLedgerDataByDays(days);
        this.getLedgerDataByDates(this.FilterForm.value.from,this.FilterForm.value.to);
  }

  getLedgerDataByDays(days: any) {
    const typefilter = this.FilterForm.value.typefilter;

      this.ledgerService.getLedgerByDays(Number(days)).subscribe((res: any) => {
          this.ledger_data = res;
          let ledgerData: any = [];
          this.userService.getUserBalance(this.user_id).subscribe((res: any) => {
              this.user_balance = res;
              let new_limit = this.user_balance.balance;
              
              for (let i = 0; i < this.ledger_data.length; i++) {
                  const item = this.ledger_data[i];
                  // console.log(item.subtype)
                  // console.log(item.description)
                  if (
                      (typefilter === 'all') ||
                      (typefilter === 'sports' && item.type !== 'casino' && item.subtype !== 'deposit' && item.subtype !== 'withdraw') ||
                      (typefilter === 'casino' && item.type === 'casino') ||
                      (typefilter === 'deposit' && item.type !== 'casino' && (item.subtype === 'deposit' || item.subtype === 'withdraw'))
                  ) {
                      const old_limit = new_limit - item.profit_loss;
                      ledgerData.push({ ...item, old_limit: old_limit, new_limit: new_limit });
                      new_limit = old_limit;
                  }
              }
              this.updated_ledger_data = ledgerData;
          });
      });
  }

  getLedgerDataByDates(from: any,to:any) {
    this.isLoading = true;
    const typefilter = this.FilterForm.value.typefilter; // Get the value of the "typefilter" control
      this.ledgerService.getLedgerByDates(from,to,typefilter).subscribe(
        {
          next: (res: any) => {
          this.ledger_data = res;
          let ledgerData: any = [];
          let pts = 0; // Default value
          this.userService.getUserBalance(this.user_id).subscribe((res: any) => {
              this.user_balance = res;
              let new_limit = this.user_balance.balance;

              for (let i = 0; i < this.ledger_data.length; i++) {
                  const item = this.ledger_data[i];

                      const old_limit = new_limit - item.profit_loss;

                      pts = pts + item.profit_loss;

                      ledgerData.push({ ...item, old_limit: old_limit, new_limit: new_limit, pts: pts  });
                      new_limit = old_limit;
              }
              
              this.updated_ledger_data = ledgerData;
          });
          },
          error: (err:any) => {
            console.error(err); // Handle error
          },
          complete: () => {
            this.isLoading = false;
          }
        }
        
    );
      

  }

  backClicked(){
    this._location.back();
  }
  getCasinoLedgerDataByDays(days: any) {
    this.ledgerService.getCasinoLedgerByDays(Number(days)).subscribe((res: any) => {
      this.casino_ledger_data = res;
      let casinoData : any=[];
      this.userService.getUserBalance(this.user_id).subscribe((res: any) => {
        this.user_balance = res;
        let new_limit = this.user_balance.balance+this.exposure;
        for (let i = 0; i <this.casino_ledger_data.length ; i++) {
          const items = this.casino_ledger_data[i];
          const old_limit = new_limit - this.casino_ledger_data[i].profit_loss;
          casinoData.push({...items, old_limit: old_limit,new_limit:new_limit});
          new_limit = old_limit;
        }
      });
      this.updated_casino_ledger_data=casinoData
      // casinoData = this.casino_ledger_data
    })
  }

  exportToPDF(){
    return;
    // const doc = new jsPDF();

    // // Prepare the data for the table
    // const columns = ['Type', 'Sub-Type', 'Date', 'Amount', 'Remark'];
    // const rows = this.updated_ledger_data.map((item:any) => [
    //     item.type,
    //     item.subtype,
    //     item.created_at,
    //     item.profit_loss,
    //     item.event_name,
    // ]);

    // // Add the autoTable with columns and rows
    // autoTable(doc, {
    //     head: [columns],
    //     body: rows,
    //     theme: 'grid',
    //     styles: { fontSize: 10, cellPadding: 3 },
    //     headStyles: { fillColor: [0, 57, 107] }, // Dark blue header background
    //     margin: { top: 10 },
    // });

    // // Save the generated PDF
    // doc.save('statement_data.pdf');
  }

  getExposureDetails() {
    this.exposureService.getExposure().subscribe((data: any) => {
        this.exposure = data[0].exp_amount;
    }, (error) => {
      this.exposure = [];
    })
  }

  openbetDetails(data:any){
    return;
    // const {event_id, subtype, runner_name, event_name} = data;
    // if(event_id){
    //   if(data.type=='casino'){
    //     const config: NgbModalOptions = {
    //       backdrop: 'static',
    //       size: 'xl',
    //       // fullscreen: 'xl'
    //     };
    //     const modalRef = this.imageLightBoxService.open(CasinoBetDetailComponent,config);
    //     modalRef.componentInstance.betdata = data;
    //   }else{
    //     const config: NgbModalOptions = {
    //       backdrop: 'static',
    //       size: 'xl',
    //       // fullscreen: 'xl'
    //     };
    //     const modalRef = this.imageLightBoxService.open(BetDetailComponent,config);
    //     modalRef.componentInstance.event_id = event_id;
    //     modalRef.componentInstance.subtype = subtype;
    //     modalRef.componentInstance.runner_name = runner_name;
    //     modalRef.componentInstance.winner = data.session_result;
        
    //   }
    //   return true;
    // }else{
    //   return false;
    // }
  }
  onEntriesChange() {
    this.currentPage = 1;
  }
}
