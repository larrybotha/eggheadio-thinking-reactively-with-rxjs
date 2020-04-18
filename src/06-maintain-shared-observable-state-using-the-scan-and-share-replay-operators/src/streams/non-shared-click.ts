import { createClickStream } from "./base-click-stream";

const nonSharedClickStreamFactory = (node: HTMLButtonElement) => {
  /**
   * if there are multiple subscribers to this stream they always start from the
   * initial value of the source when subscribed;
   * there is no sharing of events from the source
   */
  return createClickStream(node);
};

export { nonSharedClickStreamFactory };
