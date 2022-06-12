import {Component, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {AlertService} from '@/_servies/alert.service';
import {LanguageService} from '@/_servies/admin/language.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'; import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {ConfirmModalComponent} from '@/shared/widgets/confirm-modal/confirm-modal.component';
import {MatSort,Sort} from '@angular/material/sort';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';

@Component({
  templateUrl: 'languages.html'
})
export class LanguagesComponent implements OnInit {
  list = new MatTableDataSource<any>([]);
  public page = 1;
  public total = 0;

  constructor(
    public dialog: MatDialog,
    private service: LanguageService,
    private alertService: AlertService,
    private modalService: NgbModal
  ) {}

  displayedColumns: string[] = ['name', 'key', 'isActive', 'isDefault', 'createdAt', 'actions'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  isLoadingResults = true;
  resultsLength = 0;
  isRateLimitReached = false;
  errors ='';
  ngOnInit() {
    // this.query();
  }
  sortChange() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  }
  ngAfterViewInit() {
    this.list.sort = this.sort;
    this.sortChange();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          console.log('\asdasd');
          return this.service.search({sort: this.sort.active, order: this.sort.direction, page: this.paginator.pageIndex + 1});
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
      ).subscribe(data => this.list = new MatTableDataSource(data));
  }

  query() {
    //    this.service
    //      .search({
    //        page: this.page
    //      })
    //      .then(resp => {
    //        this.items = resp.data.items;
    //        this.total = resp.data.count;
    //      })
    //      .catch(() => alert('Something went wrong, please try again!'));
  }

  deleteItem(index, itemId) {
    var tmp = false;
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '250px',
      data: {title: 'Are yout want to delete this page', yes: true, no: false}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.remove(itemId).subscribe(data => {
          this.list.data.splice(index, 1);
          this.list._updateChangeSubscription();
          this.alertService.success("Delete success");
        },
          err => {
            console.log(err);
            this.alertService.error("Failed");
          })
      }
    });
  }

  addNew() {
    const modalRef = this.modalService.open(NewLanguageModalComponent, {
      size: 'sm'
    });
    //
    modalRef.result.then(
      result => {
        this.alertService.success('New language as been added');
        this.list.sort = this.sort;
        const sortState: Sort = {active: '_id', direction: 'desc'};
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
        this.list._updateChangeSubscription();
      },
      () => null
    );
  }

  update(item: any, field: any, status: boolean) {
    //    const update = {};
    //    update[field] = status;
    //    this.service
    //      .update(item._id, update)
    //      .then(resp => {
    //        item[field] = status;
    //        if (field === 'isDefault' && status) {
    //          this.items.forEach(i => {
    //            i.isDefault = i._id === item._id;
    //          });
    //        }
    //      })
    //      .catch(e => this.toasty.error('Something went wrong, please try again later!'));
  }
}

@Component({
  templateUrl: 'new-language-modal.html'
})
export class NewLanguageModalComponent implements OnInit {
  public newLang: any = {
    isDefault: false,
    isActive: false,
    name: '',
    key: ''
  };
  errors = '';
  public langs: any = [];
  public isoLangs: any = {};
  public submitted: boolean = false;

  constructor(
    private service: LanguageService,
    private alertService: AlertService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.isoLangs = this.service.isoLangs;
    this.langs = Object.keys(this.service.isoLangs);
  }

  create(frm: any) {
    this.submitted = true;
    if (frm.invalid) {
      return;
    }

    this.service
      .create(this.newLang).subscribe((resp) => {
         this.errors ='';
        this.activeModal.close(resp.data)
      }, (err) => {
       
        this.alertService.error(err);
         this.errors = err;
      });

  }
}
