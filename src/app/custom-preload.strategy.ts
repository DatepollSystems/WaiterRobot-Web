import {Injectable} from '@angular/core';
import {PreloadingStrategy, Route} from '@angular/router';
import {mergeMap, Observable, of, timer} from 'rxjs';

@Injectable()
export class CustomPreloadStrategy implements PreloadingStrategy {
  preload(route: Route, loadMe: () => Observable<any>): Observable<any> {
    if (route.data && route.data.preload) {
      const delay: number = route.data.delay ?? 0;
      return timer(delay).pipe(
        mergeMap(() => {
          return loadMe();
        })
      );
    } else {
      return of(null);
    }
  }
}
