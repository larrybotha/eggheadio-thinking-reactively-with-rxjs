import { Observable, merge } from "rxjs";
import { mapTo, scan, startWith, distinctUntilChanged } from "rxjs/operators";

const taskStart$ = new Observable();
const taskCompleted$ = new Observable();
const showLoader$ = new Observable();

const taskIncrement$ = taskStart$.pipe(mapTo(1));
const taskDecrement$ = taskCompleted$.pipe(mapTo(-1));

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxxXXXX

const taskIncDec$ = merge(taskIncrement$, taskDecrement$);

/**
 * Without an event emitted on this stream, consumers of the stream
 * will not get any values until any tasks start
 *
 * We can address this by making the stream emit an event right away
 * with the startWith operator
 */
const activeTasksCount$ = taskIncDec$.pipe(
  startWith(0),
  /**
   * The initial value provided to scan is optional
   *
   * If we don't provide an initial value, scan will use the first value
   * it receives in the stream as the initial value
   *
   * Because we're forcing this stream to emit an event with startWith(0),
   * scan's initial value will be 0
   */
  scan((acc, incDec) => {
    /**
     * Because we have a stream that decrements values, we may end up in a
     * position where we reduce to a negative value.
     *
     * This doesn't make sense for the consumer - what does a negative count of
     * active tasks mean?
     *
     * We can prevent any confusion by ensuring we never go below 0
     */
    return Math.max(0, acc + incDec);
  }),

  /**
   * We don't want to emit the same value multiple times in sequence. This
   * could happen if multiple 0s are emitted
   *
   * To filter the same event being emitted in sequence, we can use the
   * distinctUntilChanged operator
   */
  distinctUntilChanged()
);

/**
 * This stream will emit 0 right away
 */
export { activeTasksCount$ };
