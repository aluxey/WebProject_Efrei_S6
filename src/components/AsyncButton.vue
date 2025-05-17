<template>
  <BaseButton
    v-bind="filteredAttrs"
    :disabled="isPending"
    :color="color"
    @click.stop.prevent="handleClick"
  >
    <span v-if="isPending">
      <font-awesome-icon icon="circle-notch" pulse />
    </span>
    <span v-else>
      <slot />
    </span>
  </BaseButton>
</template>

<script setup>
import { ref, computed, useAttrs } from 'vue'
import BaseButton from './BaseButton.vue'

const props = defineProps({
  color: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'warn', 'danger'].includes(v),
  },
})

const attrs = useAttrs()
const isPending = ref(false)

const filteredAttrs = computed(() => {
  const { onClick, ...rest } = attrs
  return rest
})

function handleClick(evt) {
  if (isPending.value) {
    // déjà en cours, on ignore
    return
  }
  const fn = attrs.onClick
  if (typeof fn !== 'function') return

  isPending.value = true
  const p = fn(evt)

  // si c’est vraiment une Promise
  if (p && typeof p.finally === 'function') {
    p.finally(() => {
      isPending.value = false
    })
  } else {
    isPending.value = false
  }
  return p
}
</script>

<style scoped></style>
