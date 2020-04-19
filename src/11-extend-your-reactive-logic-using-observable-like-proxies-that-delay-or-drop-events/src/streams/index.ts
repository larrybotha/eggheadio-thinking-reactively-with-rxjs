import { Subject, merge, timer } from "rxjs";
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
  scan((acc, incDec) => {
    return Math.max(0, acc + incDec);
  }),
  distinctUntilChanged(),
  shareReplay({ bufferSize: 1, refCount: true })
);

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

const loaderHidden$ = activeTasksCount$.pipe(filter(count => count === 0));
const loaderVisible$ = activeTasksCount$.pipe(
  pairwise(),
  filter(([prevCount, currCount]) => prevCount === 0 && currCount === 1),
  /**
   * With our previous implementation, our loader would start as soon as there
   * were any tasks in the queue
   *
   * For short-lived tasks, such as tasks that only take a few milliseconds,
   * we would get a bounce on the screen with the loader quickly showing and
   * then hiding
   *
   * To prevent this, we can delay this stream from emitting anything by a set
   * amount of time, and then return it to its prior state when the
   * loaderHidden$ emits an event
   *
   * switchMap works for this:
   *
   * - filter events from activeTasksCount$ that increment from 0 to 1
   * - when an event passes the condition, switch to a new stream that:
   *    - delays emitting an event after 300ms
   *    - completes when loaderHidden$ emits an event
   */
  switchMap(() => timer(300).pipe(takeUntil(loaderHidden$)))
);

export {
  activeTasksCount$,
  loaderHidden$,
  loaderVisible$,
  taskCompleted,
  taskStarted,
};
