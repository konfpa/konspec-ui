/* Component store. Group files under assets/reg/ append to it via register(). */
window.REGISTRY = { components: [] };
window.register = function () {
  window.REGISTRY.components.push.apply(window.REGISTRY.components, arguments);
};
