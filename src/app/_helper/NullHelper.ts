export class NullHelper {
  public static nullToUndefined<T>(value: T | null): T | undefined {
    if (value === null) {
      return undefined;
    }
    return value;
  }
}
