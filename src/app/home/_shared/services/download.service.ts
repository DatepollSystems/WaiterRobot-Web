import {HttpClient, HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {Observable, scan} from 'rxjs';

@Injectable({providedIn: 'root'})
export class DownloadService {
  httpClient = inject(HttpClient);

  download$(url: string, name: string): Observable<Download> {
    return this.httpClient
      .get(url, {
        reportProgress: true,
        observe: 'events',
        responseType: 'blob',
      })
      .pipe(
        download((blob) => {
          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(blob);
          a.href = objectUrl;
          a.download = name;
          a.click();
          URL.revokeObjectURL(objectUrl);
        }),
      );
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
        // Set progress to 100, so it will be rendered in the ui
        {state: 'PENDING', progress: 100},
      ),
    );
}

function isHttpResponse<T>(event: HttpEvent<T>): event is HttpResponse<T> {
  return event.type === HttpEventType.Response;
}

function isHttpProgressEvent(event: HttpEvent<unknown>): event is HttpProgressEvent {
  return event.type === HttpEventType.DownloadProgress || event.type === HttpEventType.UploadProgress;
}
