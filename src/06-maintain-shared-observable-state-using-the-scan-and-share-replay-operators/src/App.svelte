<script type="typescript">
  import { activeTasksCount$ } from "./streams/index.ts";
  import { leakyClickStreamFactory } from "./streams/leaky-click.ts";
  import { safeClickStreamFactory } from "./streams/safe-click.ts";
  import ClickCounter from "./ClickCounter.svelte";
</script>

<main>{$activeTasksCount$}</main>

<h1>Leaky click stream</h1>

<ClickCounter clickCountFactory={leakyClickStreamFactory} />

<h1>Safe click stream</h1>

<ClickCounter clickCountFactory={safeClickStreamFactory} />
