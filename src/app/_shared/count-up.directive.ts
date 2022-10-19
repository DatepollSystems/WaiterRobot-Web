import {coerceNumberProperty, NumberInput} from '@angular/cdk/coercion';
import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[countUp]',
  standalone: true,
})
export class CountUpDirective {
  @Input() set countUp(it: NumberInput) {
    if (it) {
      this._count = coerceNumberProperty(it);
      this.animateCountUp();
    }
  }

  _count = 0;

  /**
   * How long you want the animation to take.
   * @param time time in ms; defaults to <code>4000</code>
   */
  @Input() set animationDuration(time: NumberInput) {
    this._animationDuration = coerceNumberProperty(time);
  }

  _animationDuration = 4000;

  // Calculate how long each ‘frame’ should last if we want to update the animation 60 times per second 1000/60
  frameDuration = 16.6;
  // Use that to calculate how many frames we need to complete the animation
  totalFrames = Math.round(this._animationDuration / this.frameDuration);

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
      if (parseInt(this.el.nativeElement.innerText, 10) !== currentCount) {
        this.el.nativeElement.innerText = currentCount;
      }

      // If we’ve reached our last frame, stop the animation
      if (frame === this.totalFrames) {
        clearInterval(counter);
        this.counterRunning = false;
      }
    }, this.frameDuration);
  };

  counterRunning = false;

  constructor(private el: ElementRef) {}

  @HostListener('mousedown') onMouseDown(): void {
    this.animateCountUp();
  }
}