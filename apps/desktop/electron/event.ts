import { EventEmitter } from 'events';

import { ClientEventDetailMap, ClientEventHandlersEventMap, EventName } from './types';

type EventClientListener<
  T extends keyof ClientEventHandlersEventMap = keyof ClientEventHandlersEventMap,
> = {
  eventName: T,
  listener: (event: ClientEventHandlersEventMap[T]) => void,
};

export const isEventName = (eventName: EventName) => Object.values(EventName).includes(eventName);

class EventClient {
  private eventTarget = new EventEmitter();

  private listeners: EventClientListener[] = [];

  /**
   * Add a event handler
   */
  public on<K extends keyof ClientEventHandlersEventMap>(
    eventName: K, listener: (event: ClientEventHandlersEventMap[K]) => void,
  ) {
    if (!isEventName(eventName)) {
      throw new Error('invalid event name');
    }

    if (typeof listener !== 'function') {
      throw new Error('listener must be function');
    }

    this.listeners.push({
      eventName,
      listener,
    } as EventClientListener);

    return this.eventTarget.on(eventName, listener);
  }

  /**
   * Remove a event handler
   */
  public off<K extends keyof ClientEventHandlersEventMap>(
    eventName: K,
    listener: (event: ClientEventHandlersEventMap[K]) => void,
  ) {
    if (!isEventName(eventName)) {
      throw new Error('invalid event name');
    }

    if (typeof listener !== 'function') {
      throw new Error('listener must be function');
    }

    return this.eventTarget.off(eventName, listener);
  }

  public emit<K extends keyof ClientEventDetailMap>(
    eventName: K,
    detail?: ClientEventDetailMap[K],
  ) {
    return this.eventTarget.emit(eventName, { detail });
  }

  public dispose() {
    this.listeners.forEach(({ eventName, listener }) => {
      this.eventTarget.off(eventName, listener);
    });
    this.listeners = [];
  }
}

export default EventClient;
