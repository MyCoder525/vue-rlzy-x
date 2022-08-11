export const imgError = {
  inserted(el, options) {
    console.log(el);
    console.log(options);
    el.onerror = () => {
      el.src = options.value;
    };
  },
};
export const fouce = {
  inserted(el, options) {
    console.log(el.fouce());
    console.log(options);
  },
};
