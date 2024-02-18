import {DOCUMENT} from '@angular/common';
import {inject, Injectable} from '@angular/core';
import {EventManager} from '@angular/platform-browser';

import {Observable} from 'rxjs';

interface Options {
  element: any;
  keys: string;
}

@Injectable({providedIn: 'root'})
export class Hotkeys {
  #eventManager = inject(EventManager);
  #document = inject(DOCUMENT);

  defaults: Partial<Options> = {
    element: this.#document,
  };

  addShortcut(options: Partial<Options>): Observable<unknown> {
    const merged = {...this.defaults, ...options};
    const event = `keydown.${merged.keys}`;

    return new Observable((observer) => {
      // @ts-expect-error anything
      const handler = (e) => {
        e.preventDefault();
        observer.next(e);
      };

      const dispose = this.#eventManager.addEventListener(
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
