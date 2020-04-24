import { Observable } from "rxjs";

import { taskStarted, taskCompleted } from "./index";

/**
 * create a custom operator
 */
const createShowLoadingStatus$ = () => (source: any) => {
  return new Observable(observer => {
    taskStarted();
    console.log("task started");

    const subscription = source.subscribe(observer);

    return () => {
      subscription.unsubscribe();
      console.log("task completed");
      taskCompleted();
    };
  });
};

export { createShowLoadingStatus$ };
