import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { SearchService } from '@/_servies/';
import { PageconfigService } from '@/_servies/pageconfig.service';
import { CallService } from '@/_servies/call.service';
import { AuthenticationService } from '@/_servies/authentication.service';
import { ChatService } from "@/_servies/chat.service";
import { Config } from '@/_models';
import { first } from 'rxjs/operators';
import { User } from '@/_models';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'environments/environment'
import { Location } from '@angular/common';
declare var $: any;
import { Events } from '@/_servies/events.service';
import { LanguageService } from '@/_servies/language.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  user: User;
  pageConfig;
  timer: number = 0;
  isShowModal: boolean = false;
  baseUrl = environment.apiUrl;
  results: object[];
  searchTerm$ = new Subject<string>();
  actiionProfile: boolean = false;
  acitveToggleMenu: boolean = false;
  languages = [];
  @ViewChild('toggleMenu', { static: true }) toggleMenu: ElementRef;
  @ViewChild('rightHeader', { static: true }) rightHeader: ElementRef;

  constructor(private authentication: AuthenticationService,
    private chatService: ChatService,
    private events: Events,
    private translateService: TranslateService,
    private languageService: LanguageService,
    private callService: CallService,
    private searchService: SearchService,
    private pageConfigService: PageconfigService,
    private location: Location,
    private router: Router,
    private detectorRef: ChangeDetectorRef) {
    this.searchTerm$.subscribe(inputData => {
    });
    this.searchService.search(this.searchTerm$).subscribe(results => {
      this.results = results.data;
    });
    this.pageConfigService.currentConfig.subscribe(data => {
      if (data != null) {
        this.pageConfig = data;
      }
      else {
        this.pageConfig = new Config();
      }
    })

  }
  totalUnreadMessage = 0;
  public countUnreadMessage() {
    this.chatService.countUnReadMessage().subscribe((resp: any) => {
      this.totalUnreadMessage = resp.data.total;
    });
  }
  selectedLanguage = {
    name: 'fr',
    key: 'fr'
  };
  loadLanguage() {
    this.languageService.getListLang().subscribe((resp: any) => {
      this.languages = resp.data.items
      const userLang = localStorage.getItem('userLang');
      if (userLang) {
        this.selectedLanguage = {
          name: userLang,
          key: userLang,
        }
      } else {
        this.selectedLanguage = {
          name: resp.data.defaultLanguage,
          key: resp.data.defaultLanguage,
        }
      }
    })
  }
  selectLanguage(item) {
    this.selectedLanguage = {
      name: item.key,
      key: item.key
    };
    this.languageService.setUserLang(item);
    this.translateService.setDefaultLang(item.key);

    this.translateService.use(item.key);

  }
  ngOnInit() {
    this.loadLanguage();
    this.callService.remainingTime$.subscribe(data => {
      if (data <= 0) {
        this.timer = 0;
      }
      else {
        this.timer = data;
      }
    },
      err => {
        this.timer = 0;
      })
    this.user = this.authentication.currentUserValue;
    if (this.user && this.user.id) {
      this.countUnreadMessage();
    }
    this.events.subscribe('chat:updated', _badgeValue => {
      this.totalUnreadMessage = _badgeValue;
      this.detectorRef.detectChanges();
    });
    this.events.subscribe('chat:new-message-comming', _badgeValue => {
      this.totalUnreadMessage = this.totalUnreadMessage + 1;
      this.detectorRef.detectChanges();
    });
  }

  showAction() {
    this.actiionProfile = !this.actiionProfile;
  }

  logout() {
    this.authentication.logout();
    // this.location.back();
    //this.router.navigate(['/']);
  }
  ngAfterViewInit() {
    // $('.toggle-menu').click(function(){
    //   $('.right-header').toggleClass('active');
    //   $(this).toggleClass('active');
    // });
    // this.toggleMenu.nativeElement.on('click',(event)=>{
    //   this.rightHeader.nativeElement.classList.add('active');
    //   //$(this).toggleClass('active');
    //   this.acitveToggleMenu=!this.acitveToggleMenu;
    // })

    // $('.toogle-chat').click(function(){
    //   $('.chat-main').toggleClass('active');
    //   $(this).toggleClass('active');
    // });


  }

  onNavigateTo(path: string) {
    this.router.navigate([path]);
  }


}
