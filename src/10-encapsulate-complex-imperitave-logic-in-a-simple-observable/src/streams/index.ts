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
  filter(([prevCount, currCount]) => prevCount === 0 && currCount === 1)
);

export {
  activeTasksCount$,
  loaderHidden$,
  loaderVisible$,
  taskCompleted,
  taskStarted,
};
