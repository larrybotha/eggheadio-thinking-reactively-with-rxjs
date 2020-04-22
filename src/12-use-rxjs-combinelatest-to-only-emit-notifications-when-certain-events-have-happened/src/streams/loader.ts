import { Observable } from "rxjs";
import { switchMap, takeUntil } from "rxjs/operators";

import { loaderHidden$, loaderVisible$ } from "./index";
import { initLoader } from "../lib/loader";

/**
 * Observable can accept a function that will be called for each new subscriber
 *
 * Each time show loader receives a new subscriber, we'll initialise a new
 * loader
 */
const showLoader$ = new Observable(() => {
  /**
   * demonstrate how one would integrate with a 3rd party library that doesn't
   * use RxJS
   *
   * We store a reference to the promise, as not only do we want to handle when
   * we get a start event, but we also want to handle when we get a complete
   * event.
   *
   * It's possible to use promise.then multiple times because the result of the
   * promise is cached
   */
  const initLoaderPromise = initLoader();

  /**
   * show the loader when the subscriber receives an event
   */
  initLoaderPromise.then(loader => {
    loader.show();
  });

  /**
   * An Observable's callback can return a teardown function which is executed
   * when the stream completes
   *
   * We use the cached result of the promise to hide the loader when this stream
   * completes, which is when the loaderHidden$ emits an event
   */
  return async () => {
    initLoaderPromise.then(loader => {
      loader.hide();
    });
  };
});

/**
 * when loaderVisible$ emits an event, switch to the showLoader$ stream, until
 * the loaderHidden$ stream emits
 */
const loader$ = loaderVisible$.pipe(
  switchMap(() => showLoader$.pipe(takeUntil(loaderHidden$)))
);

export { loader$ };
