type HoverCallback = (element: HTMLElement | null) => void;

class HoverEngine {
  private callback: HoverCallback | null = null;

  setListener(callback: HoverCallback) {
    this.callback = callback;
  }

  update(screenX: number, screenY: number) {
    const element = document.elementFromPoint(screenX, screenY);

    if (this.callback) {
      this.callback(element as HTMLElement | null);
    }
  }
}

export default new HoverEngine();