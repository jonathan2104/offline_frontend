import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {UserService} from "../services/user.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-shared-header',
  templateUrl: './shared-header.component.html',
  styleUrls: ['./shared-header.component.css']
})
export class SharedHeaderComponent implements OnInit {
  profileForm: FormGroup;
  selectedFile: File | null = null;
  userDetails : any=[];
  showPassword: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserService, private toasterService: ToastrService) {
    this.profileForm = this.fb.group({
      name: [''],
      username: [''],
      password: [''],
      mobile: [''],
      user_id: [''],
    });
  }

  ngOnInit(): void {
    this.userService.getSelfDetails().subscribe((res: any) => {
      this.userDetails  = res[0]

      this.profileForm.patchValue({
        name: this.userDetails.name || '',
        username: this.userDetails.username || '',
        mobile: this.userDetails.contact || '',
        password: this.userDetails.password || '',
        user_id: this.userDetails.id
      });
  });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {

      // this.userService.updateProfile(this.profileForm.value).subscribe((res: any) => {
      //   if (res.error !=null) {
      //     this.toasterService.error(res.error)
      //   } else {
      //     this.toasterService.success('Profile updated successfully..!!')
      //   }
      // }, (error: any) => {
      //   this.toasterService.error("Something went Wrong")
      // })

    // Send formData to API here
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
