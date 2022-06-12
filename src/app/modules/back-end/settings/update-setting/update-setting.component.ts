import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {AlertService, SettingService} from '@/_servies';
@Component({
  selector: 'app-update-setting',
  templateUrl: './update-setting.component.html',
  styleUrls: ['./update-setting.component.css']
})
export class UpdateSettingComponent implements OnInit {

  constructor(
    private settingService: SettingService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router) {}


  public boxLoading: boolean;
  error = '';
  id: any;
  item: any;
  loading = false;
  submitted = false;
  createFrom: FormGroup;
  uploader: any;
  ckConfig: any;
  
  public onReady(editor) {

  }
  ngOnInit() {
    this.ckConfig = {
      //       extraPlugins: 'image2,uploadimage',
      //      ckfinder: {
      //        uploadUrl: ''
      //      },
      //      filebrowserImageUploadUrl:  '',
    }
    this.createForm();
    this.setFrom();
    this.setUpUploader();

  }

  setFrom() {

    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    this.settingService.detail(this.id).subscribe((resp: any) => {
      this.item = resp.data;
      //	  if(resp.data.type =='image'){
      //		  this.avatarUrl = resp.data.ImageUrl;
      //	  }
      this.createFrom.setValue({

        value: this.item.value

      })

      if (resp.data.type == 'image') {
        this.valueData.setValidators([]);
      }
      this.valueData.updateValueAndValidity();

    });


  }
  get valueData() {
    return this.createFrom.get('value') as FormControl;
  }
  get f() {return this.createFrom.controls;}
  createForm() {
    this.createFrom = this.formBuilder.group({

      value: new FormControl(null, Validators.required)
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
    let formData = new FormData()
    //	if (this.uploader.queue.length > 0) {
    //	  formData.append('avatar', this.uploader.queue[0]._file, this.uploader.queue[0]._file.name);
    //	}
    for (var key in dataInsert) {
      formData.append(key, dataInsert[key]);
    }

    this.settingService.update(this.id, formData)
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

  setUpUploader() {

    //    let fileSize= 1048111;
    //    this.uploader = new FileUploader({maxFileSize:fileSize });
    //    this.uploader.onWhenAddingFileFailed = (fileItem, filter) => {
    //		console.log('fileItem',this.uploader.queue);
    //      let message = '';
    //      //this.uploader.clearQueue();
    //      switch (filter.name) {
    //
    //        case 'fileSize':
    //          message = 'The image larger maximum 10MB';
    //          break;
    //          default:
    //          message ='Some thing error';
    //          break;
    //      }
    //	  if(message){
    //		  this.alertService.error(message);
    //	  }
    //
    //	  console.log(message);
    //   
    //        //this.failFlag = true;
    //      }
    //	  this.onAfterAddingFile();
  }

  clearQueue() {
    this.uploader.clearQueue();
  }
  avatarUrl: any;
  onAfterAddingFile() {
    //    this.uploader.onAfterAddingFile = (fileItem) => {
    //		var reader = new FileReader();
    //	  reader.readAsDataURL(fileItem.file.rawFile); // read file as data url
    //      reader.onload = (event) => { // called once readAsDataURL is completed
    //        this.avatarUrl = reader.result;
    //		console.log('reader.result',reader.result);
    //      }
    //
    //    }
  }
}
