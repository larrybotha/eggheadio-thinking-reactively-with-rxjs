import { fromEvent } from "rxjs";
import { mapTo, scan, startWith } from "rxjs/operators";

const createClickStream = (node: HTMLButtonElement) => {
  return fromEvent(node, "click").pipe(
    startWith(0),
    mapTo(1),
    scan((acc, inc) => acc + inc)
  );
};

export { createClickStream };
