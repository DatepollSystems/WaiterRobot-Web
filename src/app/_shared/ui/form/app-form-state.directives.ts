import {Directive, inject, Input, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[isCreating]',
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

@Directive({
  selector: '[isEditing]',
})
export class AppIsEditingDirective {
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<unknown>);

  @Input() set isEditing(entity: unknown) {
    if (entity === 'CREATE') {
      this.viewContainerRef.clear();
      return;
    }
    this.viewContainerRef.clear();
    this.viewContainerRef.createEmbeddedView(this.templateRef);
  }

  static ngTemplateGuard_isEditing<T>(dir: AppIsEditingDirective, state: T): state is Exclude<T, 'CREATE'> {
    return true;
  }
}
