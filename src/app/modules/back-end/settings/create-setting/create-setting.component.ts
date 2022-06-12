import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {AlertService, SettingService} from '@/_servies';


@Component({
  selector: 'app-create-setting',
  templateUrl: './create-setting.component.html',
  styleUrls: ['./create-setting.component.css']
})
export class CreateSettingComponent implements OnInit {

  constructor(
  private settingService:SettingService,
  private alertService:AlertService,
  private ActivatedRoute:ActivatedRoute,
  private router:Router,
  private formBuilder:FormBuilder) { }


  public boxLoading: boolean;
  error = '';
  loading = false;
  submitted = false;
  createFrom: FormGroup;
  uploader:any;
  ckConfig: any;
  public onReady(editor) {
    
  }
 ngOnInit() {
	this.createForm();
   
   
  }
  get f() {return this.createFrom.controls;}
  createForm() {
    this.createFrom = this.formBuilder.group({
      name: new FormControl(null, Validators.required),
      value:  new FormControl(null,  Validators.required),
	  slug : new FormControl(null,  Validators.required),
	  type: new FormControl(null,  Validators.required)
    });
  }
  
  onSubmit() {
    this.submitted = true;
    if (this.createFrom.invalid) {
      return;
    }
    this.boxLoading = true;
    this.loading = true;
    let dataInsert = this.createFrom.value;
    this.settingService.create(dataInsert)
      .pipe()
      .subscribe(
      data => {
          this.boxLoading = false;
          this.loading = false;
          this.alertService.success('Save Successfully');
          this.router.navigate(['/dashboard/settings']);
        },
        error => {
          this.loading = false;
          this.boxLoading = false;

        });
  }
}
