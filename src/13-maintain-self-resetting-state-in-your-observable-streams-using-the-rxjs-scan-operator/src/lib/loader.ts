const initLoader = (
  total: number,
  complete: number
): Promise<{ show: () => string; hide: () => string }> => {
  return new Promise(res => {
    const el = document.querySelector(".js-loader");

    res({
      show: () =>
        (el.textContent = `loading ${(complete / total) *
          100}% (${complete}/${total})`),
      hide: () => (el.textContent = ""),
    });
  });
};

export { initLoader };
