<script>
  import { onDestroy, onMount } from "svelte";

  export let clickCountFactory;
  let buttonEl1;
  let clickCount$;
  let subscribers = [];

  function addSubscriber() {
    const length = subscribers.length;
    const subscription = clickCount$.subscribe(ev =>
      console.log(`subscriber: ${length} =>`, ev)
    );

    subscribers = subscribers.concat(subscription);
  }

  function removeAllSubscribers() {
    subscribers.map(sub => sub.unsubscribe());

    subscribers = [];
  }

  onMount(() => {
    clickCount$ = clickCountFactory(buttonEl1);

    addSubscriber();
  });

  onDestroy(() => {
    subscribers.map(sub => sub.unsubscribe());
  });
</script>

{#each subscribers as sub}{/each}

<button bind:this={buttonEl1}>increment count</button>

<button on:click={addSubscriber}>add subscriber</button>

<button on:click={removeAllSubscribers}>remove subscribers</button>
