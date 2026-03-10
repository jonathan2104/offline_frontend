import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from "../services/user.service";
import { ToastrService } from "ngx-toastr";
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { UserReportComponent } from "../modals/user-report/user-report.component";
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  selectedFile: File | null = null;
  userDetails: any = [];
  showPassword: boolean = false;
  baseUrl: any;
  canReferal: boolean = false;
  referralUserList: any[] = [];
  userReport: any = { total_deposit: 0, total_withdrawal: 0 };

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toasterService: ToastrService,
    private ngbModal: NgbModal
  ) {
    this.profileForm = this.fb.group({
      name: [''],
      username: [''],
      password: [''],
      mobile: [''],
      user_id: [''],
    });

    this.baseUrl = window.location.origin;
  }

  ngOnInit(): void {
    // 👇 First load self details
    this.userService.getSelfDetails().subscribe((res: any) => {
      this.userDetails = res[0];

      this.profileForm.patchValue({
        name: this.userDetails.name || '',
        username: this.userDetails.username || '',
        mobile: this.userDetails.contact || '',
        password: this.userDetails.password || '',
        user_id: this.userDetails.id
      });

      // ✅ Load referral list and report in parallel
      if (this.userDetails.can_promote && this.userDetails.can_promote == '1') {
        this.canReferal = true;

        forkJoin({
          referralUsers: this.userService.getMyReferralusers(),
          userReport: this.userService.getUsersReport({})
        }).subscribe(
          (result: any) => {
            this.referralUserList = result.referralUsers?.length ? result.referralUsers : [];
            this.userReport = result.userReport || { total_deposit: 0, total_withdrawal: 0 };
          },
          (err) => {
            console.error('Error loading referral or report data', err);
          }
        );
      }
    });
  }

  openReport(client: any) {
    const config: NgbModalOptions = {
      backdrop: 'static',
      size: 'xl',
    };
    const modalRef = this.ngbModal.open(UserReportComponent, config);
    modalRef.componentInstance.user_id = client.id;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    // API call to update profile here
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  copyReferral(input: HTMLInputElement) {
    input.select();
    document.execCommand('copy');
    this.toasterService.success('Referral link copied!', 'Success');
  }

  shareReferral(url: string) {
    if (navigator.share) {
      navigator.share({
        title: 'Join me!',
        text: 'Sign up using my referral link:',
        url: url
      }).then(() => {
        this.toasterService.success('Referral link shared!', 'Success');
      }).catch((err) => console.log(err));
    } else {
      navigator.clipboard.writeText(url);
      this.toasterService.success('Referral link copied! Share it with your friends.', 'Success');
    }
  }
}