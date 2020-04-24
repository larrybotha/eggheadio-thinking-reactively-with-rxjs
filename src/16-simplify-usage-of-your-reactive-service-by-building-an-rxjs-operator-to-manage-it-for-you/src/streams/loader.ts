import { Observable } from "rxjs";
import { switchMap, takeUntil } from "rxjs/operators";

import {
  taskCompleted$,
  loaderHidden$,
  loaderVisible$,
  loaderWithStats$,
} from "./index";
import { initLoader } from "../lib/loader";

const showLoader$ = (total: number, completed: number) =>
  new Observable(() => {
    const initLoaderPromise = initLoader(total, completed);

    initLoaderPromise.then(loader => {
      loader.show();
    });

    return async () => {
      initLoaderPromise.then(loader => {
        loader.hide();
      });
    };
  });

const loader$ = loaderWithStats$.pipe(
  switchMap(({ complete, total }) =>
    showLoader$(total, complete).pipe(takeUntil(loaderHidden$))
  )
);

export { loader$ };
