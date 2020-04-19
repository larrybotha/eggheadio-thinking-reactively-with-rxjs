import { timer } from "rxjs";

type Func = (...args: any[]) => any;

/**
 * with only a single parameter, this factory will emit a single event, and the
 * complete
 */
const observableTask$ = timer(2000);

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

export { observableTask$, timeoutTask, promiseTask };
