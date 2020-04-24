import { interval, fromEvent, timer } from "rxjs";
import {
  filter,
  map,
  skip,
  exhaustMap,
  switchMap,
  tap,
  take,
  takeUntil,
  takeWhile,
} from "rxjs/operators";

const keySequence = ["q", "w", "q", "e"];

const keyPress$ = fromEvent<KeyboardEvent>(document, "keypress");
const key$ = keyPress$.pipe(map(ev => ev.key));

const createCorrectKeypress$ = (key: KeyboardEvent["key"]) =>
  key$.pipe(filter(k => k === key));

const createRemainingCombo$ = (seq: string[]) =>
  key$.pipe(
    tap(x => console.log(`remaining sequence ${x} pressed`)),
    takeUntil(timer(6000)),
    takeWhile((k, i) => k === seq[i + 1]),
    skip(seq.length - 2),
    take(1),
    tap(() => console.log("sequence correct!"))
  );

const createCombo$ = (seq: string[]) => {
  const initiatorKey = seq[0];

  return createCorrectKeypress$(initiatorKey).pipe(
    /**
     * every time createCorrectKeypress$ emits a new event, switchMap will
     * dispose of its inner stream, and create a new stream
     *
     * this means that if somewhere in our sequence we have a character that is
     * the same as the first character, a user would never be able to complete
     * the sequence because the stream containing their progress would always
     * be disposed
     *
     * to get around this, we can use exhaustMap instead. exhaustMap will not
     * dispose its inner stream if the outer stream emits an event. It relies
     * on the inner stream to determine whether it emits an event, or disposes
     * of the stream
     *
     * this way, any additional keystrokes regardless of whether they are the
     * same as the starting keystroke or not, will not interrupt the stream
     * while it is active
     */
    //switchMap(() => {
    exhaustMap(() => {
      const $ = createRemainingCombo$(seq);

      $.subscribe({
        next: () => console.log(`remaining sequence emitted event`),
        complete: () => console.log("remaining sequence complete"),
      });

      return $;
    })
  );
};

interval(1000)
  .pipe(takeUntil(createCombo$(keySequence)))
  .subscribe({
    next: x => console.log(x),
    complete: () => console.log("interval complete"),
  });
