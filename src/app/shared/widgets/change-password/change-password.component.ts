import { Component, OnInit ,Inject} from '@angular/core';
import { FormGroup, FormBuilder,FormGroupDirective,NgForm,FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { UserService} from '@/_servies/user.service';
import { ErrorStateMatcher } from '@angular/material/core';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  passwordFormGroup:FormGroup;
  user:any={
    id:'',
    password:'',
  };
  matcher=new MyErrorStateMatcher();
  constructor(public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private userService:UserService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder:FormBuilder) {
      this.user.id=this.data;
      this.user.password='';
    this.passwordFormGroup=this.formBuilder.group({
      passwordCtrl: ['', [Validators.required,Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required,Validators.minLength(8)]],
    },{validator: this.checkPasswords });
   }

  ngOnInit() {
  }

  onSubmit(){
      if(this.passwordFormGroup.invalid){
        return;
      }
      var user={
        id:this.data,
        password:this.passwordFormGroup.controls.passwordCtrl.value,
      }
      this.userService.changePassword(user).subscribe(data=>{
          this.dialogRef.close({
            status:'success'
          });
      },
      error=>{
          this.dialogRef.close({
            status:'false'
          });
      });
  }
  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
  let pass = group.get('passwordCtrl').value;
  let confirmPass = group.get('confirmPassword').value;

  return pass === confirmPass ? null : { notSame: true }     
  }

  onNoClick(){
    this.dialogRef.close();
  }

}
