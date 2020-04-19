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
