/**
 * This function represents some service used to show a loading state
 *
 * It needs to be initialised first to demonstrate the complexity a 3rd party
 * library may introduce when integrating with RxJS
 */
const initLoader = (): Promise<{ show: () => string; hide: () => string }> => {
  return new Promise(res => {
    const el = document.querySelector(".js-loader");

    res({
      show: () => (el.textContent = "loading"),
      hide: () => (el.textContent = ""),
    });
  });
};

export { initLoader };
