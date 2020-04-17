import { fromEvent } from "rxjs";
import { mapTo, scan, shareReplay } from "rxjs/operators";

const leakyClickStreamFactory = (node: HTMLButtonElement) => {
  const click$ = fromEvent(node, "click");

  const clickCount$ = click$.pipe(
    mapTo(1),
    scan((acc, inc) => acc + inc, 0),
    shareReplay(1)
  );

  return clickCount$;
};

export { leakyClickStreamFactory };
