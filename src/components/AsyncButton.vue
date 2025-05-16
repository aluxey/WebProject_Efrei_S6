<!-- src/components/AsyncButton.vue -->
<template>
  <BaseButton
    v-bind="filteredAttrs"
    :disabled="isPending"
    :color="color"
    @click.stop.prevent="handleClick"
  >
    <template #default>
      <span v-if="isPending">
        <font-awesome-icon :icon="['fas','circle-notch']" pulse />
      </span>
      <span v-else>
        <slot/>
      </span>
    </template>
  </BaseButton>
</template>

<script>
import BaseButton from "./BaseButton.vue";

export default {
  name: "AsyncButton",
  components: { BaseButton },
  inheritAttrs: false,
  props: {
    color: {
      type: String,
      default: "primary",
      validator: v => ["primary", "warn", "danger"].includes(v)
    }
  },
  data() {
    return {
      isPending: false
    };
  },
  computed: {
    filteredAttrs() {
      const result = {};
      for (const key in this.$attrs) {
        if (key === "onClick") continue;
        result[key] = this.$attrs[key];
      }
      return result;
    }
  },
  methods: {
    handleClick(event) {
      if (this.isPending) return;

      const fn = this.$attrs.onClick;
      if (typeof fn !== "function") return;

      this.isPending = true;

      const p = Promise.resolve()
        .then(() => fn(event))
        .catch(err => {
          if (err.errorCode === "user_cancelled" || err.errorMessage?.includes("cancelled")) {
            return;
          }
          throw err;
        })
        .finally(() => {
          // 5) Réactive le bouton
          this.isPending = false;
        });

      return p;
    }
  }
};
</script>

<style scoped>
</style>
