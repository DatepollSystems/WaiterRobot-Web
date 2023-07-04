import {Injectable} from '@angular/core';
import {b_fromStorage, st_set} from 'dfts-helper';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FullScreenService {
  private fullScreen = new BehaviorSubject(b_fromStorage('is_fullscreen') ?? false);

  setFullScreen(it: boolean) {
    st_set('is_fullscreen', it);
    this.fullScreen.next(it);
  }

  public get isFullScreen$(): Observable<boolean> {
    return this.fullScreen.asObservable();
  }

  public get isFullScreen(): boolean {
    return this.fullScreen.value;
  }
}