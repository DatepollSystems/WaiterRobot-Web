import {ChangeDetectionStrategy, Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';

import {Subject, takeUntil} from 'rxjs';

import {LoadingBarRouterModule} from '@ngx-loading-bar/router';

import {EnvironmentHelper} from './_shared/EnvironmentHelper';
import {ToastsContainerComponent} from './_shared/notifications/toasts-container.component';
import {SystemInfoComponent} from './system-info.component';

@Component({
  template: `
    <ngx-loading-bar [includeSpinner]="false" color="#7599AA" />

    <div class="flex-column" #spinnerElement>
      <div class="d-flex justify-content-center" style="padding-top: 25%">
        <div class="loader"></div>
      </div>
      <div class="d-flex justify-content-center">
        <div class="d-flex align-items-center py-1 gap-1 mt-4">
          <svg width="118pt" height="23pt" viewBox="0 0 118 23" xmlns="http://www.w3.org/2000/svg">
            <g id="fontsvg1699995532360" stroke-linecap="round" fill-rule="evenodd" fill="#1b2347">
              <path
                d="M 12.03 22.26 L 6.93 15.93 L 4.68 18.15 L 4.68 22.26 L 0 22.26 L 0 0 L 4.68 0 L 4.68 12.6 L 11.52 6.12 L 17.1 6.12 L 10.38 12.96 L 17.7 22.26 L 12.03 22.26 Z M 76.29 13.02 L 76.29 22.26 L 71.61 22.26 L 71.61 13.74 A 6.989 6.989 0 0 0 71.536 12.686 Q 71.454 12.149 71.28 11.717 A 2.858 2.858 0 0 0 70.77 10.875 A 2.711 2.711 0 0 0 69.355 10.044 Q 68.893 9.93 68.34 9.93 A 4.633 4.633 0 0 0 67.114 10.084 A 3.413 3.413 0 0 0 65.52 11.025 Q 64.47 12.12 64.47 14.28 L 64.47 22.26 L 59.79 22.26 L 59.79 6.12 L 64.26 6.12 L 64.26 8.01 A 6.118 6.118 0 0 1 66.274 6.562 A 7.192 7.192 0 0 1 66.57 6.435 Q 67.95 5.88 69.6 5.88 A 8.129 8.129 0 0 1 71.768 6.155 A 6.085 6.085 0 0 1 74.445 7.68 A 5.698 5.698 0 0 1 75.885 10.084 Q 76.29 11.361 76.29 13.02 Z M 31.98 17.19 L 34.47 19.89 A 7.333 7.333 0 0 1 30.63 22.177 Q 29.43 22.48 28.001 22.499 A 14.472 14.472 0 0 1 27.81 22.5 A 11.927 11.927 0 0 1 25.238 22.234 A 9.482 9.482 0 0 1 22.98 21.435 A 8.108 8.108 0 0 1 20.637 19.682 A 7.556 7.556 0 0 1 19.74 18.48 A 7.987 7.987 0 0 1 18.618 14.787 A 9.72 9.72 0 0 1 18.6 14.19 A 8.581 8.581 0 0 1 19.084 11.28 A 7.926 7.926 0 0 1 19.725 9.915 Q 20.85 8.01 22.815 6.945 A 8.865 8.865 0 0 1 26.335 5.917 A 10.765 10.765 0 0 1 27.24 5.88 A 9.463 9.463 0 0 1 30.059 6.29 A 8.5 8.5 0 0 1 31.44 6.855 Q 33.33 7.83 34.455 9.675 A 7.626 7.626 0 0 1 35.469 12.522 A 10.013 10.013 0 0 1 35.58 14.04 L 23.64 16.35 Q 24.15 17.55 25.245 18.15 A 4.662 4.662 0 0 0 26.547 18.618 Q 27.105 18.734 27.745 18.748 A 8.2 8.2 0 0 0 27.93 18.75 A 7.22 7.22 0 0 0 29.084 18.662 A 5.415 5.415 0 0 0 30.165 18.375 A 5.185 5.185 0 0 0 31.552 17.568 A 6.284 6.284 0 0 0 31.98 17.19 Z M 92.7 17.19 L 95.19 19.89 A 7.333 7.333 0 0 1 91.35 22.177 Q 90.15 22.48 88.721 22.499 A 14.472 14.472 0 0 1 88.53 22.5 A 11.927 11.927 0 0 1 85.958 22.234 A 9.482 9.482 0 0 1 83.7 21.435 A 8.108 8.108 0 0 1 81.357 19.682 A 7.556 7.556 0 0 1 80.46 18.48 A 7.987 7.987 0 0 1 79.338 14.787 A 9.72 9.72 0 0 1 79.32 14.19 A 8.581 8.581 0 0 1 79.804 11.28 A 7.926 7.926 0 0 1 80.445 9.915 Q 81.57 8.01 83.535 6.945 A 8.865 8.865 0 0 1 87.055 5.917 A 10.765 10.765 0 0 1 87.96 5.88 A 9.463 9.463 0 0 1 90.779 6.29 A 8.5 8.5 0 0 1 92.16 6.855 Q 94.05 7.83 95.175 9.675 A 7.626 7.626 0 0 1 96.189 12.522 A 10.013 10.013 0 0 1 96.3 14.04 L 84.36 16.35 Q 84.87 17.55 85.965 18.15 A 4.662 4.662 0 0 0 87.267 18.618 Q 87.825 18.734 88.465 18.748 A 8.2 8.2 0 0 0 88.65 18.75 A 7.22 7.22 0 0 0 89.804 18.662 A 5.415 5.415 0 0 0 90.885 18.375 A 5.185 5.185 0 0 0 92.272 17.568 A 6.284 6.284 0 0 0 92.7 17.19 Z M 38.73 16.92 L 38.73 0 L 43.41 0 L 43.41 16.65 Q 43.41 17.67 43.935 18.225 Q 44.46 18.78 45.42 18.78 A 3.101 3.101 0 0 0 46.061 18.711 A 3.481 3.481 0 0 0 46.155 18.69 A 3.627 3.627 0 0 0 46.373 18.631 Q 46.596 18.563 46.74 18.48 L 46.95 22.11 Q 45.78 22.5 44.52 22.5 A 8.236 8.236 0 0 1 42.794 22.33 Q 41.702 22.096 40.877 21.54 A 4.713 4.713 0 0 1 40.26 21.045 A 4.733 4.733 0 0 1 38.936 18.717 Q 38.743 17.952 38.731 17.043 A 9.174 9.174 0 0 1 38.73 16.92 Z M 49.26 16.92 L 49.26 0 L 53.94 0 L 53.94 16.65 Q 53.94 17.67 54.465 18.225 Q 54.99 18.78 55.95 18.78 A 3.101 3.101 0 0 0 56.591 18.711 A 3.481 3.481 0 0 0 56.685 18.69 A 3.627 3.627 0 0 0 56.903 18.631 Q 57.126 18.563 57.27 18.48 L 57.48 22.11 Q 56.31 22.5 55.05 22.5 A 8.236 8.236 0 0 1 53.324 22.33 Q 52.232 22.096 51.407 21.54 A 4.713 4.713 0 0 1 50.79 21.045 A 4.733 4.733 0 0 1 49.466 18.717 Q 49.273 17.952 49.261 17.043 A 9.174 9.174 0 0 1 49.26 16.92 Z M 109.47 5.88 L 109.47 10.2 A 47.203 47.203 0 0 0 109.153 10.177 Q 108.723 10.146 108.504 10.141 A 3.493 3.493 0 0 0 108.42 10.14 Q 106.41 10.14 105.27 11.265 A 3.532 3.532 0 0 0 104.406 12.698 Q 104.13 13.533 104.13 14.64 L 104.13 22.26 L 99.45 22.26 L 99.45 6.12 L 103.92 6.12 L 103.92 8.25 A 5.138 5.138 0 0 1 105.923 6.598 A 6.179 6.179 0 0 1 106.185 6.48 A 7.481 7.481 0 0 1 107.978 5.987 A 9.993 9.993 0 0 1 109.47 5.88 Z M 23.19 13.71 L 31.05 12.18 Q 30.72 10.92 29.7 10.17 A 3.839 3.839 0 0 0 27.892 9.461 A 5.016 5.016 0 0 0 27.24 9.42 A 4.477 4.477 0 0 0 25.887 9.615 A 3.624 3.624 0 0 0 24.36 10.56 A 3.934 3.934 0 0 0 23.397 12.272 Q 23.213 12.925 23.19 13.71 Z M 83.91 13.71 L 91.77 12.18 Q 91.44 10.92 90.42 10.17 A 3.839 3.839 0 0 0 88.612 9.461 A 5.016 5.016 0 0 0 87.96 9.42 A 4.477 4.477 0 0 0 86.607 9.615 A 3.624 3.624 0 0 0 85.08 10.56 A 3.934 3.934 0 0 0 84.117 12.272 Q 83.933 12.925 83.91 13.71 Z M 112.969 22.27 A 2.966 2.966 0 0 0 114.15 22.5 A 3.574 3.574 0 0 0 114.188 22.5 A 2.807 2.807 0 0 0 116.22 21.66 A 2.79 2.79 0 0 0 116.869 20.666 A 3.105 3.105 0 0 0 117.06 19.56 A 3.648 3.648 0 0 0 117.041 19.188 A 2.649 2.649 0 0 0 116.22 17.475 A 2.83 2.83 0 0 0 115.266 16.873 A 3.141 3.141 0 0 0 114.15 16.68 A 3.736 3.736 0 0 0 114.055 16.681 A 2.878 2.878 0 0 0 112.08 17.475 Q 111.24 18.27 111.24 19.56 A 3.72 3.72 0 0 0 111.241 19.641 A 2.834 2.834 0 0 0 112.08 21.66 A 2.828 2.828 0 0 0 112.969 22.27 Z"
                vector-effect="non-scaling-stroke"
              />
            </g>
          </svg>
          <svg width="80pt" height="23pt" viewBox="0 0 80 20" xmlns="http://www.w3.org/2000/svg">
            <g id="fontsvg1699995633010" stroke-linecap="round" fill-rule="evenodd" fill="#fa9646">
              <path
                d="M 79.35 10.47 L 79.35 19.71 L 74.67 19.71 L 74.67 11.19 Q 74.67 9.27 73.875 8.325 A 2.583 2.583 0 0 0 72.323 7.443 A 3.858 3.858 0 0 0 71.61 7.38 A 4.121 4.121 0 0 0 70.47 7.53 A 3.086 3.086 0 0 0 69 8.445 Q 68.04 9.51 68.04 11.61 L 68.04 19.71 L 63.36 19.71 L 63.36 11.19 A 6.965 6.965 0 0 0 63.234 9.799 Q 62.738 7.38 60.3 7.38 A 3.977 3.977 0 0 0 59.14 7.541 A 3.086 3.086 0 0 0 57.72 8.445 Q 56.76 9.51 56.76 11.61 L 56.76 19.71 L 52.08 19.71 L 52.08 3.57 L 56.55 3.57 L 56.55 5.43 Q 57.45 4.41 58.755 3.87 Q 60.06 3.33 61.62 3.33 A 7.467 7.467 0 0 1 63.511 3.562 A 6.394 6.394 0 0 1 64.71 4.005 Q 66.09 4.68 66.93 5.97 Q 67.92 4.71 69.435 4.02 A 7.773 7.773 0 0 1 72.304 3.341 A 9.124 9.124 0 0 1 72.75 3.33 Q 75.78 3.33 77.565 5.115 A 5.601 5.601 0 0 1 78.904 7.346 Q 79.197 8.225 79.297 9.296 A 12.556 12.556 0 0 1 79.35 10.47 Z M 24.63 14.64 L 27.12 17.34 A 7.333 7.333 0 0 1 23.28 19.627 Q 22.08 19.93 20.651 19.949 A 14.472 14.472 0 0 1 20.46 19.95 A 11.927 11.927 0 0 1 17.888 19.684 A 9.482 9.482 0 0 1 15.63 18.885 A 8.108 8.108 0 0 1 13.287 17.132 A 7.556 7.556 0 0 1 12.39 15.93 A 7.987 7.987 0 0 1 11.268 12.237 A 9.72 9.72 0 0 1 11.25 11.64 A 8.581 8.581 0 0 1 11.734 8.73 A 7.926 7.926 0 0 1 12.375 7.365 Q 13.5 5.46 15.465 4.395 A 8.865 8.865 0 0 1 18.985 3.367 A 10.765 10.765 0 0 1 19.89 3.33 A 9.463 9.463 0 0 1 22.709 3.74 A 8.5 8.5 0 0 1 24.09 4.305 Q 25.98 5.28 27.105 7.125 A 7.626 7.626 0 0 1 28.119 9.972 A 10.013 10.013 0 0 1 28.23 11.49 L 16.29 13.8 Q 16.8 15 17.895 15.6 A 4.662 4.662 0 0 0 19.197 16.068 Q 19.755 16.184 20.395 16.198 A 8.2 8.2 0 0 0 20.58 16.2 A 7.22 7.22 0 0 0 21.734 16.112 A 5.415 5.415 0 0 0 22.815 15.825 A 5.185 5.185 0 0 0 24.202 15.018 A 6.284 6.284 0 0 0 24.63 14.64 Z M 43.08 3.57 L 47.76 3.57 L 47.76 19.71 L 43.29 19.71 L 43.29 17.85 A 5.629 5.629 0 0 1 39.983 19.784 A 8.568 8.568 0 0 1 38.25 19.95 A 8.784 8.784 0 0 1 35.507 19.531 A 7.952 7.952 0 0 1 34.125 18.93 Q 32.28 17.91 31.23 16.02 A 8.286 8.286 0 0 1 30.283 13.138 A 10.61 10.61 0 0 1 30.18 11.64 Q 30.18 9.15 31.23 7.26 Q 32.28 5.37 34.125 4.35 A 8.236 8.236 0 0 1 37.687 3.346 A 9.846 9.846 0 0 1 38.25 3.33 A 7.862 7.862 0 0 1 40.297 3.582 A 5.591 5.591 0 0 1 43.08 5.28 L 43.08 3.57 Z M 8.58 15.63 L 9.81 18.93 A 4.251 4.251 0 0 1 8.934 19.423 A 5.706 5.706 0 0 1 8.115 19.695 Q 7.11 19.95 6.03 19.95 A 9.228 9.228 0 0 1 4.285 19.795 Q 2.614 19.473 1.56 18.48 A 4.688 4.688 0 0 1 0.288 16.354 Q 0 15.385 0 14.16 L 0 0 L 4.68 0 L 4.68 3.93 L 8.67 3.93 L 8.67 7.53 L 4.68 7.53 L 4.68 14.1 A 3.273 3.273 0 0 0 4.735 14.719 Q 4.803 15.074 4.957 15.352 A 1.686 1.686 0 0 0 5.19 15.675 Q 5.7 16.23 6.66 16.23 Q 7.74 16.23 8.58 15.63 Z M 39.06 16.11 A 4.224 4.224 0 0 0 40.628 15.827 A 3.87 3.87 0 0 0 42 14.895 A 4.082 4.082 0 0 0 43.055 12.836 A 5.938 5.938 0 0 0 43.17 11.64 A 5.757 5.757 0 0 0 43.009 10.24 A 4.032 4.032 0 0 0 42 8.385 A 3.892 3.892 0 0 0 39.17 7.171 A 5.077 5.077 0 0 0 39.06 7.17 A 4.366 4.366 0 0 0 37.558 7.419 A 3.842 3.842 0 0 0 36.09 8.385 A 4.082 4.082 0 0 0 35.035 10.444 A 5.938 5.938 0 0 0 34.92 11.64 A 5.757 5.757 0 0 0 35.081 13.04 A 4.032 4.032 0 0 0 36.09 14.895 A 3.913 3.913 0 0 0 38.893 16.107 A 5.206 5.206 0 0 0 39.06 16.11 Z M 15.84 11.16 L 23.7 9.63 Q 23.37 8.37 22.35 7.62 A 3.839 3.839 0 0 0 20.542 6.911 A 5.016 5.016 0 0 0 19.89 6.87 A 4.477 4.477 0 0 0 18.537 7.065 A 3.624 3.624 0 0 0 17.01 8.01 A 3.934 3.934 0 0 0 16.047 9.722 Q 15.863 10.375 15.84 11.16 Z"
                vector-effect="non-scaling-stroke"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>

    <app-system-info />

    <router-outlet />

    <app-toasts aria-live="polite" aria-atomic="true" />
  `,
  standalone: true,
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ToastsContainerComponent, LoadingBarRouterModule, SystemInfoComponent],
})
export class AppComponent {
  @ViewChild('spinnerElement')
  spinnerElement!: ElementRef;

  loaded$ = new Subject<boolean>();

  private _navigationInterceptor(event: Event): void {
    if (event instanceof NavigationStart) {
      this.renderer.setStyle(this.spinnerElement.nativeElement, 'display', 'flex');
    }
    if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
      this.renderer.setStyle(this.spinnerElement.nativeElement, 'display', 'none');
      this.loaded$.next(true);
    }
  }

  constructor(
    router: Router,
    private renderer: Renderer2,
  ) {
    router.events.pipe(takeUntil(this.loaded$)).subscribe((event) => this._navigationInterceptor(event));

    if (EnvironmentHelper.getProduction()) {
      console.log(`
           .--.       .--.
 _  \`    \\     /    \`  _
  \`\\.===. \\.^./ .===./\`
         \\/\`"\`\\/
      ,  |     |  ,
     / \`\\|;-.-'|/\` \\
    /    |::\\  |    \\
 .-' ,-'\`|:::; |\`'-, '-.
     |   |::::\\|   |
     |   |::::;|   |
     |   \\:::://   |
     |    \`.://'   |
    .'             \`.
 _,'                 \`,_

 Hello nice fellow, debugging "compiled" Angular apps is not fun!\n
 Visit https://github.com/DatePollSystems/WaiterRobot-Web for the source code.
      `);
    }
  }
}
