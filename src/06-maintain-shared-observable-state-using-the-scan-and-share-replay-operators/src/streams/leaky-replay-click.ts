import { shareReplay } from "rxjs/operators";

import { createClickStream } from "./base-click-stream";

const leakyClickStreamFactory = (node: HTMLButtonElement) => {
  const click$ = createClickStream(node);

  /**
   * This stream improves sharing on the 'share' operator by replaying the most
   * recent event to new subscribers
   *
   * The caveat with passing a value in for the number of values to replay is
   * that once all subscribers unsubscribe, the source stream doesn't complete.
   *
   * Any events the source is subscribed to are still captured, which can result
   * in memory leaks.
   *
   * Usually one doesn't want mysterious streams subscribed in the background.
   * To overcome this, prefer passing a config to shareReplay instead of a
   * number:
   *
   * shareReplay({bufferSize: 1, refCount: true})
   *
   * refCount keeps track of its number of subscribers, and once that count hits
   * 0, it disposes of its source, completing the stream
   */
  const clickCount$ = click$.pipe(shareReplay(1));

  return clickCount$;
};

export { leakyClickStreamFactory };
