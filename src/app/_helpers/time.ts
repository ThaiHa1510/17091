import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {AuthenticationService} from '@/_servies/authentication.service';
import {TranslateService} from '@ngx-translate/core';
@Injectable({ providedIn: 'root' })
export class TimeHelper {
  secondString = 'seconds ago';
  minString = 'minutes ago';
  hourString = 'hours ago';
  dayString = 'days ago';
  monthString = 'months ago';
  yearString = 'years ago';
  constructor(private translateService: TranslateService) {}

  public timeDifference(current, previous) {
    let secondString = this.secondString;
    let minString = this.minString;
    let hourString = this.hourString;
    let dayString = this.dayString;
    let monthString = this.monthString;
    let yearString = this.yearString;
    this.translateService.get(this.secondString).subscribe((res: string) => {
      secondString = res;
      //=> 'hello world'
    });
    this.translateService.get(this.hourString).subscribe((res: string) => {
      hourString = res;
      //=> 'hello world'
    });
    this.translateService.get(this.minString).subscribe((res: string) => {
      minString = res;
      //=> 'hello world'
    });
    this.translateService.get(this.dayString).subscribe((res: string) => {
      dayString = res;
      //=> 'hello world'
    });
    this.translateService.get(this.monthString).subscribe((res: string) => {
      monthString = res;
      //=> 'hello world'
    });
    this.translateService.get(this.yearString).subscribe((res: string) => {
      yearString = res;
      //=> 'hello world'
    });

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;
    elapsed = elapsed >>> 0;
    if (elapsed < msPerMinute) {
      return Math.round(elapsed / 1000) + ' ' + secondString;
    }

    else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + ' ' + minString;
    }

    else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + ' ' + hourString;
    }

    else if (elapsed < msPerMonth) {
      return Math.round(elapsed / msPerDay) + ' ' + dayString;
    }

    else if (elapsed < msPerYear) {
      return Math.round(elapsed / msPerMonth) + ' ' + monthString;
    }

    else {
      return Math.round(elapsed / msPerYear) + ' ' + yearString;
    }
  }
}

