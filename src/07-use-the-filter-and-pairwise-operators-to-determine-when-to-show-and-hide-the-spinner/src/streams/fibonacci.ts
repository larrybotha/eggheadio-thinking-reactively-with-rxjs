import { interval } from "rxjs";
import { take, map, pairwise, scan, tap, startWith } from "rxjs/operators";

const fib$ = interval(1000).pipe(
  startWith(1),
  pairwise(),
  scan(acc => {
    const [x, y] = acc;

    return [y, x + y];
  }),
  map(([, x]) => x)
);

export { fib$ };
