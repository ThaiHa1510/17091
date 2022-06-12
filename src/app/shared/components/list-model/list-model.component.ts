import { Component, OnInit } from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';
import { ModelService } from '@/_servies/model.service';
import { SearchService } from '@/_servies/search.service';
import { ChatService } from '@/_servies/chat.service';
import { UserService } from '@/_servies/user.service';
import { AlertService } from '@/_servies/alert.service';
import { Subject } from 'rxjs';
import { EventSocket } from '@/_models';

@Component({
  selector: 'list-model',
  templateUrl: './list-model.component.html',
  styleUrls: ['./list-model.component.css']
})
export class ListModelComponent implements OnInit {
  page = 1;
  pageSize = 12;
  modelList = [];
  queryString: any;
  filter: string;
  filter$: any;
  totalModel: number;
  unsubcribe$ = new Subject<void>();
  searchTerm$ = new Subject<string>();
  constructor(private searchService: SearchService, private userService: UserService, private modelService: ModelService, private alertService: AlertService, private chatService: ChatService) {
  }
  searchableList = [
    'firstName', 'lastName'
  ]
  ngOnInit() {
    this.getModelList();
    this.listernOnline();
    this.listernOffline();
    this.listernCalling();
    this.listernCallingOff()
  }

  getModelList() {
    this.modelService.getAllModel('status', 'desc', 0, this.pageSize).subscribe(data => {
      this.modelList = this.shuffle(data.data);
      this.totalModel = data.total_count;
    });
  }


  listernOnline() {
    this.modelService.socketService.onEvent(this.modelService.EventModelOnline).subscribe(data => {
      this.modelService.setModelOnOff(this.modelList, data, true);
    });
  }
  listernOffline() {
    this.modelService.socketService.onEvent(this.modelService.EventModelOffline).subscribe(data => {
      this.modelService.setModelOnOff(this.modelList, data, false);
    });
  }

  listernCalling() {
    this.modelService.socketService.onEvent(EventSocket.CALLSTART).subscribe(data => {
      this.modelService.setModelCallOnOff(this.modelList, data, true);
    });
  }

  listernCallingOff() {
    this.modelService.socketService.onEvent(EventSocket.CALLEND).subscribe(data => {
      this.modelService.setModelCallOnOff(this.modelList, data, false);
    });
  }

  changeFilter($event) {

    this.unsubcribe$.next();
    this.filter = $event.target.value;
    this.filter$ = this.searchService.searchWith(this.searchTerm$, this.filter).pipe(takeUntil(this.unsubcribe$));
    this.filter$.subscribe(results => {
      this.modelList = results.data;
    });

  }

  pageChange(e) {
    this.modelService.getAllModel('status', 'desc', e - 1, this.pageSize).subscribe(data => {
      console.log('total model:'+this.totalModel);
      if ( this.modelList.length +data.data.length < this.totalModel){
          this.modelList = [...this.modelList, ...data.data];
      }
    });
    var listModel = document.getElementById('list-model');
    listModel.scrollIntoView();
  }

  search($event) {
    if (!this.filter) {
      this.alertService.warning('Please choose a filter menu');
    }
    else {
      this.searchTerm$.next($event.target.value)
    }
  }

  shuffle(arr: any[]) {
    let rand: any, temp: any, i: any;
    // for (i = arr.length - 1; i > 0; i -= 1) {
    //   rand = Math.floor((i + 1) * Math.random());
    //   temp = arr[rand];
    //   arr[rand] = arr[i];
    //   arr[i] = temp;
    // }
    arr.sort((x, y) => {
      return (x.status === y.status) ? 0 : x.status ? -1 : 1;
    })
    return [...arr];
  }
}
