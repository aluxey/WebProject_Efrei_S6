<template>
  <button
    v-bind="$attrs"
    :disabled="disabled"
    :class="['base-button', `base-button--${color}`]"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    color: {
      type: String,
      default: 'primary',
      validator: value => ['primary', 'warn', 'danger'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.base-button {
  border: none;
  color: white;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
}

/* Hover / focus (sauf disabled) */
.base-button:not(:disabled):hover,
.base-button:not(:disabled):focus {
  transform: scale(1.03);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  outline: none;
}

/* état disabled */
.base-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* variantes couleur */
.base-button--primary {
  background-color: #42b983;
}
.base-button--primary:not(:disabled):hover {
  background-color: #4cce93;
}

.base-button--warn {
  background-color: #f0ad4e;
}
.base-button--warn:not(:disabled):hover {
  background-color: #f7bb6f;
}

.base-button--danger {
  background-color: #e53935;
}
.base-button--danger:not(:disabled):hover {
  background-color: #ef5350;
}
</style>
