# Egghead.io - Thinking reactively with RxJS

Notes and annotations from Egghead's Thinking Reactively with RxJS course: https://egghead.io/courses/thinking-reactively-with-rxjs

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [2. Use reactive, RxJS based solutions for complex problems](#2-use-reactive-rxjs-based-solutions-for-complex-problems)
- [3. Break down a requirement into small problems](#3-break-down-a-requirement-into-small-problems)
- [4. Pipe events to numbers and maintain a running count using the scan operator](#4-pipe-events-to-numbers-and-maintain-a-running-count-using-the-scan-operator)
- [5. Create safe and predictable observable abstractions](#5-create-safe-and-predictable-observable-abstractions)
- [06. Maintain shared observable state using the scan and shareReplay operators](#06-maintain-shared-observable-state-using-the-scan-and-sharereplay-operators)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 2. Use reactive, RxJS based solutions for complex problems

[https://egghead.io/lessons/rxjs-use-reactive-rxjs-based-solutions-for-complex-problems](https://egghead.io/lessons/rxjs-use-reactive-rxjs-based-solutions-for-complex-problems)

- the decision to use RxJS, or any other library for Observables, comes down to
    two things:

    - does my app deal with events over time?
    - does my app deal with co-ordinating many different events (e.g. async
    requests, delayed requests, etc.)

## 3. Break down a requirement into small problems

[https://egghead.io/lessons/rxjs-break-down-a-requirement-into-small-problems](https://egghead.io/lessons/rxjs-break-down-a-requirement-into-small-problems)

[index.ts](src/03-break-down-requirement-into-small-problems/index.ts)

- breaking problems down into their smallest components makes it easier to
    define how observables need to be composed
- given: *when a loading indicator needs to be displayed, display it until it's
    time to hide it*
    - when does the loader need to show?
      - _when the count of async tasks goes from 0 to 1_
    - when does the loader need to hide?
      - _when the count of async tasks goes to 0_
    - based on the above two points, how do we count?
        - _start from 0_
        - _when an async task starts, increase the count by 1_
        - _when a task ends, decrease the count by 1_

## 4. Pipe events to numbers and maintain a running count using the scan operator

[https://egghead.io/lessons/rxjs-pipe-events-to-numbers-and-maintain-a-running-count-using-the-scan-operator](https://egghead.io/lessons/rxjs-pipe-events-to-numbers-and-maintain-a-running-count-using-the-scan-operator)

[index.ts](src/04-pipe-events-to-numbers-and-maintain-a-running-count-using-the-scan-operator/streams/index.ts)

- `mapTo` is an operator that maps every value to a constant
- `merge` takes multiple streams and creates a new stream which emits events
    from all streams
- `scan` works like `[].reduce`:

    ```javascript
    import {Observable} from 'rxjs'
    import {scan} from 'rxjs/operators'

    const startValue = 0;
    const xs$ = new Observable()
    const reducedXs$ = xs$.pipe(
      scan((acc, x) => acc + x, startingValue)
    )
    ```

## 5. Create safe and predictable observable abstractions

[https://egghead.io/lessons/rxjs-create-safe-and-predictable-observable-abstractions](https://egghead.io/lessons/rxjs-create-safe-and-predictable-observable-abstractions)

[index.ts](src/05-create-safe-and-predictable-observable-abstractions/src/streams/index.ts)

- it's important to consider who will be consuming a stream, and to provide the
    consumer with predictable events and values
- a stream that is composed of other streams won't necessarily emit an event
    until the streams it is composed of emit values
    - this means that there's no predictable value for that stream
    - one way to improve the experience when consuming the stream is to force
        the stream to emit an even using the `startWith` operator
- `scan` doesn't require an initial value - if no initial value is provided, it
    will use the first value of the stream as its starting value
- to drop events from a stream that are repeated sequentially, we can use the
    `didistinctUntilChanged` operator
    - this is the same as `xstream`s `dropRepeats` operator

## 06. Maintain shared observable state using the scan and shareReplay operators

[https://egghead.io/lessons/rxjs-maintain-shared-observable-state-using-the-scan-and-sharereplay-operators](https://egghead.io/lessons/rxjs-maintain-shared-observable-state-using-the-scan-and-sharereplay-operators)

[index.ts](src/06-maintain-shared-observable-state-using-the-scan-and-share-replay-operators/src/streams/index.ts)
