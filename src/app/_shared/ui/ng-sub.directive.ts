import {ChangeDetectorRef, Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {ADirective} from 'dfx-helper';

/**
 * Author https://github.com/pauloRohling/ng-sub
 * v0.0.7
 * MIT License
 */

export class NgSubContext<T> {
  public $implicit!: T;
  public ngSub!: T;
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[ngSub]',
  standalone: true,
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class NgSub<T> extends ADirective implements OnInit {
  private subscribable$: Observable<T> | BehaviorSubject<T> | Subject<T>;
  private readonly context: NgSubContext<T>;

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<NgSubContext<T>>,
    private changeDetector: ChangeDetectorRef
  ) {
    super();

    this.subscribable$ = of({} as T);
    this.context = new NgSubContext<T>();
  }

  @Input()
  set ngSub(inputSubscribable: Observable<T> | BehaviorSubject<T> | Subject<T>) {
    this.subscribable$ = inputSubscribable;
    this.unsubscribeAll();
    this.unsubscribe(
      this.subscribable$.subscribe((value) => {
        this.context.$implicit = value;
        this.context.ngSub = value;
        this.changeDetector.markForCheck();
      })
    );
  }

  ngOnInit(): void {
    this.viewContainer.createEmbeddedView(this.templateRef, this.context);
  }
}
