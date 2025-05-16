<!-- src/components/BaseButton.vue -->
<template>
  <button
    class="base-button"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot/>
  </button>
</template>

<script setup>
defineProps({
  disabled: Boolean
})
</script>

<style scoped>
.base-button {
  --bg: var(--btn-bg, #42b983);
  --hover: var(--btn-hover-bg, #369a6f);
  background: var(--bg);
  color: #fff;
  padding: 0.6rem 1.2rem;
  border: 0;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.base-button:hover:not(:disabled) {
  background: var(--hover);
  transform: translateY(-1px);
}
.base-button:active:not(:disabled) {
  transform: translateY(0);
}
.base-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
