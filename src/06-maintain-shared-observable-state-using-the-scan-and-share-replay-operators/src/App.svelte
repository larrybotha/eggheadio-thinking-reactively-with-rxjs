<script type="typescript">
  import { activeTasksCount$ } from "./streams/index.ts";
  import { leakyClickStreamFactory } from "./streams/leaky-replay-click.ts";
  import { safeClickStreamFactory } from "./streams/safe-replay-click.ts";
  import { sharedClickStreamFactory } from "./streams/shared-click.ts";
  import { nonSharedClickStreamFactory } from "./streams/non-shared-click.ts";
  import ClickCounter from "./ClickCounter.svelte";
</script>

<main>{$activeTasksCount$}</main>

<hr />

<p>Inspect console for the counters</p>

<h1>Non-shared click stream</h1>

<ClickCounter
  clickCountFactory={nonSharedClickStreamFactory}
  name="non-shared" />

<h1>Shared click stream</h1>

<ClickCounter clickCountFactory={sharedClickStreamFactory} name="shared" />

<h1>Leaky `sharedReplay` click stream</h1>

<ClickCounter clickCountFactory={leakyClickStreamFactory} name="leaky" />

<h1>Safe `sharedReplay` click stream</h1>

<ClickCounter clickCountFactory={safeClickStreamFactory} name="safe" />
