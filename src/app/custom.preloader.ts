import {PreloadingStrategy, Route} from '@angular/router';
import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable()
export class AppCustomPreloader implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    return route.data && route.data.preload ? load() : of(null);
  }
}
