import { Component, OnInit } from '@angular/core';
import {PageconfigService} from '@/_servies/pageconfig.service';
@Component({
  selector: 'app-dashboard-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterDashboardComponent implements OnInit {

  pageConfig;
  actiionProfile:boolean=false;
  constructor(private pageConfigService:PageconfigService) { 
      this.pageConfig=this.pageConfigService.currentConfigValue;
  }

  ngOnInit() {
    
  }
  
}
