<script type="typescript">
  import {
    activeTasksCount$,
    taskStarted,
    taskCompleted
  } from "./streams/index.ts";
  import {
    quickObservableTask$,
    timeoutTask,
    observableTask$,
    promiseTask
  } from "./tasks/index.ts";
  import { loader$ } from "./streams/loader.ts";

  function startTask() {
    timeoutTask(taskStarted, taskCompleted);
  }

  function startQuickObservableTask() {
    taskStarted();

    /**
     * use the complete handler to manage when the stream completes
     */
    quickObservableTask$.subscribe({
      complete: () => {
        taskCompleted();
      }
    });
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

<main>{$activeTasksCount$} tasks</main>

<p class="js-loader">{$loader$}</p>

<hr />

<!-- <button on:click={startTask}>start task</button> -->
<button on:click={startObservableTask}>start observable task</button>
<button on:click={startQuickObservableTask}>start quick observable task</button>
<!-- <button on:click={startPromiseTask}>start promise task</button> -->
