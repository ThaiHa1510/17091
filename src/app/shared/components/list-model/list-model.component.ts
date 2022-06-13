import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ModelService } from '@/_servies/model.service';
import { SearchService } from '@/_servies/search.service';
import { AlertService } from '@/_servies/alert.service';
import { Subject, Subscription } from 'rxjs';
import { EventSocket } from '@/_models';

@Component({
  selector: 'list-model',
  templateUrl: './list-model.component.html',
  styleUrls: ['./list-model.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ListModelComponent implements OnInit, OnDestroy,AfterViewInit {
  page = 1;
  pageSize = 12;
  modelList = [];
  queryString: any;
  filter: string;
  filter$: any;
  subcriptions: Subscription = new Subscription();
  totalModel: number;
  unsubcribe$ = new Subject<void>();
  searchTerm$ = new Subject<string>();
  constructor(
    private searchService: SearchService,
    private changeDetachRef:ChangeDetectorRef,
    private modelService: ModelService, 
    private alertService: AlertService) {
  }
  searchableList = [
    'firstName', 'lastName'
  ]
  ngOnInit() {
    this.getModelList();
    this.listernOnline();
    this.listernOffline();
    this.listernCalling();
    this.listernCallingOff();
    this.changeDetachRef.reattach();
  }

  getModelList() {
    this.subcriptions.add(
      this.modelService.getAllModel('status', 'desc', 0, this.pageSize).subscribe(data => {
        this.modelList = this.shuffle(data.data);
        this.totalModel = data.total_count;
        this.changeDetachRef.detectChanges();
      })
    );
  }


  listernOnline() {
    this.subcriptions.add(
      this.modelService.socketService.onEvent(this.modelService.EventModelOnline).subscribe(data => {
        this.modelService.setModelOnOff(this.modelList, data, true);
        this.changeDetachRef.detectChanges();
      })
    );
  }
  listernOffline() {
    this.subcriptions.add(
      this.modelService.socketService.onEvent(this.modelService.EventModelOffline).subscribe(data => {
        this.modelService.setModelOnOff(this.modelList, data, false);
        this.changeDetachRef.detectChanges();
      })
    );
  }

  listernCalling() {
    this.subcriptions.add(
      this.modelService.socketService.onEvent(EventSocket.CALLSTART).subscribe(data => {
        this.modelService.setModelCallOnOff(this.modelList, data, true);
        this.changeDetachRef.detectChanges();
      })
    );
  }

  listernCallingOff() {
    this.subcriptions.add(
      this.modelService.socketService.onEvent(EventSocket.CALLEND).subscribe(data => {
        this.modelService.setModelCallOnOff(this.modelList, data, false);
        this.changeDetachRef.detectChanges();
      })
    );
  }

  changeFilter($event) {
    this.unsubcribe$.next();
    this.filter = $event.target.value;
    this.filter$ = this.searchService.searchWith(this.searchTerm$, this.filter).pipe(takeUntil(this.unsubcribe$));
    this.filter$.subscribe(results => {
      this.modelList = results.data;
      this.changeDetachRef.detectChanges();
    });
    this.subcriptions.add(this.filter$);
  }

  pageChange(e) {
    this.subcriptions.add(
      this.modelService.getAllModel('status', 'desc', e - 1, this.pageSize).subscribe(data => {
        console.log('total model:' + this.totalModel);
        if (this.modelList.length + data.data.length < this.totalModel) {
          this.modelList = [...this.modelList, ...data.data];
          this.changeDetachRef.detectChanges();
        }
      })
    );
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

  ngOnDestroy(): void {
    this.subcriptions.unsubscribe();

  }

  ngAfterViewInit(): void {
    this.changeDetachRef.detach();
  }


}
