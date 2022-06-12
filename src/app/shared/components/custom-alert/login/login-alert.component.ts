import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
@Component({
  selector: 'login-alert',
  templateUrl: './login-alert.component.html',
  styleUrls: ['./login-alert.css']
})
export class LoginAlertComponent implements OnInit {

  constructor(
    private snackBarRef: MatSnackBarRef<LoginAlertComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any) {
  }

  close() {
    this.snackBarRef.dismiss();
  }

  ngOnInit() {
  }

}
