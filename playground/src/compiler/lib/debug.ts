export class Debug {
  private static debug = true;

  static log(...args: unknown[]) {
    if (Debug.debug) {
      console.log(...args);
    }
  }
}
