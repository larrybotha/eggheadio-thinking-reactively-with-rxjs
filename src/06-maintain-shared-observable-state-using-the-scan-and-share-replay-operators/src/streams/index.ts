import { Observable, merge } from "rxjs";
import {
  distinctUntilChanged,
  mapTo,
  scan,
  shareReplay,
  startWith,
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

export { activeTasksCount$ };
