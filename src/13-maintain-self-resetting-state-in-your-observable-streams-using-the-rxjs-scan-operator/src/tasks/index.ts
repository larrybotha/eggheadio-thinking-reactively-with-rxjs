import { timer } from "rxjs";

type Func = (...args: any[]) => any;

const quickObservableTask$ = timer(200);
const observableTask$ = timer(2200);

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
