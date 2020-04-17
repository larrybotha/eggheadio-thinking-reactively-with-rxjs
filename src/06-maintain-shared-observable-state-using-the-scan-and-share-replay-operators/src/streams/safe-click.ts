import { fromEvent } from "rxjs";
import { mapTo, scan, shareReplay } from "rxjs/operators";

const safeClickStreamFactory = (node: HTMLButtonElement) => {
  const click$ = fromEvent(node, "click");

  const clickCount$ = click$.pipe(
    mapTo(1),
    scan((acc, inc) => acc + inc, 0),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  return clickCount$;
};

export { safeClickStreamFactory };
