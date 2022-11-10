import {BooleanInput, coerceBooleanProperty} from '@angular/cdk/coercion';
import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild} from '@angular/core';

@Component({
  template: `
    <div [class.pb-3]="_padding" [class.pt-1]="_padding">
      <div
        #contentWrapper
        id="overflow-container"
        class="d-flex flex-row flex-fill justify-content-sm-start overflow-auto user-select-none gap-3 gap-md-3">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      #overflow-container {
        scroll-snap-type: y mandatory;
        scroll-behavior: smooth;
      }

      .overflow-auto::-webkit-scrollbar {
        display: none;
      }

      /* Hide scrollbar for IE, Edge and Firefox */
      .overflow-auto {
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
      }

      :host(btn-toolbar)::ng-deep.btn {
        word-break: keep-all;
        white-space: nowrap;
      }
    `,
  ],
  selector: 'btn-toolbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppBtnToolbarComponent implements AfterViewInit {
  @ViewChild('contentWrapper') content!: ElementRef;

  @Input() set padding(it: BooleanInput) {
    this._padding = coerceBooleanProperty(it);
  }
  _padding = true;

  ngAfterViewInit(): void {
    for (const child of this.content.nativeElement.children) {
      child.draggable = false;
      child.style.wordBreak = 'keep-all';
      child.style.whitespace = 'no-wrap';
    }

    const slider = document.getElementById('overflow-container');
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    if (!slider) {
      return;
    }

    slider.addEventListener('mousedown', (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => {
      isDown = false;
    });
    slider.addEventListener('mouseup', () => {
      isDown = false;
    });
    slider.addEventListener('mousemove', (e: MouseEvent) => {
      if (!isDown) {
        return;
      }
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = x - startX; // * 2 scroll-fast
      slider.scrollLeft = scrollLeft - walk;
    });
  }
}
