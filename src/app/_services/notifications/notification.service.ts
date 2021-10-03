import {Injectable, TemplateRef} from '@angular/core';
import {TranslateService} from 'dfx-translate';

@Injectable({providedIn: 'root'})
export class NotificationService {
  delay = 4000;
  toasts: any[] = [];

  constructor(private translator: TranslateService) {}

  info(str: string): void {
    this.show(str, {delay: this.delay});
  }

  tinfo(translationKey: string): void {
    this.info(this.translator.translate(translationKey));
  }

  success(str: string): void {
    this.show(str, {classname: 'bg-success text-light', delay: this.delay});
  }

  tsuccess(translationKey: string): void {
    this.success(this.translator.translate(translationKey));
  }

  warning(str: string): void {
    this.show(str, {classname: 'bg-warning text-dark', delay: this.delay});
  }

  twarning(translationKey: string): void {
    this.warning(this.translator.translate(translationKey));
  }

  error(str: string): void {
    this.show(str, {classname: 'bg-danger text-light', delay: this.delay});
  }

  terror(translationKey: string): void {
    this.error(this.translator.translate(translationKey));
  }

  private show(textOrTpl: string | TemplateRef<any>, options: any = {}): void {
    this.toasts.push({textOrTpl, ...options});
  }

  remove(toast: any): void {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }
}
