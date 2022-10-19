import {coerceNumberProperty, NumberInput} from '@angular/cdk/coercion';
import {Component, Input} from '@angular/core';

@Component({
  template: `
    <div class="card clickable" (click)="click()">
      <div class="card-body text-center d-flex flex-column gap-2">
        <h4>
          <ng-content></ng-content>
        </h4>
        <p class="heading">
          {{ countS }}
          <ng-content select="[valuePrefix]"></ng-content>
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .heading {
        font-size: 3rem;
      }
    `,
  ],
  selector: 'app-statistics-count-card',
})
export class CountCardComponent {
  @Input() set count(it: NumberInput) {
    if (it) {
      this._count = coerceNumberProperty(it);
      this.animateCountUp();
    }
  }

  _count = 0;

  // How long you want the animation to take, in ms
  animationDuration = 2000;
  // Calculate how long each ‘frame’ should last if we want to update the animation 60 times per second 1000/60
  frameDuration = 16.6;
  // Use that to calculate how many frames we need to complete the animation
  totalFrames = Math.round(this.animationDuration / this.frameDuration);
  // An ease-out function that slows the count as it progresses
  easeOutQuad = (t: number) => t * (2 - t);

  // The animation function, which takes an Element
  animateCountUp = () => {
    if (this.counterRunning) {
      return;
    }
    this.counterRunning = true;

    let frame = 0;
    const countTo = this._count;
    // Start the animation running 60 times per second
    const counter = setInterval(() => {
      frame++;
      // Calculate our progress as a value between 0 and 1
      // Pass that value to our easing function to get our
      // progress on a curve
      const progress = this.easeOutQuad(frame / this.totalFrames);
      // Use the progress value to calculate the current count
      const currentCount = Math.round(countTo * progress);

      // If the current count has changed, update the element
      if (this.countS !== currentCount) {
        this.countS = currentCount;
      }

      // If we’ve reached our last frame, stop the animation
      if (frame === this.totalFrames) {
        clearInterval(counter);
        this.counterRunning = false;
      }
    }, this.frameDuration);
  };

  countS = 0;
  counterRunning = false;

  click() {
    this.animateCountUp();
  }
}
