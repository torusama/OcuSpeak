import type { EngineEventMap, EngineEventName } from './types';

type Handler<K extends EngineEventName> = (payload: EngineEventMap[K]) => void;

/** Event bus nhỏ, gõ kiểu chặt — không phụ thuộc thư viện ngoài. */
export class EventBus {
  private handlers: { [K in EngineEventName]?: Set<Handler<K>> } = {};

  on<K extends EngineEventName>(event: K, handler: Handler<K>): () => void {
    if (!this.handlers[event]) {
      (this.handlers as Record<EngineEventName, Set<Handler<EngineEventName>>>)[event] = new Set();
    }
    (this.handlers[event] as Set<Handler<K>>).add(handler);
    return () => this.off(event, handler);
  }

  off<K extends EngineEventName>(event: K, handler: Handler<K>): void {
    (this.handlers[event] as Set<Handler<K>> | undefined)?.delete(handler);
  }

  emit<K extends EngineEventName>(event: K, payload: EngineEventMap[K]): void {
    (this.handlers[event] as Set<Handler<K>> | undefined)?.forEach((handler) => {
      try {
        handler(payload);
      } catch (error) {
        // Một handler lỗi không được làm gãy vòng lặp xử lý frame của engine.
        console.error(`[eye-engine] handler lỗi cho sự kiện "${event}"`, error);
      }
    });
  }

  clear(): void {
    this.handlers = {};
  }
}
