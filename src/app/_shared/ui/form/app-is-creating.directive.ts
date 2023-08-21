import {Directive, inject, Input, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[isCreating]',
  standalone: true,
})
export class AppIsCreatingDirective {
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<unknown>);

  @Input() set isCreating(entity: unknown) {
    if (entity !== 'CREATE') {
      this.viewContainerRef.clear();
      return;
    }
    this.viewContainerRef.clear();
    this.viewContainerRef.createEmbeddedView(this.templateRef);
  }

  static ngTemplateGuard_isCreating<T>(dir: AppIsCreatingDirective, state: T): state is T {
    return true;
  }
}
