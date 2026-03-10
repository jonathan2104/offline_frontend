import {Component,Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {TransactionService} from "../../services/transaction.service";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-proof-list',
  templateUrl: './proof-list.component.html',
  styleUrls: ['./proof-list.component.css']
})
export class ProofListComponent implements OnInit {
  @Input() withdraw_id: number;
  proofs:any = {};

  constructor(public activeModal: NgbActiveModal, private transactionService: TransactionService) {
  }

  ngOnInit(): void {
    //console.log(this.withdraw_id);
    this.getWProofsRequests();
  }

  getWProofsRequests() {
    this.transactionService.getProof(this.withdraw_id).subscribe((res: any) => {
      const imageBaseUrl = environment.image_url;
      this.proofs = res.map((obj: any) => {
        return {
          ...obj,
          path: imageBaseUrl + "/" + obj.image,
        };
      });
    })
  }
  
}
