import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AlertService} from '@/_servies/alert.service';
import {TranslationService} from '@/_servies/admin/translation.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { LanguageService } from '@/_servies/admin/language.service';
import {NgbActiveModal,NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: 'translation.html'
})
export class TranslationComponent implements OnInit {
  public items = [];
  list = new MatTableDataSource<any>([]);
  public page = 1;
  public total = 0;
  public search = '';
  private lang = '';

  constructor(private route: ActivatedRoute, 
              private service: TranslationService, 
              private toasty: AlertService,
              private alertService: AlertService,
              private modalService: NgbModal
              ) {}
  displayedColumns: string[] = ['text', 'translation', 'actions'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  isLoadingResults = true;
  resultsLength = 0;
  isRateLimitReached = false;
  errors = '';

  ngOnInit() {
    this.lang = this.route.snapshot.params.lang;

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

          return this.service.search(this.lang,{sort: this.sort.active, order: this.sort.direction, page: this.paginator.pageIndex + 1,search: this.search});
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


  update(item: any) {
    if (!item.translation) {
      return this.toasty.error('Please enter translation');
    }
    //
    this.service
      .update(this.lang,item._id, {translation: item.translation})
      .subscribe(resp => this.toasty.success('Updated'), (e) => {
        this.toasty.error(e);
      })

  }

  pull() {
    this.service
      .pull(this.lang)
      .subscribe(resp => window.location.reload(), (e) => {
        this.toasty.error(e);
      })
  }

  addNew() {
    const modalRef = this.modalService.open(NewItemModalComponent, {
      size: 'sm'
    });
    //
    modalRef.result.then(
      result => {
        this.alertService.success('New item as been added');
        window.location.reload();
      },
      () => null
    );
  }
   applyFilter() {
     this.paginator.pageIndex = 1;
     this.isLoadingResults = true;
     this.service.search(this.lang, {sort: this.sort.active, order: this.sort.direction, page: this.paginator.pageIndex, search: this.search}).subscribe((resp)=>{
       this.isLoadingResults = false;
       this.isRateLimitReached = false;
       console.log(resp);
       this.resultsLength = resp.data.total_count;
       this.list = new MatTableDataSource(resp.data.items);
     })    
  }

  
}
@Component({
  templateUrl: 'add-new-modal.html'
})
export class NewItemModalComponent implements OnInit {
  public newLang: any = {
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
      .createNewItem(this.newLang).subscribe((resp) => {
         this.errors ='';
        this.activeModal.close(resp.data)
      }, (err) => {
       
        this.alertService.error(err);
         this.errors = err;
      });

  }
}
