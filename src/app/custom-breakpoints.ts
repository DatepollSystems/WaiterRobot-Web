import {BREAKPOINT} from '@angular/flex-layout';

const BREAKPOINTS = [
  {
    alias: 'xs',
    suffix: 'xs',
    mediaQuery: '(max-width: 575px)',
    overlapping: false,
  },
  {
    alias: 'gt-xs',
    suffix: 'gt-xs',
    mediaQuery: '(min-width: 576px)',
    overlapping: false,
  },
  // Same as xs
  {
    alias: 'lt-sm',
    suffix: 'lt-sm',
    mediaQuery: '(max-width: 575px)',
    overlapping: false,
  },
  {
    alias: 'sm',
    suffix: 'sm',
    mediaQuery: '(min-width: 576px) and (max-width: 767px)',
    overlapping: false,
  },
  {
    alias: 'gt-sm',
    suffix: 'gt-sm',
    mediaQuery: '(min-width: 768px)',
    overlapping: false,
  },
  {
    alias: 'lt-md',
    suffix: 'lt-md',
    mediaQuery: '(max-width: 767px)',
    overlapping: false,
  },
  {
    alias: 'md',
    suffix: 'md',
    mediaQuery: '(min-width: 768px) and (max-width: 991px)',
    overlapping: false,
  },
  {
    alias: 'gt-md',
    suffix: 'gt-md',
    mediaQuery: '(min-width: 992px)',
    overlapping: false,
  },
  {
    alias: 'lt-lg',
    suffix: 'lt-lg',
    mediaQuery: '(max-width: 991px)',
    overlapping: false,
  },
  {
    alias: 'lg',
    suffix: 'lg',
    mediaQuery: '(min-width: 992px) and (max-width: 1199px)',
    overlapping: false,
  },
  {
    alias: 'gt-lg',
    suffix: 'gt-lg',
    mediaQuery: '(min-width: 1200px)',
    overlapping: false,
  },
  {
    alias: 'lt-xl',
    suffix: 'lt-xl',
    mediaQuery: '(max-width: 1199px)',
    overlapping: false,
  },
  {
    alias: 'xl',
    suffix: 'xl',
    mediaQuery: '(min-width: 1200px)', //and (max-width: 1399px)
    overlapping: false,
  },
  // {
  //   alias: 'gt-xl',
  //   suffix: 'gt-xl',
  //   mediaQuery: '(min-width: 1400px)',
  //   overlapping: false,
  // },
  // {
  //   alias: 'lt-xxl',
  //   suffix: 'lt-xxl',
  //   mediaQuery: '(max-width: 1399px)',
  //   overlapping: false,
  // },
  // {
  //   alias: 'xxl',
  //   suffix: 'xxl',
  //   mediaQuery: '(min-width: 1400px)',
  //   overlapping: false,
  // }
];

export const CUSTOM_BREAKPOINT_PROVIDER = {
  provide: BREAKPOINT,
  useValue: BREAKPOINTS,
  multi: true,
};

// Bootstrap layout style
// // Hide
// const customGtXLHideInput = ['fxHide.gt-xl'];
//
// @Directive({selector: '[fxHide.gt-xl]', inputs: customGtXLHideInput})
// export class CustomGtXLHideDirective extends ShowHideDirective {
//   protected inputs = customGtXLHideInput;
// }
//
// const customLtXLHideInput = ['fxHide.lt-xxl'];
//
// @Directive({selector: '[fxHide.lt-xxl]', inputs: customLtXLHideInput})
// export class CustomLtXXLHideDirective extends ShowHideDirective {
//   protected inputs = customLtXLHideInput;
// }
//
// const customXXLHideInput = ['fxHide.xxl'];
//
// @Directive({selector: '[fxHide.xxl]', inputs: customXXLHideInput})
// export class CustomXXLHideDirective extends ShowHideDirective {
//   protected inputs = customXXLHideInput;
// }
//
// // Show
// const customGtXLShowInput = ['fxShow.gt-xl'];
//
// @Directive({selector: '[fxShow.gt-xl]', inputs: customGtXLShowInput})
// export class CustomGtXLShowDirective extends ShowHideDirective {
//   protected inputs = customGtXLShowInput;
// }
//
// const customLtXLShowInput = ['fxShow.lt-xxl'];
//
// @Directive({selector: '[fxShow.lt-xxl]', inputs: customLtXLShowInput})
// export class CustomLtXXLShowDirective extends ShowHideDirective {
//   protected inputs = customLtXLShowInput;
// }
//
// const customXXLShowInput = ['fxShow.xxl'];
//
// @Directive({selector: '[fxShow.xxl]', inputs: customXXLShowInput})
// export class CustomXXLShowDirective extends ShowHideDirective {
//   protected inputs = customXXLShowInput;
// }
//
// // Layout
// const customGtXLLayoutInput = ['fxLayout.gt-xl'];
//
// @Directive({selector: '[fxLayout.gt-xl]', inputs: customGtXLLayoutInput})
// export class CustomGtXLLayoutDirective extends LayoutDirective {
//   protected inputs = customGtXLLayoutInput;
// }
//
// const customLtXXLLayoutInput = ['fxLayout.lt-xxl'];
//
// @Directive({selector: '[fxLayout.lt-xxl]', inputs: customLtXXLLayoutInput})
// export class CustomLtXXLLayoutDirective extends LayoutDirective {
//   protected inputs = customLtXXLLayoutInput;
// }
//
// const customXXLLayoutInput = ['fxLayout.xxl'];
//
// @Directive({selector: '[fxLayout.xxl]', inputs: customXXLLayoutInput})
// export class CustomXXLLayoutDirective extends LayoutDirective {
//   protected inputs = customXXLLayoutInput;
// }
//
// // Flex
// const customGtXLFlexInput = ['fxFlex.gt-xl'];
// @Directive({selector: '[fxFlex.gt-xl]', inputs: customGtXLFlexInput})
// export class CustomGtXLFlexDirective extends FlexDirective {
//   protected inputs = customGtXLFlexInput;
// }
//
// const customLtXXLFlexInput = ['fxFlex.lt-xxl'];
// @Directive({selector: '[fxFlex.lt-xxl]', inputs: customLtXXLFlexInput})
// export class CustomLtXXLFlexDirective extends FlexDirective {
//   protected inputs = customLtXXLFlexInput;
// }
//
// const customXXLFlexInput = ['fxFlex.xxl'];
// @Directive({selector: '[fxFlex.xxl]', inputs: customXXLFlexInput})
// export class CustomXXLFlexDirective extends FlexDirective {
//   protected inputs = customXXLFlexInput;
// }
//
//
//
// @NgModule({
//   declarations: [
//     CustomGtXLHideDirective,
//     CustomLtXXLHideDirective,
//     CustomXXLHideDirective,
//     CustomGtXLShowDirective,
//     CustomLtXXLShowDirective,
//     CustomXXLShowDirective,
//     CustomGtXLLayoutDirective,
//     CustomLtXXLLayoutDirective,
//     CustomXXLLayoutDirective,
//     CustomGtXLFlexDirective,
//     CustomLtXXLFlexDirective,
//     CustomXXLFlexDirective
//   ],
//   exports: [
//     CustomGtXLHideDirective,
//     CustomLtXXLHideDirective,
//     CustomXXLHideDirective,
//     CustomGtXLShowDirective,
//     CustomLtXXLShowDirective,
//     CustomXXLShowDirective,
//     CustomGtXLLayoutDirective,
//     CustomLtXXLLayoutDirective,
//     CustomXXLLayoutDirective,
//     CustomGtXLFlexDirective,
//     CustomLtXXLFlexDirective,
//     CustomXXLFlexDirective
//   ],
// })
// export class CustomFlexLayoutModule {
// }
