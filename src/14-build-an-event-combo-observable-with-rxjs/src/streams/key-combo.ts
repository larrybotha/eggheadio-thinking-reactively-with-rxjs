import { interval, fromEvent, timer } from "rxjs";
import {
  filter,
  map,
  skip,
  switchMap,
  tap,
  take,
  takeUntil,
  takeWhile,
} from "rxjs/operators";

const keySequence = ["q", "w", "e", "e"];

const keyPress$ = fromEvent<KeyboardEvent>(document, "keypress");
const key$ = keyPress$.pipe(map(ev => ev.key));

/**
 * create a stream that emits an event when a specific sequence of keys are
 * pressed:
 *
 * - sequence of keys is correct
 * - sequence is completed within a specific period of time
 */

const createCorrectKeypress$ = (key: KeyboardEvent["key"]) =>
  key$.pipe(filter(k => k === key));

const createRemainingCombo$ = (seq: string[]) =>
  key$.pipe(
    tap(x => console.log(`remaining sequence ${x} pressed`)),
    /**
     * discard this stream if 6s have passed
     */
    takeUntil(timer(6000)),
    /**
     * keep this stream alive while subsequent key presses are correct
     *
     * if an incorrect key is pressed, then discard the stream
     */
    takeWhile((k, i) => k === seq[i + 1]),
    /**
     * ignore the key presses that are correct up until the second last one in
     * the sequnce
     */
    skip(seq.length - 2),
    /**
     * complete the stream with an event containing the last key pressed, which
     * is also the last key in the sequence
     */
    take(1)
  );

const createCombo$ = (seq: string[]) => {
  const initiatorKey = seq[0];

  /**
   * when the correct key is pressed...
   */
  return createCorrectKeypress$(initiatorKey).pipe(
    tap(x => console.log(`start sequence ${x} pressed`)),
    /**
     * switch to a new observable which handles the remaining keys pressed in
     * the sequence
     *
     * if this stream completes, discard, and wait until the first correct
     * letter is again pressed
     */
    switchMap(() => {
      const $ = createRemainingCombo$(seq);

      $.subscribe({
        next: () => console.log(`remaining sequence emitted event`),
        complete: () => console.log("remaining sequence complete"),
      });

      return $;
    })
  );
};

/**
 * start an interval that continues emitting values as long as the key sequence
 * has not been entered
 */
interval(1000)
  .pipe(takeUntil(createCombo$(keySequence)))
  .subscribe({
    next: x => console.log(x),
    complete: () => console.log("interval complete"),
  });
