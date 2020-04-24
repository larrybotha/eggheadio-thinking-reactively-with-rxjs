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

  import "./streams/key-combo.ts";

  function startTask() {
    timeoutTask(taskStarted, taskCompleted);
  }

  function startQuickObservableTask() {
    quickObservableTask$.subscribe({
      /**
       * with the custom operator that quickObservableTask$ now takes, we can
       * pass in our own observer
       */
      complete: () => console.log("hello")
    });
  }

  function startObservableTask() {
    observableTask$.subscribe();
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

<hr />
