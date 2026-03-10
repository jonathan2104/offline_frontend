import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { UserService } from "../../services/user.service";
import { forkJoin } from 'rxjs';

interface UserReport {
  total_deposit: number;
  total_withdrawal: number;
}

interface LossBack {
  id: number;
  user_id: number;
  amount: number;
  status: number;
  created_at: string;
}

@Component({
  selector: 'app-user-report',
  templateUrl: './user-report.component.html',
  styleUrls: ['./user-report.component.css']
})
export class UserReportComponent implements OnInit {
  @Input() user_id!: number;

  userReport: any = { total_deposit: 0, total_withdrawal: 0 };
  lossBacksReport: LossBack[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    forkJoin({
      report: this.userService.getUsersReport({ user_id: this.user_id }),
      lossbacks: this.userService.getUserLossBacksReport({ user_id: this.user_id })
    }).subscribe({
      next: ({ report, lossbacks }) => {
        this.userReport = report || { total_deposit: 0, total_withdrawal: 0 };
        this.lossBacksReport = Array.isArray(lossbacks) ? lossbacks : [];
      },
      error: (err) => {
        console.error('Error loading user data:', err);
      }
    });
  }
}