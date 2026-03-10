import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {TransactionService} from "../services/transaction.service";

declare var paypal: any;

@Component({
  selector: 'app-recharge-wallet',
  templateUrl: './recharge-wallet.component.html',
  styleUrls: ['./recharge-wallet.component.css']
})
export class RechargeWalletComponent implements OnInit {

  @ViewChild('paypal', {static: true}) paypalElement: ElementRef;
  amount: number = 0;
  product = {price: this.amount, description: "added balance in wallet"}
  paidFor: boolean = false;

  transaction_details: any;
  errorMsg:any;
  test = {
    "id": "9KB45997FF3794908",
    "intent": "CAPTURE",
    "status": "COMPLETED",
    "purchase_units": [
      {
        "reference_id": "default",
        "amount": {
          "currency_code": "USD",
          "value": "2.00"
        },
        "payee": {
          "email_address": "sb-h5oaj25286804@business.example.com",
          "merchant_id": "SYE93M9UTU6AA"
        },
        "description": "recharge wallet",
        "soft_descriptor": "PAYPAL *TEST STORE",
        "shipping": {
          "name": {
            "full_name": "John Doe"
          },
          "address": {
            "address_line_1": "1 Main St",
            "admin_area_2": "San Jose",
            "admin_area_1": "CA",
            "postal_code": "95131",
            "country_code": "US"
          }
        },
        "payments": {
          "captures": [
            {
              "id": "0M171673RV480870T",
              "status": "COMPLETED",
              "amount": {
                "currency_code": "USD",
                "value": "2.00"
              },
              "final_capture": true,
              "seller_protection": {
                "status": "ELIGIBLE",
                "dispute_categories": [
                  "ITEM_NOT_RECEIVED",
                  "UNAUTHORIZED_TRANSACTION"
                ]
              },
              "create_time": "2023-03-16T06:11:59Z",
              "update_time": "2023-03-16T06:11:59Z"
            }
          ]
        }
      }
    ],
    "payer": {
      "name": {
        "given_name": "John",
        "surname": "Doe"
      },
      "email_address": "sb-3ynkd25291838@business.example.com",
      "payer_id": "LU49LWNS3G74L",
      "address": {
        "country_code": "US"
      }
    },
    "create_time": "2023-03-16T06:11:36Z",
    "update_time": "2023-03-16T06:11:59Z",
    "links": [
      {
        "href": "https://api.sandbox.paypal.com/v2/checkout/orders/9KB45997FF3794908",
        "rel": "self",
        "method": "GET"
      }
    ]
  }

  paypalConfig = {
    createOrder: (data: any, actions: any) => {
      return actions.order.create({
        purchase_units: [{
          description: 'recharge wallet',
          amount: {currency_code: 'USD', value: this.amount}
        }]
      });
    },
    onApprove: async (data: any, actions: any) => {
      const order = await actions.order.capture();
      this.paidFor = true;
      this.transaction_details = {
        user_id: localStorage.getItem("user_id"),
        amount: order.purchase_units[0].payments.captures[0].amount.value,
        transaction_id: order.purchase_units[0].payments.captures[0].id,
        status: order.purchase_units[0].payments.captures[0].status
      }
      this.transactionService.addTransaction(this.transaction_details).subscribe((res:any)=>{
        if(res.errors){
          this.errorMsg = res.errors;
        }
        else{
          this.router.navigateByUrl("/dashboard/recharge-history");
        }
      })
    },
    onError: (err: any) => {
      console.log(err)
    }
  }

  constructor(private router:Router, private transactionService:TransactionService) {
  }

  ngOnInit(): void {
    // console.log(this.test.purchase_units[0].payments.captures[0].amount.value)
    // console.log(this.test.purchase_units[0].payments.captures[0].id)
    // console.log(this.test.purchase_units[0].payments.captures[0].status)

    paypal.Buttons(this.paypalConfig).render(this.paypalElement.nativeElement);
  }


}
