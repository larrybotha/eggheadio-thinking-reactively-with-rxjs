# Egghead.io - Thinking reactively with RxJS

Notes and annotations from Egghead's Thinking Reactively with RxJS course: https://egghead.io/courses/thinking-reactively-with-rxjs

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [2. Use reactive, RxJS based solutions for complex problems](#2-use-reactive-rxjs-based-solutions-for-complex-problems)
- [3. Break down a requirement into small problems](#3-break-down-a-requirement-into-small-problems)

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
