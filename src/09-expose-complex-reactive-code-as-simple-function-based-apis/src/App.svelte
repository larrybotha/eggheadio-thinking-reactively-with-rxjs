<script type="typescript">
  import {
    activeTasksCount$,
    taskStarted,
    taskCompleted
  } from "./streams/index.ts";
  import { timeoutTask, observableTask$, promiseTask } from "./tasks/index.ts";

  function startTask() {
    timeoutTask(taskStarted, taskCompleted);
  }

  function startObservableTask() {
    taskStarted();

    /**
     * use the complete handler to manage when the stream completes
     */
    observableTask$.subscribe({
      complete: () => {
        taskCompleted();
      }
    });
  }

  function startPromiseTask() {
    promiseTask(taskStarted, taskCompleted);
  }
</script>

<main>{$activeTasksCount$}</main>

<hr />

<button on:click={startTask}>start task</button>
<button on:click={startObservableTask}>start observable task</button>
<button on:click={startPromiseTask}>start promise task</button>
