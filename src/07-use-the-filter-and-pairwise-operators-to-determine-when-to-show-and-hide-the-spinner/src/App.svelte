<script type="typescript">
  import { activeTasksCount$ } from "./streams/index.ts";
  import { fib$ } from "./streams/fibonacci.ts";

  let fibItems: number[] = [];

  fib$.subscribe((ev: number) => {
    fibItems = fibItems.concat(ev);
  });
</script>

<main>{$activeTasksCount$}</main>

<pre>{JSON.stringify(fibItems, null, 2)}</pre>
