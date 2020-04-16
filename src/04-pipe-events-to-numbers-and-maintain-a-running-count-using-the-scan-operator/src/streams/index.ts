import { Observable, merge } from "rxjs";
import { mapTo, scan } from "rxjs/operators";

const taskStart$ = new Observable();
const taskCompleted$ = new Observable();
const showLoader$ = new Observable();

/**
 * map each event on taskStart$ to 1, and -1 when a task completes
 */
const taskIncrement$ = taskStart$.pipe(mapTo(1));
const taskDecrement$ = taskCompleted$.pipe(mapTo(-1));

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxxXXXX

/**
 * We create a new observable by merging the two streams
 *
 * This observable will emit all events from all streams as they happen
 */
const taskIncDec$ = merge(taskIncrement$, taskDecrement$);

/**
 * We take the task increment / decrement stream, and reduce it.
 *
 * scan behaves in the same way as [].reduce
 */
const activeTasksCount$ = taskIncDec$.pipe(
  scan((acc, incDec) => acc + incDec, 0)
);

/**
 * This stream will not emit anything until one of the streams it is composed of
 * emit a value.
 */
export { activeTasksCount$ };
