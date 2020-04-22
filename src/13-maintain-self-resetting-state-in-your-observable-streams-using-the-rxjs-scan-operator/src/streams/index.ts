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

const loadStats$ = activeTasksCount$.pipe(
  scan(
    (acc, count) => {
      const { prev, total, complete } = acc;
      const removedTask = count < prev;
      const addedTask = count > prev;

      console.log(acc);

      return {
	total: addedTask ? total + 1 : total,
	complete: removedTask ? complete + 1 : complete,
	prev: count,
      };
    },
    { total: 0, complete: 0, prev: 0 }
  )
);

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

const loaderVisibleThreshold$ = timer(2000);

const someTasksActive$ = activeTasksCount$.pipe(
  pairwise(),
  filter(([prevCount, currCount]) => prevCount === 0 && currCount === 1)
);
const allTasksCompleted$ = activeTasksCount$.pipe(filter(count => count === 0));

const loaderHidden$ = combineLatest(
  allTasksCompleted$,
  loaderVisibleThreshold$
);

const loaderVisible$ = someTasksActive$.pipe(
  switchMap(() => loaderVisibleThreshold$.pipe(takeUntil(loaderHidden$)))
);

const loaderWithStats$ = loaderVisible$.pipe(
  switchMap(() => loadStats$.pipe(takeUntil(loaderHidden$)))
);

export {
  activeTasksCount$,
  loaderHidden$,
  loaderVisible$,
  taskCompleted,
  loaderWithStats$,
  taskStarted,
};
