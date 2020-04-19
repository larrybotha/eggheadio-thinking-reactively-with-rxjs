import { Observable, merge } from "rxjs";
import {
  distinctUntilChanged,
  filter,
  mapTo,
  pairwise,
  scan,
  shareReplay,
  startWith,
  switchMap,
  takeUntil,
} from "rxjs/operators";

const taskStart$ = new Observable();
const taskCompleted$ = new Observable();
const showLoader$ = new Observable();

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
const loaderHidden$ = activeTasksCount$.pipe(
  // only emit events when the counter is 0
  filter(count => count === 0)
);
const loaderVisible$ = activeTasksCount$.pipe(
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

loaderVisible$
  /**
   * switchMap switches from the source stream to the returned stream
   *
   * In this case loaderVisible$ will switch to showLoader$ when loaderVisible$
   * emits an event. showLoader$ will be completed once loaderHidden$ emits a
   * value.
   */
  .pipe(switchMap(() => showLoader$.pipe(takeUntil(loaderHidden$))))
  /**
   * This stream will be subscribed to indefinitely once this file is imported
   */
  .subscribe();

export { activeTasksCount$ };
