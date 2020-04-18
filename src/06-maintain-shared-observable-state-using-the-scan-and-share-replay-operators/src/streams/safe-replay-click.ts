import { shareReplay } from "rxjs/operators";

import { createClickStream } from "./base-click-stream";

const safeClickStreamFactory = (node: HTMLButtonElement) => {
  const click$ = createClickStream(node);

  /**
   * Passing a config allows one to express how the stream behaves once all
   * subscribers have unsubscribed.
   *
   * By default, shareReplay will keep the source stream open, which can result
   * in memory leaks.
   *
   * To prevent this, we specify `refCount: true`, which indicates to the stream
   * that it should complete when it has no more subscribers.
   *
   * Any new subscribers will then result in a new stream starting with new
   * events
   */
  const clickCount$ = click$.pipe(
    shareReplay({
      // number of events to emit to new subscribers
      bufferSize: 1,
      // complete the stream when the number of subscribers reaches 0
      refCount: true,
    })
  );

  return clickCount$;
};

export { safeClickStreamFactory };
