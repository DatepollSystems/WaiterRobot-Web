import {HttpClient} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';

import {Translation, TranslocoLoader} from '@jsverse/transloco';
import {interceptorByPass} from 'dfx-helper';

@Injectable({providedIn: 'root'})
export class TranslocoHttpLoader implements TranslocoLoader {
  #http = inject(HttpClient);

  getTranslation(lang: string) {
    return this.#http.get<Translation>(`/assets/i18n/${lang}.json`, {
      context: interceptorByPass().logging().build(),
    });
  }
}
