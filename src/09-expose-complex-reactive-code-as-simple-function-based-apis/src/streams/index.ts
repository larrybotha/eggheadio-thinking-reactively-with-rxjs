import { Observable, Subject, merge } from "rxjs";
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
const showLoader$ = new Observable();

/**
 * we want anything provided to be considered a task:
 *
 * - long executing functions
 * - other observables
 * - promises
 *
 * One way to achieve this is by exporting a function which emits an event. The
 * user can then pair this function with the execution of the task, and do the
 * same with the accompanying taskCompleted function when the task completes
 */
const taskStarted = () => {
  /**
   * There's likely a better way to do this - xstream calls this
   * shamefullySendNext because streams should be built in such a way that they
   * shouldn't have to emit events themselves
   */
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

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxxXXXX

const loaderHidden$ = activeTasksCount$.pipe(
  filter(count => count === 0),
  tap(xs => console.log("loaderHidden$", xs))
);
const loaderVisible$ = activeTasksCount$.pipe(
  pairwise(),
  filter(([prevCount, currCount]) => prevCount === 0 && currCount === 1)
);

loaderVisible$
  .pipe(
    tap(xs => console.log("loaderVisible$", xs)),
    switchMap(() =>
      showLoader$.pipe(
        tap(x => console.log("showLoader$", x)),
        takeUntil(loaderHidden$)
      )
    )
  )
  .subscribe();

export { activeTasksCount$, taskStarted, taskCompleted };
