<template>
  <section class="form-page">
    <h2>Calcul Vol</h2>
    <form @submit.prevent="onSubmit">
      <label>Distance (km)<input v-model.number="distance" type="number" min="0" required /></label>
      <BaseButton type="submit">Calculer</BaseButton>
    </form>

    <div v-if="result" class="result">
      <p>
        Émissions vol : <strong>{{ result.estimate.toFixed(2) }} kg CO₂e</strong>
      </p>
    </div>
  </section>
</template>


<style scoped>
</style>
