import {HttpClient, HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';

import {Observable, scan} from 'rxjs';

import {EnvironmentHelper} from '../util/EnvironmentHelper';
import {triggerDownload} from './file.utils';

@Injectable({providedIn: 'root'})
export class DownloadService {
  #apiUrl = EnvironmentHelper.getAPIUrl();
  #httpClient = inject(HttpClient);

  download$(url: string, name: string): Observable<Download> {
    return this.#httpClient
      .get(`${this.#apiUrl}${url}`, {
        reportProgress: true,
        observe: 'events',
        responseType: 'blob',
      })
      .pipe(download((blob) => triggerDownload(blob, name)));
  }
}

export interface Download {
  state: 'PENDING' | 'IN_PROGRESS' | 'DONE';
  progress: number;
  content?: Blob;
}

function download(saver?: (b: Blob) => void): (source: Observable<HttpEvent<Blob>>) => Observable<Download> {
  return (source: Observable<HttpEvent<Blob>>) =>
    source.pipe(
      scan(
        (previous: Download, event: HttpEvent<Blob>): Download => {
          if (isHttpProgressEvent(event)) {
            return {
              progress: event.total ? Math.round((100 * event.loaded) / event.total) : previous.progress,
              state: 'IN_PROGRESS',
            };
          }
          if (isHttpResponse(event)) {
            if (saver && event.body) {
              saver(event.body);
            }
            return {
              progress: 100,
              state: 'DONE',
              content: event.body ?? undefined,
            };
          }
          return previous;
        },
        {state: 'PENDING', progress: 0},
      ),
    );
}

function isHttpResponse<T>(event: HttpEvent<T>): event is HttpResponse<T> {
  return event.type === HttpEventType.Response;
}

function isHttpProgressEvent(event: HttpEvent<unknown>): event is HttpProgressEvent {
  return event.type === HttpEventType.DownloadProgress || event.type === HttpEventType.UploadProgress;
}
