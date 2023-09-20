import {Directive, inject, Input, NgModule, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[isEditingAndDeleted]',
  standalone: true,
})
export class AppIsEditingAndDeletedDirective {
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<unknown>);

  @Input() set isEditingAndDeleted(entity: unknown) {
    if (entity === 'CREATE' || (entity as {deleted?: string})?.deleted === undefined) {
      this.viewContainerRef.clear();
      return;
    }
    this.viewContainerRef.clear();
    this.viewContainerRef.createEmbeddedView(this.templateRef);
  }

  static ngTemplateGuard_isEditingAndDeleted<T>(dir: AppIsEditingAndNotDeletedDirective, state: T): state is Exclude<T, 'CREATE'> {
    return true;
  }
}

@Directive({
  selector: '[isEditingAndNotDeleted]',
  standalone: true,
})
export class AppIsEditingAndNotDeletedDirective {
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<unknown>);

  @Input() set isEditingAndNotDeleted(entity: unknown) {
    if (entity === 'CREATE' || (entity as {deleted?: string})?.deleted !== undefined) {
      this.viewContainerRef.clear();
      return;
    }
    this.viewContainerRef.clear();
    this.viewContainerRef.createEmbeddedView(this.templateRef);
  }

  static ngTemplateGuard_isEditingAndNotDeleted<T>(dir: AppIsEditingAndNotDeletedDirective, state: T): state is Exclude<T, 'CREATE'> {
    return true;
  }
}

@NgModule({
  imports: [AppIsEditingAndDeletedDirective, AppIsEditingAndNotDeletedDirective],
  exports: [AppIsEditingAndDeletedDirective, AppIsEditingAndNotDeletedDirective],
})
export class AppDeletedDirectives {}
