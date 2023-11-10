import {computed, Injectable, signal} from '@angular/core';

import {b_fromStorage, st_set} from 'dfts-helper';

@Injectable({
  providedIn: 'root',
})
export class FullScreenService {
  private fullScreen = signal(b_fromStorage('is_fullscreen') ?? false);

  setFullScreen(it: boolean): void {
    st_set('is_fullscreen', it);
    this.fullScreen.set(it);
  }

  public isFullScreen = computed(() => this.fullScreen());
}
