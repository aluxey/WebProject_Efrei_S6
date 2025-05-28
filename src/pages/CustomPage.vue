<template>
  <section class="form-page">
    <h2>Activité Personnalisée</h2>
    <form @submit.prevent="onSubmit">
      <label>ID émission<input v-model="factorId" required /></label>
      <label>Quantité<input v-model.number="amount" type="number" min="0" required /></label>
      <label>Unité<input v-model="unit" required /></label>
      <BaseButton type="submit">Calculer</BaseButton>
    </form>

    <div v-if="result" class="result">
      <p>
        Émissions : <strong>{{ result.estimate.toFixed(2) }} kg CO₂e</strong>
      </p>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      factorId: '',
      amount: null,
      unit: '',
      result: null
    };
  },
  methods: {
    onSubmit() {
      this.result = {
        estimate: (this.amount || 0) * 2 
      };
    }
  }
};
</script>

<style scoped>
</style>
