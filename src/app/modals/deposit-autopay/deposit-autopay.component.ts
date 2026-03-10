import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {environment} from "../../../environments/environment";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TransactionService} from "../../services/transaction.service";
import {ToastrService} from "ngx-toastr";
import {PaymentCheckService} from "../../services/payment-check.service";
import {Router} from "@angular/router";
import {Subscription} from 'rxjs';
@Component({
  selector: 'app-deposit-autopay',
  templateUrl: './deposit-autopay.component.html',
  styleUrls: ['./deposit-autopay.component.css']
})
export class DepositAutopayComponent implements OnInit {
depositForm: any;
    selectedFile: any = null;
    errorMsg: any;
    submitted = false;
    gpay: any = "";
    paytm: any = "";
    phonepe: any = "";
    bank: any = "";
    qrcode: any = "";
    currentPayment: any = "";
    methodval: any = "other";

    is_gpayActive: boolean = false;
    is_paytmActive: boolean = false;
    is_phonepeActive: boolean = false;
    is_qrActive: boolean = false;
    is_otherActive: boolean = false;
    vpa: any = '';
    final_amount: any;
    user_id = localStorage.getItem('user_id')
    txn_id: any = '';

    username = localStorage.getItem('username');
    showUpiTextbox: boolean = true;
    selected_radio: any = "other";

    clicked: boolean = false;
    isLoading: boolean = false;
    showPayMethods: boolean = false;
    paymentDone: boolean = false;
    paymentMsg: string = '';
    googlePayLink: string = '';
    paytmPayLink: string = '';
    phonepePayLink: string = '';
    genericUpiLink: string = '';

    private pollingDataSubscription: Subscription;


    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private toastr: ToastrService, private router: Router, public dialogRef: MatDialogRef<any>, private fb: FormBuilder, private transactionService: TransactionService, private paymentcheckService: PaymentCheckService) {
    }

    ngOnInit(): void {

        this.depositForm = this.fb.group({
            // user_id: [this.user_id, Validators.required],
            // method: ['', Validators.required],
            // transaction_id: ['', Validators.required],
            amount: ['', Validators.required],
            // depo_proof: ['', Validators.required],
            // username: [this.username, Validators.required],
        });
        this.transactionService.getUPI().subscribe((res: any) => {

            const imageBaseUrl = environment.image_url;
            if (res != null) {
                if (res.gpay) {
                    // this.is_gpayActive = true;
                    this.gpay = res.gpay;
                }

                if (res.paytm) {
                    // this.is_paytmActive = true;
                    this.paytm = res.paytm;
                }

                if (res.phonepe) {
                    // this.is_phonepeActive = true;
                    this.phonepe = res.phonepe;
                }
                if (res.qrcode != '/no_file.png') {
                    // this.is_qrActive = true;
                    this.qrcode = imageBaseUrl + res.qrcode
                }

                if (res.account_id) {
                    // this.is_otherActive = true;
                    this.bank = `${res.account_id},<br> ${res.account_holder_name}, <br> ${res.ifsc_code}, <br> ${res.bank_name}, <br> ${res.branch},  `;
                }


                // this.currentPayment = res.gpay ? res.gpay : "not found";
                let method = "bank";
                switch (method) {
                    case "bank":
                        this.is_otherActive = true;
                        this.currentPayment = this.bank;
                        this.selected_radio = "other";
                        break;
                    case "qrcode":
                        this.is_qrActive = true;
                        this.currentPayment = `<img src="${this.qrcode}" class="w150" >`;
                        this.selected_radio = "qrcode";
                        break;
                    case "phonepe":
                        this.is_phonepeActive = true;
                        this.currentPayment = this.phonepe;
                        this.selected_radio = "phonepe";
                        break;
                    case "paytm":
                        this.is_paytmActive = true;
                        this.currentPayment = this.paytm;
                        this.selected_radio = "paytm";
                        break;
                    case "gpay":
                        this.is_gpayActive = true;
                        this.currentPayment = this.gpay;
                        this.selected_radio = "gpay";

                        break;
                    default:
                        this.currentPayment = "No payment method found";
                }
                // switch (true) {
                //     case this.is_otherActive:
                //         this.currentPayment = this.bank;
                //         this.selected_radio = "other";
                //         break;
                //     case this.is_qrActive:
                //         this.currentPayment = `<img src="${this.qrcode}" class="w150" >`;
                //         this.selected_radio = "qrcode";
                //         break;
                //     case this.is_phonepeActive:
                //         this.currentPayment = this.phonepe;
                //         this.selected_radio = "phonepe";
                //         break;
                //     case this.is_paytmActive:
                //         this.currentPayment = this.paytm;
                //         this.selected_radio = "paytm";
                //         break;
                //     case this.is_gpayActive:
                //         this.currentPayment = this.gpay;
                //         this.selected_radio = "gpay";
                //         break;
                //     default:
                //         this.currentPayment = "No payment method found";
                // }
                this.methodval = this.selected_radio;
            }
        });
    }

    chooseMethod(event: any) {
        this.selected_radio = event.target.value;
        if (event.target.value == "paytm") {
            this.currentPayment = this.paytm ? this.paytm : "not found";
        } else if (event.target.value == "phonepe") {
            this.currentPayment = this.phonepe ? this.phonepe : "not found";
        } else if (event.target.value == "gpay") {
            this.currentPayment = this.gpay ? this.gpay : "not found";
        } else if (event.target.value == "other") {
            this.currentPayment = this.bank ? this.bank : "not found";
        } else if (event.target.value == "qrcode") {
            this.currentPayment = this.qrcode ? `<img src="${this.qrcode}" class="w150" >` : "not found";
        } else {
            this.currentPayment = this.gpay ? this.gpay : "not found";
        }
    }

    toggleUpiTextbox() {
        this.showUpiTextbox = true;
    }

    get depositFormControl() {
        return this.depositForm.controls;
    }

    onFileSelected(event: any) {
        this.selectedFile = event.target.files[0];
    }

    addDepositRequest() {
        this.submitted = true;
        if (this.depositForm.invalid) {
            return;
        } else {
            const formData = new FormData();

            // @ts-ignore
            formData.append('user_id', this.user_id.toString());
            formData.append('method', this.depositForm.value.method);
            formData.append('amount', this.depositForm.value.amount);
            formData.append('transaction_id', this.depositForm.value.transaction_id);
            // @ts-ignore
            formData.append('username', this.username);
            formData.append('file', this.selectedFile, this.selectedFile.name);
            // let request_details = {
            //   user_id: this.user_id,
            //   amount: this.depositForm.value.amount,
            //   transaction_id: this.depositForm.value.transaction_id,
            //   username: this.username
            // };
            console.log('form data-->',formData);
            this.clicked = true;
            this.transactionService.addDepositRequest(formData).subscribe((res: any) => {
                if (res.error) {
                    this.errorMsg = res.error;
                } else {
                    this.clicked = false;
                    this.toastr.success('Deposit Request Sent');
                    this.dismiss();
                }
            });
        }
    }

    addPayment() {
        // console.log('caled', this.depositForm.invalid);
        this.submitted = true;
        if (this.depositForm.invalid) {
            return;
        } else {
            let dt = new Date();
            // let clientRefId = this.user_id + "-" + dt.getFullYear() + "" + (dt.getMonth() + 1) + "" + dt.getDate() + "-" + dt.getHours() + "" + dt.getMinutes();
            let clientRefId = this.user_id + "" + dt.getFullYear() + "" + (dt.getMonth() + 1) + "" + dt.getDate() + "" + dt.getHours() + "" + dt.getMinutes();
            // console.log(clientRefId);
            let sendData = {
                user_id: this.user_id,
                username: this.username,
                data: {Amount: this.depositForm.value.amount, RequestType: "FULL", ClientRefId: clientRefId}
            };
            this.clicked = true;
            this.showPayMethods = true;
            this.transactionService.addPayInPayment(sendData).subscribe((res: any) => {
                // console.log('res from add pay', res);
                if (res != null) {
                    // console.log('respone from api:',res)
                    this.txn_id = res.TranxRefId;
                    this.vpa = res.VPA;
                    this.googlePayLink = res.googlePayLink;
                    this.paytmPayLink = res.paytmLink;
                    this.phonepePayLink = res.phonePeLink;
                    this.genericUpiLink = res.genericUpiLink;
                    this.final_amount = res.Amount;
                    // console.log("final amount",this.final_amount)
                    let response_status = '';
                    this.paymentcheckService.startPolling(this.txn_id);
                    this.pollingDataSubscription = this.paymentcheckService.getPollingData().subscribe((response: any) => {
                        // Handle the response from the service
                        // console.log('Received response in comp:', response);
                        if (response.curr_status.toLowerCase() != 'initiated') {
                            // console.log('in', response.curr_status);
                            this.paymentMsg = response.curr_status;
                            this.isLoading = false;
                            this.paymentDone = true;
                        }
                    });
                }
            });
        }
    }

    downloadQr(val: any) {
        const span = document.createElement('span');
        span.innerHTML = val;

        const img: any = span.children[0];
        const url = img.src;
        // download the image
        const a: any = document.createElement('a');
        a.href = url;
        a.download = "qr.png";
        document.body.appendChild(a);
        a.style = 'display: none';
        a.click();
        a.remove();
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

    redirectPhonepe() {
        this.showPayMethods = false;
        this.isLoading = true;
        location.href = this.phonepePayLink;
        // location.href = `phonepe://pay?pa=${this.vpa}&tn=${this.txn_id}&am=${this.final_amount}`
        // console.log('hef',location.href);
    }

    redirectGpay() {
        // console.log('hef', this.googlePayLink);
        this.showPayMethods = false;
        this.isLoading = true;
        // location.href = `gpay://upi/pay?pa=${this.vpa}&tn=${this.txn_id}&am=${this.final_amount}`
        location.href = this.googlePayLink;

    }

    redirectPaytm() {
        this.showPayMethods = false;
        this.isLoading = true;
        location.href = this.paytmPayLink;
        // location.href = `paytmmp://pay?pa=${this.vpa}&tn=${this.txn_id}&am=${this.final_amount}`
        // console.log('hef',location.href);
    }

    redirectOthers() {
        this.showPayMethods = false;
        this.isLoading = true;
        location.href = this.genericUpiLink;
        // location.href = `upi://pay?pa=${this.vpa}&tn=${this.txn_id}&am=${this.final_amount}`
        // console.log('hef',location.href);
    }

    dismiss() {
        // this.paymentcheckService.stopPeriodicCalls();
        this.dialogRef.close();
    }

    stopPolling(): void {
        this.paymentcheckService.stopPollingAndCleanUp();
        if (this.pollingDataSubscription) {
            this.pollingDataSubscription.unsubscribe();
        }
    }

    ngOnDestroy(): void {
        this.stopPolling();
    }

    setDepositAmount(amount: number): void {
        this.depositForm.patchValue({amount});
    }

}
