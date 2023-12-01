/* eslint-disable @typescript-eslint/no-explicit-any */
import {DOCUMENT} from '@angular/common';
import {Inject, Injectable} from '@angular/core';
import {EventManager} from '@angular/platform-browser';

import {Observable} from 'rxjs';

type Options = {
  element: any;
  keys: string;
};

@Injectable({providedIn: 'root'})
export class Hotkeys {
  defaults: Partial<Options> = {
    element: this.document,
  };

  constructor(
    private eventManager: EventManager,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  addShortcut(options: Partial<Options>): Observable<any> {
    const merged = {...this.defaults, ...options};
    const event = `keydown.${merged.keys}`;

    return new Observable((observer) => {
      // @ts-expect-error anything
      const handler = (e) => {
        e.preventDefault();
        observer.next(e);
      };

      const dispose = this.eventManager.addEventListener(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        merged.element,
        event,
        handler,
      );

      return () => {
        dispose();
      };
    });
  }
}
