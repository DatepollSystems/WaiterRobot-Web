import {booleanAttribute, ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  template: `
    <div class="mt-1">
      @if (!hidden) {
        <div class="progress-bar">
          <div class="progress-bar-value"></div>
        </div>
      } @else {
        <div style="height: 0.25rem"></div>
      }
    </div>
  `,
  styles: `
        .progress-bar {
  height: 0.25rem;
  background-color: rgba(5, 114, 206, 0.2);
  width: 100%;
  overflow: hidden;
}

.progress-bar-value {
  width: 100%;
  height: 100%;
  background-color: rgb(5, 114, 206);
  animation: indeterminateAnimation 1s infinite linear;
  transform-origin: 0% 50%;
}

@keyframes indeterminateAnimation {
  0% {
    transform:  translateX(0) scaleX(0);
  }
  40% {
    transform:  translateX(0) scaleX(0.4);
  }
  100% {
    transform:  translateX(100%) scaleX(0.5);
  }
}
    `,
  selector: 'app-progress-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppProgressBarComponent {
  @Input({transform: booleanAttribute})
  hidden = false;
}
