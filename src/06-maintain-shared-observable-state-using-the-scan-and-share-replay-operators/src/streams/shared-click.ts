import { share } from "rxjs/operators";

import { createClickStream } from "./base-click-stream";

const sharedClickStreamFactory = (node: HTMLButtonElement) => {
  const click$ = createClickStream(node);

  /**
   * This stream will now share its events, with the caveat that new subscribers
   * will only receive an event once the source emits again. This means that new
   * subscribers are in a position where they don't have any value, despite sharing
   * a stream that may already have emitted events
   *
   * In order for new subscribers to get the latest event, we need to 'replay' that
   * event to them when the subscribe. This can be done with the shareReplay
   * operator
   *
   * When all subsribers unsubscribe, the stream will complete, and any new
   * subscribers will receive events from a new stream
   */
  const clickCount$ = click$.pipe(share());

  return clickCount$;
};

export { sharedClickStreamFactory };
