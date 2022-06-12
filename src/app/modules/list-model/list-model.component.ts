import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { UserService, ModelService, AlertService } from '@/_servies';
import { User } from '@/_models'
@Component({
  selector: 'app-list-model',
  templateUrl: './list-model.component.html',
  styleUrls: ['./list-model.component.css']
})
export class ListModelComponent implements OnInit {
  page = 1;
  pageSize = 12;
  modelList = [];
  queryString: any;
  searchableList = ['firstName', 'lastName'];

  constructor(private modelService: ModelService) {
  }

  ngOnInit() {
    this.getModelList();
  }

  getModelList() {
    this.modelService.models$.subscribe((data: any) => {
      this.modelList = this.shuffleModelList(data)
    });
  }

  shuffleModelList(data: any[]) {
    // for (let i = 0; i < data.length; i++) {
    //   const j = Math.floor(Math.random() * (i + 1));
    //   [data[i], data[j]] = [data[j], data[i]];
    // }
    data=data.sort((x,y)=>{
      return (x.status === y.status) ? 0 : x.status ? -1 : 1;
    })
    return data;
  }

}
