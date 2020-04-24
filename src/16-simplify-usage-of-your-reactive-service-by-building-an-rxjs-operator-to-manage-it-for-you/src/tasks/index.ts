import { timer } from "rxjs";

import { createShowLoadingStatus$ } from "../streams/custom-operator";

type Func = (...args: any[]) => any;

/**
 * pass our custom operator into our observables
 */
const quickObservableTask$ = timer(200).pipe(createShowLoadingStatus$());
const observableTask$ = timer(2200).pipe(createShowLoadingStatus$());

const timeoutTask = (onStart: Func, onEnd: Func) => {
  onStart();
  setTimeout(onEnd, 2000);
};

const promiseTask = (onStart: Func, onResolve: Func) => {
  return new Promise((res, rej) => {
    onStart();

    setTimeout(() => {
      res(onResolve());
    }, 2000);
  });
};

export { quickObservableTask$, observableTask$, timeoutTask, promiseTask };
