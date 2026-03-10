import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {FormBuilder, Validators} from "@angular/forms";
import {environment} from "../../environments/environment";
import {TransactionService} from "../services/transaction.service";
import {UserService} from "../services/user.service";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-deposit-new',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.css']
})
export class DepositNewComponent implements OnInit {
    deposit_requests: any = []
    selectedFile: any = null;
    amount:Number = 0;
    selectedMode:any = "";
    deposit_whatsapp: string = '';
    accounts:any = {};
    currentAc:any = {};
    terms:boolean = false;
    user_id = localStorage.getItem('user_id');
    username = localStorage.getItem('username');
    clicked: boolean = false;
    depositForm: any;
    submitted = false;
    errorMsg: any;
    currentPage: number = 1;
    itemsPerPage = 10;
    entriesOptions = [10, 20, 50];

    selectedAccountType: string = '';
    candeposit:boolean=this.username!='demo';
    technical_whatsapp: string = '';

    constructor(private toastr: ToastrService,private transactionService: TransactionService, private fb: FormBuilder, private _location: Location, private userService: UserService) {
    }

    ngOnInit(): void {
       //this.getPopupDataRequests();
       this.getActiveAccounts();

       this.depositForm = this.fb.group({
            user_id: [this.user_id, Validators.required],
            method: ['', Validators.required],
            transaction_id: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(12), Validators.pattern(/^\d+$/)]],
            amount: ['', Validators.required],
            depo_proof: ['', Validators.required],
            username: [this.username, Validators.required],
        });

        this.getDepositRequests();
        this.transactionService.refreshDepositRequests.subscribe(() => {
            this.getDepositRequests();
        });
        this.transactionService.getPopupDataRequests().subscribe((res: any) => {
            this.technical_whatsapp = res[0].technical_whatsapp;
        });
    }

    getDepositRequests() {
        this.transactionService.getDepositRequests().subscribe((res: any) => {
            this.deposit_requests = res.sort((a: any, b: any) => {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });
        });
    }
    
    amountSubmit(value: string): void {
        this.amount = Number(value);
        this.depositForm.get('amount')?.setValue(this.amount);
    }
    
    getActiveAccounts(){
        this.transactionService.getActiveAccounts().subscribe((res: any) => {
            this.accounts = res;
            this.depositPage(this.getAcName(this.accounts[0].type),this.accounts[0]);
        });
    }

    onFileSelected(event: any) {
        this.selectedFile = event.target.files[0];
    }

    get depositFormControl() {
        return this.depositForm.controls;
    }

    addDepositRequest() {
        if (this.depositForm.invalid) {
            Object.keys(this.depositForm.controls).forEach(key => {
                const controlErrors = this.depositForm.get(key)?.errors;
                if (controlErrors) {
                    console.error(`Error in ${key}:`, controlErrors);
                }
            });
            return;
        } else {
            this.submitted = true;
            const formData = new FormData();

            // @ts-ignore
            formData.append('user_id', this.user_id.toString());
            formData.append('method', this.depositForm.value.method);
            formData.append('amount', this.depositForm.value.amount);
            formData.append('transaction_id', this.depositForm.value.transaction_id);
            // @ts-ignore
            formData.append('username', this.username);
            formData.append('file', this.selectedFile, this.selectedFile.name);
            const selectedAcData = {
                bank_name: this.currentAc.bank_name,
                name: this.currentAc.name,
                accountNo: this.currentAc.accountNo,
                ifscNo: this.currentAc.ifscNo
            };
    
            formData.append('account_id', this.currentAc.id);
            formData.append('account_data', JSON.stringify(selectedAcData));
            this.clicked = true;
            this.transactionService.addDepositRequest(formData).subscribe((res: any) => {
                if (res.error) {
                    this.errorMsg = res.error;
                    this.clicked = false;
                } else {
                    this.clicked = false;
                    this.resetForm();
                    this.toastr.success('Deposit Request Sent');
                }
            });
        }
    }

    depositPage(type: string,ac:any){
        this.selectedMode = type;
        this.currentAc = ac;
        this.depositForm.get('method')?.setValue(this.selectedMode);
        this.selectedAccountType = ac.accountNo;
    }
    techwhatsapp(){
        window.open("https://wa.me/91" + this.deposit_whatsapp, "_blank");
    }
    whatsapp(){
        this.transactionService.getMasterWhatsappByUser().subscribe((res: any) => {
            window.open("https://wa.me/" + res[0].deposit_whatsapp, "_blank");
        });
    }

    getPopupDataRequests() {
        this.transactionService.getPopupDataRequests().subscribe((res: any) => {
            this.deposit_whatsapp = res[0].deposit_whatsapp;
        });
        // this.transactionService.getMasterWhatsappByUser().subscribe((res: any) => {
        //     this.deposit_whatsapp = res[0].deposit_whatsapp;
        // });
    }

    resetForm() {
        this.depositForm.reset({
            transaction_id: '',
            depo_proof: null,
            amount: this.amount,
            user_id: this.user_id,
            username: this.username,
            method: this.selectedMode
          });
      
          this.terms = false;
          this.amount = 0;
          this.submitted = false;
    }

    backClicked() {
        this._location.back();
    }

    getAcName(type: string) {
        switch (type) {
            case "bank":
                return "ACCOUNT";
            break;
            case "upi":
                return "UPI";
            break;
            default: return "ACCOUNT"
        }
    }
    getAcImg(type: string) {
        switch (type) {
            case "bank":
                return "/assets/icons/bank-account.png";
            break;
            case "upi":
                return "/assets/icons/upi-icon.png";
            break;
            default: return "/assets/icons/upi-icon.png"
        }
    }

    onTermsChange(event: Event): void {
        this.terms = (event.target as HTMLInputElement).checked;
    }

    zeroAmount(){
        this.amount = 0;
    }

    backendImg(image_url: string){
        return environment.image_url + image_url;
    }

    copyMessage(val: any) {
        const selBox: any = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';

        // extract html
        const span = document.createElement('span');
        span.innerHTML = val;

        selBox.value = span.textContent || span.innerText;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }
    onEntriesChange() {
        this.currentPage = 1;
    }
    openWhatsapp() {
        window.open('https://wa.me/' + this.technical_whatsapp, '_blank');
    }
}
