import {Injectable, signal, TemplateRef} from '@angular/core';

import {first} from 'rxjs';

import {dfxTranslate$} from 'dfx-translate';

export type Toast = {
  textOrTpl: string | TemplateRef<unknown>;
  delay: number;
  classname: string;
};

@Injectable({providedIn: 'root'})
export class NotificationService {
  private delay = 5000;

  toasts = signal<Toast[]>([]);

  private translate = dfxTranslate$();

  constructor() {}

  info(str: string): void {
    this.show(str, {delay: this.delay, classname: 'bg-info text-dark'});
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

  private show(textOrTpl: string | TemplateRef<unknown>, options: Omit<Toast, 'textOrTpl'>): void {
    this.toasts.set([...this.toasts(), {textOrTpl, ...options}]);
  }

  remove(toast: Toast): void {
    this.toasts.set(this.toasts().filter((t) => t !== toast));
  }
}
