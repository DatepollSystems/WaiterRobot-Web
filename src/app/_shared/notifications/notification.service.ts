import {Injectable, TemplateRef} from '@angular/core';

import {dfxTranslate$} from 'dfx-translate';

import {BehaviorSubject, first} from 'rxjs';

export interface Toast {
  textOrTpl: string | TemplateRef<unknown>;
  delay: number;
  classname: string;
}

@Injectable({providedIn: 'root'})
export class NotificationService {
  private delay = 5000;

  toasts = new BehaviorSubject<Toast[]>([]);

  private translate = dfxTranslate$();

  info(str: string): void {
    this.show(str, {delay: this.delay, classname: 'bg-info text-dark'});
  }

  tinfo(translationKey: string): void {
    this.translate(translationKey)
      .pipe(first())
      .subscribe((translation) => {
        this.info(translation);
      });
  }

  success(str: string): void {
    this.show(str, {classname: 'bg-success text-light', delay: this.delay});
  }

  tsuccess(translationKey: string): void {
    this.translate(translationKey)
      .pipe(first())
      .subscribe((translation) => {
        this.success(translation);
      });
  }

  warning(str: string, delay?: number): void {
    this.show(str, {classname: 'bg-warning text-dark', delay: delay ?? this.delay});
  }

  twarning(translationKey: string): void {
    this.translate(translationKey)
      .pipe(first())
      .subscribe((translation) => {
        this.warning(translation);
      });
  }

  error(str: string, delay?: number): void {
    this.show(str, {classname: 'bg-danger text-light', delay: delay ?? this.delay});
  }

  terror(translationKey: string): void {
    this.translate(translationKey)
      .pipe(first())
      .subscribe((translation) => {
        this.error(translation);
      });
  }

  private show(textOrTpl: string | TemplateRef<unknown>, options: Omit<Toast, 'textOrTpl'>): void {
    this.toasts.next([...this.toasts.getValue(), {textOrTpl, ...options}]);
  }

  remove(toast: Toast): void {
    this.toasts.next(this.toasts.getValue().filter((t) => t !== toast));
  }
}
