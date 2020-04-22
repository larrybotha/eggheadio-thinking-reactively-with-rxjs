import { Subject, combineLatest, merge, timer } from "rxjs";
import {
  distinctUntilChanged,
  tap,
  filter,
  mapTo,
  pairwise,
  scan,
  shareReplay,
  startWith,
  switchMap,
  takeUntil,
} from "rxjs/operators";

const taskStart$ = new Subject();
const taskCompleted$ = new Subject();

const taskStarted = () => {
  taskStart$.next();
};

const taskCompleted = () => {
  taskCompleted$.next();
};

const taskIncrement$ = taskStart$.pipe(mapTo(1));
const taskDecrement$ = taskCompleted$.pipe(mapTo(-1));

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxxXXXX

const taskIncDec$ = merge(taskIncrement$, taskDecrement$);

const activeTasksCount$ = taskIncDec$.pipe(
  startWith(0),
  scan((acc, incDec) => Math.max(0, acc + incDec)),
  distinctUntilChanged(),
  shareReplay({ bufferSize: 1, refCount: true })
);

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

/**
 * Define a threshold for when to make the loader visible, and for how long the
 loader should be visible
 */
const loaderVisibleThreshold$ = timer(2000);

const someTasksActive$ = activeTasksCount$.pipe(
  pairwise(),
  filter(([prevCount, currCount]) => prevCount === 0 && currCount === 1)
);
const allTasksCompleted$ = activeTasksCount$.pipe(filter(count => count === 0));

/**
 * hide the loader when these two events occur:
 *
 * - there are no more events
 * - the loader has been visible for at least the visibility threshold
 *
 * combineLatest only emits when when all streams emit an event. It emits a
 * tuple of the events, but we're not concerned with that in this case
 */
const loaderHidden$ = combineLatest(
  // all tasks must be complete, and ...
  allTasksCompleted$,
  // the minimum amount of time the loader must show must have elapsed
  loaderVisibleThreshold$
);

const loaderVisible$ = someTasksActive$.pipe(
  switchMap(() => loaderVisibleThreshold$.pipe(takeUntil(loaderHidden$)))
);

export {
  activeTasksCount$,
  loaderHidden$,
  loaderVisible$,
  taskCompleted,
  taskStarted,
};
