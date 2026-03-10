import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupModalComponent } from '../modals/popup/popup.component';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  constructor(private dialog: MatDialog) {}

  openPopupModal(popupImg: any) {
    const dialogRef = this.dialog.open(PopupModalComponent, {});
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
