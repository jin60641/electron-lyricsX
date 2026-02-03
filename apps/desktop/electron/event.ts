import { ClientEvent, EventName } from './types';

const events = require('events');

type EventClientListener<
  T extends keyof ClientEvent.HandlersEventMap = keyof ClientEvent.HandlersEventMap,
> = {
  eventName: T,
  listener: (event: ClientEvent.HandlersEventMap[T]) => void,
};

export const isEventName = (eventName: EventName) => Object.values(EventName).includes(eventName);

class EventClient {
  private eventTarget = new events.EventEmitter();

  private listeners: EventClientListener[] = [];

  /**
   * Add a event handler
   */
  public on<K extends keyof ClientEvent.HandlersEventMap>(
    eventName: K, listener: (event: ClientEvent.HandlersEventMap[K]) => void,
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
  public off<K extends keyof ClientEvent.HandlersEventMap>(
    eventName: K,
    listener: (event: ClientEvent.HandlersEventMap[K]) => void,
  ) {
    if (!isEventName(eventName)) {
      throw new Error('invalid event name');
    }

    if (typeof listener !== 'function') {
      throw new Error('listener must be function');
    }

    return this.eventTarget.off(eventName, listener);
  }

  public emit<K extends keyof ClientEvent.DetailMap>(
    eventName: K,
    detail?: ClientEvent.DetailMap[K],
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
