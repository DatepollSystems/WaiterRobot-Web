import {Directive, inject, Input, NgModule, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[isEditingAndDeleted]',
  standalone: true,
})
export class AppIsEditingAndDeletedDirective {
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<unknown>);

  @Input() set isEditingAndDeleted(entity: unknown) {
    if (!(entity as {deleted?: string}).deleted) {
      this.viewContainerRef.clear();
      return;
    }
    this.viewContainerRef.clear();
    this.viewContainerRef.createEmbeddedView(this.templateRef);
  }

  static ngTemplateGuard_isEditingAndDeleted<T>(dir: AppIsEditingAndDeletedDirective, state: T): state is Exclude<T, 'CREATE'> {
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
    if (entity === 'CREATE' || !!(entity as {deleted?: string}).deleted) {
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

@Directive({
  selector: '[isNotDeleted]',
  standalone: true,
})
export class AppIsNotDeletedDirective {
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<unknown>);

  @Input() set isNotDeleted(entity: unknown) {
    if ((entity as {deleted?: string}).deleted) {
      this.viewContainerRef.clear();
      return;
    }
    this.viewContainerRef.clear();
    this.viewContainerRef.createEmbeddedView(this.templateRef);
  }
}

@NgModule({
  imports: [AppIsEditingAndDeletedDirective, AppIsEditingAndNotDeletedDirective, AppIsNotDeletedDirective],
  exports: [AppIsEditingAndDeletedDirective, AppIsEditingAndNotDeletedDirective, AppIsNotDeletedDirective],
})
export class AppDeletedDirectives {}
