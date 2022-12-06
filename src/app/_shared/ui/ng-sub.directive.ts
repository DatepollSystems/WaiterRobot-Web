import {ChangeDetectorRef, Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {BehaviorSubject, combineLatest, map, Observable, of, Subject, Subscription} from 'rxjs';

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
export class NgSub<T> implements OnInit, OnDestroy {
  private subscribable$: Array<Observable<T> | BehaviorSubject<T> | Subject<T>>;
  private subscription: Subscription;
  private readonly context: NgSubContext<T>;

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<NgSubContext<T>>,
    private changeDetector: ChangeDetectorRef
  ) {
    this.subscribable$ = [of({} as T)];
    this.subscription = new Subscription();
    this.context = new NgSubContext<T>();
  }

  @Input()
  set ngSub(inputSubscribable: Observable<T> | BehaviorSubject<T> | Subject<T> | Array<Observable<T> | BehaviorSubject<T> | Subject<T>>) {
    const isArray = Array.isArray(inputSubscribable);
    this.subscribable$ = isArray ? inputSubscribable : [inputSubscribable];
    this.subscription.unsubscribe();
    this.subscription = combineLatest(this.subscribable$)
      .pipe(map((values) => (isArray ? values : values[0])))
      .subscribe((values: any) => {
        this.context.$implicit = values;
        this.context.ngSub = values;
        this.changeDetector.markForCheck();
      });
  }

  ngOnInit(): void {
    this.viewContainer.createEmbeddedView(this.templateRef, this.context);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
