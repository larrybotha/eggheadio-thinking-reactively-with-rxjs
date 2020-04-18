<script>
  import { onDestroy, onMount } from "svelte";

  export let clickCountFactory;
  export let name;
  let buttonEl1;
  let clickCount$;
  let subscribers = [];
  let outputs = [];

  function createSub(output) {
    return function handleEvent(value) {
      output = { ...output, value };
      outputs = outputs.map(o => {
        if (o.id === output.id) {
          return output;
        }

        return o;
      });

      console.log(`${name} subscriber: ${output.id} =>`, value);
    };
  }

  function addSubscriber() {
    const length = subscribers.length;
    let output = { id: subscribers.length };
    outputs = outputs.concat(output);

    const subscription = clickCount$.subscribe(createSub(output));

    subscribers = subscribers.concat(subscription);
  }

  function removeAllSubscribers() {
    subscribers.map(sub => sub.unsubscribe());

    outputs = [];
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

<style>
  table {
    border-collapse: collapse;
  }

  thead {
    font-weight: bold;
  }
  table td {
    border: 1px solid;
  }
</style>

<p>
  <button bind:this={buttonEl1}>increment count</button>

  <button on:click={addSubscriber}>add subscriber</button>

  <button on:click={removeAllSubscribers}>remove subscribers</button>
</p>

<table>
  <thead>
    <td>subscriber</td>
    <td>click count</td>
  </thead>

  <tbody>
    {#each outputs as { id, value } (id)}
      <tr>
        <td>{id}</td>
        <td>{value}</td>
      </tr>
    {/each}
  </tbody>
</table>
