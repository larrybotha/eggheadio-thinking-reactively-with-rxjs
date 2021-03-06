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
- [07. Use the filter and pairwise operators to determine when to show and hide the spinner](#07-use-the-filter-and-pairwise-operators-to-determine-when-to-show-and-hide-the-spinner)
- [08. Build an observable from a simple english requirement](#08-build-an-observable-from-a-simple-english-requirement)
- [09. Expose complex reactive code as simple function based APIs](#09-expose-complex-reactive-code-as-simple-function-based-apis)
- [10. Encapsulate complex imperative logic in a simple observable](#10-encapsulate-complex-imperative-logic-in-a-simple-observable)
- [11. Extend Your Reactive Logic in RxJS using Observable-like Proxies that Delay or Drop Events](#11-extend-your-reactive-logic-in-rxjs-using-observable-like-proxies-that-delay-or-drop-events)
- [12. Use RxJS combineLatest to Only Emit Notifications When Certain Events Have Happened](#12-use-rxjs-combinelatest-to-only-emit-notifications-when-certain-events-have-happened)
- [13. Maintain Self-resetting State in Your Observable Streams using the RxJS scan Operator](#13-maintain-self-resetting-state-in-your-observable-streams-using-the-rxjs-scan-operator)
- [14. Build an Event Combo Observable with RxJS](#14-build-an-event-combo-observable-with-rxjs)
- [15. Use RxJS exhaustMap to Wait for Open Combos to Finish Before Starting New Ones](#15-use-rxjs-exhaustmap-to-wait-for-open-combos-to-finish-before-starting-new-ones)
- [16. Simplify Usage of Your Reactive Service by Building an RxJS Operator to Manage It For You](#16-simplify-usage-of-your-reactive-service-by-building-an-rxjs-operator-to-manage-it-for-you)

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

- one needs to determine whether a source stream is either transient, or a
    single source of truth:

    - *transient*: new subscribers to the stream will get their own events; they
    don't need to receive previous events
    - *single source of truth*: new subscribers need to get the same events that
    previous subscribers received. An example of this would be watching
    background tasks - if a subscriber needs the most recent background task
    from a source, that source will need to be configured to be emit previous
    events to that new subscriber
- to make streams behave as a single source of truth, events need to be shared.
    One way to do this is to use `RxJS`s `share` operator, which will emit
    events to all subscribers with the same value
    - one caveat here is that new subscribers will not receive an event until a
        new event is emitted from the source. This can be problematic if the
        subscriber needs a value on subscription
- an alternative to `share` is `shareReplay`. `shareReplay` will emit the latest
    `n` events to any new subscribers:

    ```javascript
    const replay$ = source$.pipe(shareReplay(1))
    ```

    - a caveat here is that if the `replay$`'s subscribers go to 0, it will not
    complete. Any events it is receiving from its source will continue to be
    emitted. Once the stream gets new subscribers, it will emit the latest
    events from the events that were accumulating in the background. This may be
    a source of memory leaks if the stream is not properly unsubscribed
    - to address this, one should prefer providing a config to `shareReplay`,
    setting `refCount` to `true` (`false` by default). `refCount: true`
    instructs the stream to complete once its number of subscribers hits 0

      ```javascript
      const safeReplay$ = source$.pipe(
        shareReplay({
          // number of events to emit to new subscribers
          bufferSize: 1,
          refCount: true,
        })
      )
      ```

## 07. Use the filter and pairwise operators to determine when to show and hide the spinner

[https://egghead.io/lessons/rxjs-use-the-filter-and-pairwise-operators-to-determine-when-to-show-and-hide-the-spinner](https://egghead.io/lessons/rxjs-use-the-filter-and-pairwise-operators-to-determine-when-to-show-and-hide-the-spinner)

[index.ts](src/07-use-the-filter-and-pairwise-operators-to-determine-when-to-show-and-hide-the-spinner/src/streams/index.ts)

[fibonacci.ts](src/07-use-the-filter-and-pairwise-operators-to-determine-when-to-show-and-hide-the-spinner/src/streams/fibonacci.ts)

- `pairwise` takes a source stream, and emits its last two events as a tuple
- this is useful if we need to compare the current value with the previous value
    - an example here may be recursive reducers, such as using `pairwise` and
        `scan` to create a fibonacci sequence

## 08. Build an observable from a simple english requirement

[https://egghead.io/lessons/rxjs-build-an-observable-from-a-simple-english-requirement](https://egghead.io/lessons/rxjs-build-an-observable-from-a-simple-english-requirement)

[index.ts](src/08-build-an-observable-from-a-simple-english-requirement/src/streams/index.ts)

- `switchMap` switches the source stream to another stream; it is similar to
    mapping over a stream, returning a stream from within that stream (a stream
    of stream), and then flattening the stream
- only one stream inside `switchMap` will be subscribed to at a time. This is
    useful for cancelling streams, for example if multiple requests are made,
    `switchMap` can be used to cancel prior subscriptions. Sometimes you may not
    want to cancel previous subscriptions, and `mergeMap` should be used instead
    - any existing stream will be completed, and the new stream then observed
- think _switch to a new observable_ when using this transformation

## 09. Expose complex reactive code as simple function based APIs

[https://egghead.io/lessons/rxjs-expose-complex-reactive-code-as-simple-function-based-apis](https://egghead.io/lessons/rxjs-expose-complex-reactive-code-as-simple-function-based-apis)

[index.ts](src/09-expose-complex-reactive-code-as-simple-function-based-apis/src/streams/index.ts)

- when watching for completion of long-running tasks, it's important to consider
    that a task could be a function, a promise, or another observable
- when watching for completion of a function, it may be required to use a helper
    to indicate to a stream to explicitly emit a complete event

    - `Subject` allows one to do this. A `Subject` extends `Observable` by
    allowing for events to be emitted using `mySyubject.next()`. It is both an
    observer

      - observer: can emit events using `next`
      - observable: events can be subscribed to using `subscribe`
    - `Subject` is an event emitter
- `timer` will emit a single event if only provided the `delay` parameter

## 10. Encapsulate complex imperative logic in a simple observable

[https://egghead.io/lessons/rxjs-encapsulate-complex-imperative-logic-in-a-simple-observable](https://egghead.io/lessons/rxjs-encapsulate-complex-imperative-logic-in-a-simple-observable)

[index.ts](src/10-encapsulate-complex-imperitave-logic-in-a-simple-observable/src/streams/index.ts)

- `Observable` can accept a function that is called every time the stream gets a
    new subscriber
- that function can return a teardown function when the stream completes
- storing a reference to a promise allows one to reuse the resolved value:

    ```javascript
    const something$ = new Observable(() => {
      // this code is executed each time the observable receives a new value

      // store a reference to the promise for later use
      const promise = somePromiseFactory();

      // do something with the resolved value
      promise.then(resolvedValue => {
        resolvedValue.init();
      })

      // return a teardown function for observable completion
      return () => {
        // use the cached promise to get the resolved value again
        promise.then(resolvedValue => {
          resolvedValue.destroy();
        })
      }
    })
    ```

## 11. Extend Your Reactive Logic in RxJS using Observable-like Proxies that Delay or Drop Events

[https://egghead.io/lessons/rxjs-extend-your-reactive-logic-in-rxjs-using-observable-like-proxies-that-delay-or-drop-events](https://egghead.io/lessons/rxjs-extend-your-reactive-logic-in-rxjs-using-observable-like-proxies-that-delay-or-drop-events)

[index.ts](src/11-extend-your-reactive-logic-using-observable-like-proxies-that-delay-or-drop-events/src/streams/index.ts)

- we can delay the emitting of an event by using `switchMap` to return a new
    `timer` stream with that delay
- this allows us to do things such as delaying the showing of UI elements if
    they are going to be displayed only for milliseconds, such as when a loader
    is displayed for tasks that only take milliseconds
- once the delay is over, consider how the switched stream will return control
    to the original stream:

    ```javascript
    const delayedUIChange$ = task$.pipe(
      /**
       * Only emit an event after 300ms, and until events are completed
       *
       * If tasksAreDone$ emits before the 300ms, then no event will be emitted
       * on this stream
       */
      switchMap(() => timer(300).pipe(takeUntil(tasksAreDone$)))
    )
    ```

## 12. Use RxJS combineLatest to Only Emit Notifications When Certain Events Have Happened

[https://egghead.io/lessons/rxjs-use-rxjs-combinelatest-to-only-emit-notifications-when-certain-events-have-happened](https://egghead.io/lessons/rxjs-use-rxjs-combinelatest-to-only-emit-notifications-when-certain-events-have-happened)

[index.ts](src/12-use-rxjs-combinelatest-to-only-emit-notifications-when-certain-events-have-happened/src/streams/index.ts)

- sometimes we need a stream to only emit events when to or more streams have
    emitted, e.g. some event must be emitted when 2 or more conditions are met
- to achieve this, we can use `combineLatest`:

    ```javascript
    const a$ = timer(2000);
    const b$ = fromEvent('click', el)

    // will only emit if 2 seconds have passed and the element is clicked
    const c$ = combineLatest(a$, b$);
    ```
- `combineLatest` emits a tuple of the latest events from each stream
- the example in this demo is poignant; only hide a visible spinner when the
    following conditions are met:

    - there are no tasks, and
    - at least 2 seconds have elapsed
    tap(() => console.log("timer complete"))

## 13. Maintain Self-resetting State in Your Observable Streams using the RxJS scan Operator

[https://egghead.io/lessons/rxjs-maintain-self-resetting-state-in-your-observable-streams-using-the-rxjs-scan-operator](https://egghead.io/lessons/rxjs-maintain-self-resetting-state-in-your-observable-streams-using-the-rxjs-scan-operator)

[index.ts](src/13-maintain-self-resetting-state-in-your-observable-streams-using-the-rxjs-scan-operator/src/streams/index.ts)

- `switchMap` only holds a single stream at a time - when that stream ends,
    `switchMap` will exit, effectively resetting the stream contained in it
- this is useful instead of manually resetting streams


## 14. Build an Event Combo Observable with RxJS

[https://egghead.io/lessons/rxjs-build-an-event-combo-observable-with-rxjs](https://egghead.io/lessons/rxjs-build-an-event-combo-observable-with-rxjs)

[key-combo.ts](src/14-build-an-event-combo-observable-with-rxjs/src/streams/key-combo.ts)

- `takeUntil` will allow a stream to continue emitting events as long as the
    stream it contains doesn't end
- `takeWhile` will keep a stream alive as long as the predicate function it
    takes returns true:

    ```javascript
    interval(1000).pipe(takeWhile(x => x < 100))
    ```
- `skip` will drop values from a stream. This is the same as `drop` in `xstream`

## 15. Use RxJS exhaustMap to Wait for Open Combos to Finish Before Starting New Ones

[https://egghead.io/lessons/rxjs-use-rxjs-exhaustmap-to-wait-for-open-combos-to-finish-before-starting-new-ones](https://egghead.io/lessons/rxjs-use-rxjs-exhaustmap-to-wait-for-open-combos-to-finish-before-starting-new-ones)

[key-combo.ts](src/15-use-rxjs-exhaustmap-to-wait-for-open-combos-to-finish-before-starting-new-ones/src/streams/key-combo.ts)

- `switchMap` will dispose of its inner observable whenever the outer stream
    emits
- if we need the inner stream to continue emitting events, regardless of the
    outer stream's events, then we can use `exhaustMap`

## 16. Simplify Usage of Your Reactive Service by Building an RxJS Operator to Manage It For You

[https://egghead.io/lessons/rxjs-simplify-usage-of-your-reactive-service-by-building-an-rxjs-operator-to-manage-it-for-you](https://egghead.io/lessons/rxjs-simplify-usage-of-your-reactive-service-by-building-an-rxjs-operator-to-manage-it-for-you)

[custom-operator.ts](src/16-simplify-usage-of-your-reactive-service-by-building-an-rxjs-operator-to-manage-it-for-you/src/streams/custom-operator.ts)

-
