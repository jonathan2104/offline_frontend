import { Component, OnInit } from '@angular/core';
import { UserService } from "../services/user.service";

interface LossBack {
  id: number;
  user_id: number;
  amount: number;
  status: number; // 1 = claimed, 0 = unclaimed
  username: string;
  created_at?: string;
}

@Component({
  selector: 'app-lossback-report',
  templateUrl: './lossback-report.component.html',
  styleUrls: ['./lossback-report.component.css'],
})
export class LossBackReportComponent implements OnInit {
  currentPage: number = 1;
  itemsPerPage = 10;
  entriesOptions = [10, 20, 50];

  lossBacks: LossBack[] = [];

  totalClaimed: number = 0;
  totalUnclaimed: number = 0;
  loadingTransfer: boolean = false;
  totalDeposit: number = 0;
  totalWithdrawal: number = 0;
  canTransfer: boolean = true;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadLossBacks();
    this.loadUserReport();
  }

  loadLossBacks() {
    this.userService.getUserLossBacksReport({}).subscribe(
      (res: any) => {
        this.lossBacks = Array.isArray(res) ? res : [];
        this.calculateTotals();
      },
      (err) => console.error("Error fetching lossbacks:", err)
    );
  }

  loadUserReport() {
    this.userService.getUsersReport({}).subscribe(
      (res: any) => {
        this.totalDeposit = res?.total_deposit || 0;
        this.totalWithdrawal = res?.total_withdrawal || 0;

        // ✅ Validation logic:
        if (this.totalDeposit > 0 && this.totalWithdrawal > this.totalDeposit) {
          this.canTransfer = false;
        } else {
          this.canTransfer = true;
        }
      },
      (err) => console.error("Error fetching user report:", err)
    );
  }

  // Transfer all unclaimed lossbacks
  transferAllToBalance() {
    const unclaimedIds = this.lossBacks.filter(lb => lb.status === 0).map(lb => lb.id);
    if (unclaimedIds.length === 0) return;

    this.loadingTransfer = true; // disable button while processing
    this.userService.transferAllLossBacksToBalance().subscribe({
      next: () => {
        this.lossBacks.forEach(lb => { if (lb.status === 0) lb.status = 1; });
        this.calculateTotals();
        this.loadingTransfer = false; // re-enable button
      },
      error: (err) => {
        console.error("Error transferring all lossbacks:", err);
        this.loadingTransfer = false; // re-enable button even on error
      }
    });
  }

  // Recalculate totals
  calculateTotals() {
    this.totalClaimed = this.lossBacks
      .filter(lb => lb.status === 1)
      .reduce((sum, lb) => sum + lb.amount, 0);

    this.totalUnclaimed = this.lossBacks
      .filter(lb => lb.status === 0)
      .reduce((sum, lb) => sum + lb.amount, 0);
  }

  onEntriesChange() {
    this.currentPage = 1; // reset to first page on change
  }
  
}