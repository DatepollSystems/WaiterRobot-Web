export type QrCodePurpose = 'WAITER_SIGN_IN' | 'WAITER_CREATE';

export class QrCodeModel {
  constructor(public readonly purpose: QrCodePurpose, public readonly token: string) {}

  public toString() {
    return JSON.stringify(this);
  }

  public static waiterSignIn(token: string) {
    return new QrCodeModel('WAITER_SIGN_IN', token);
  }

  public static waiterCreate(token: string) {
    return new QrCodeModel('WAITER_CREATE', token);
  }
}
