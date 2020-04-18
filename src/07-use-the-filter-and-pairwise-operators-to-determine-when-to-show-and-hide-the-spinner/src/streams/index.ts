import { Observable, merge } from "rxjs";
import {
  distinctUntilChanged,
  mapTo,
  scan,
  shareReplay,
  startWith,
  filter,
  pairwise,
} from "rxjs/operators";

const taskStart$ = new Observable();
const taskCompleted$ = new Observable();

const taskIncrement$ = taskStart$.pipe(mapTo(1));
const taskDecrement$ = taskCompleted$.pipe(mapTo(-1));

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxxXXXX

const taskIncDec$ = merge(taskIncrement$, taskDecrement$);

const activeTasksCount$ = taskIncDec$.pipe(
  startWith(0),
  scan((acc, incDec) => {
    return Math.max(0, acc + incDec);
  }),
  distinctUntilChanged(),
  shareReplay({ bufferSize: 1, refCount: true })
);

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxxXXXX

/**
 * We need two more streams:
 *
 * - one that indicates the loader should be shown
 * - one that indicates the loader should be hidden
 */
const hideLoader$ = activeTasksCount$.pipe(
  // only emit events when the counter is 0
  filter(count => count === 0)
);
const showLoader$ = activeTasksCount$.pipe(
  /**
   * Combine the two most recent events into a tuple
   */
  pairwise(),
  /**
   * filter now receives a tuple containing the previous value, and the current
   * value
   *
   * We can ensure this stream only emits an event when the previous count was
   * 0, and the current is 1. i.e. a first task has started
   */
  filter(([prevCount, currCount]) => prevCount === 0 && currCount === 1)
);

export { activeTasksCount$, hideLoader$, showLoader$ };
