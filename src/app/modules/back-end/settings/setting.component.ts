import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {SelectionModel} from '@angular/cdk/collections';
import {MatSort} from '@angular/material/sort';
import {AlertService, SettingService} from '@/_servies';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';


@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  listPackages = new MatTableDataSource<any>([]);
  constructor(
    public dialog: MatDialog,
    private settingService: SettingService,
    private alertService: AlertService) {

  }
  selection = new SelectionModel<any>(true, []);
  assigned: string = '';
  displayedColumns: string[] = ['name', 'value', 'createdAt', 'updatedAt', 'actions'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  isLoadingResults = true;
  resultsLength = 0;
  isRateLimitReached = false;

  ngOnInit() {

  }
  sortChange() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  }



  ngAfterViewInit() {
    this.listPackages.sort = this.sort;
    this.sortChange();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.settingService.getAll({sort: this.sort.active, order: this.sort.direction, page: this.paginator.pageIndex + 1});
        }),
        map((resp: any) => {
          let data = resp.data;

          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.total_count;

          return data.items;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => {this.listPackages = data}, err => {
        this.alertService.error('Failed');
      });
  }



}
