import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Ads } from '@/_models'
import { environment } from 'environments/environment';
import { PageconfigService } from '@/_servies';
import { Router } from '@angular/router';
@Component({
  selector: 'app-become-model',
  templateUrl: './become-model.component.html',
  styleUrls: ['./become-model.component.css']
})
export class BecomeModelComponent implements OnInit, AfterViewInit {
  baseUrl = environment.apiUrl + '/';
  ads: Ads;
  image: String;
  loadingAds: Boolean = false;
  public listBanner;
  @ViewChild('bgEle', { static: false }) bgEle: ElementRef;
  constructor(private pageConfigService: PageconfigService, private router: Router) {

  }

  ngOnInit() {

    setInterval(() => {
      this.image = this.getRadomContent() ? this.getRadomContent().src : '';
    }, 7000);


  }

  ngAfterViewInit() {
    if (this.bgEle) {
      this.pageConfigService.currentAds.subscribe(data => {
        if (data != null && data.footer) {
          let extraQuery = '&width=' + this.bgEle.nativeElement.offsetWidth + '&height=' + this.bgEle.nativeElement.offsetHeight + '&format=png';
          this.listBanner = data.footer[0] ? data.footer[0] : [];
          this.loadingAds = false;
          if (this.listBanner.file_doc) {
            this.image = environment.apiUrl + '/api/v1/file/banner/?path=' + this.listBanner.file_doc[0] + extraQuery;
          }
        }

      });
    }
  }

  getRadomContent() {
    if (this.listBanner && this.listBanner.file_doc && this.listBanner.file_doc.length) {
      let extraQuery = '&width=' + this.bgEle.nativeElement.offsetWidth + '&height=' + this.bgEle.nativeElement.offsetHeight + '&format=png';
      let index = this.getRandomInt(this.listBanner.file_doc.length);
      return {
        src: environment.apiUrl + '/api/v1/file/banner/?path=' + this.listBanner.file_doc[index] + extraQuery,
        desc: this.listBanner.description[index],
      }
    }

  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  navigateTo(path) {
    this.router.navigate([path]);
  }



}
