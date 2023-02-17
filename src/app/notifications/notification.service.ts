import {Injectable, TemplateRef} from '@angular/core';
import {dfxTranslate$} from 'dfx-translate';
import {BehaviorSubject, first} from 'rxjs';

@Injectable({providedIn: 'root'})
export class NotificationService {
  private delay = 4000;
  private toasts: any[] = [];
  toasts$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(this.toasts);

  private translate = dfxTranslate$();

  constructor() {}

  info(str: string): void {
    this.show(str, {delay: this.delay});
  }

  tinfo(translationKey: string): void {
    this.translate(translationKey)
      .pipe(first())
      .subscribe((translation) => this.info(translation));
  }

  success(str: string): void {
    this.show(str, {classname: 'bg-success text-light', delay: this.delay});
  }

  tsuccess(translationKey: string): void {
    this.translate(translationKey)
      .pipe(first())
      .subscribe((translation) => this.success(translation));
  }

  warning(str: string, delay?: number): void {
    this.show(str, {classname: 'bg-warning text-dark', delay: delay ?? this.delay});
  }

  twarning(translationKey: string): void {
    this.translate(translationKey)
      .pipe(first())
      .subscribe((translation) => this.warning(translation));
  }

  error(str: string, delay?: number): void {
    this.show(str, {classname: 'bg-danger text-light', delay: delay ?? this.delay});
  }

  terror(translationKey: string): void {
    this.translate(translationKey)
      .pipe(first())
      .subscribe((translation) => this.error(translation));
  }

  private show(textOrTpl: string | TemplateRef<any>, options: any = {}): void {
    this.toasts.push({textOrTpl, ...options});
    this.toasts$.next(this.toasts.slice());
  }

  remove(toast: any): void {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }
}
