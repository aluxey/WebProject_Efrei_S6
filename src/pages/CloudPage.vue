<template>
  <section class="form-page">
    <h2>Calcul Cloud</h2>
    <form @submit.prevent="onSubmit">
      <label>CPU (heures)<input v-model.number="cpu" type="number" min="0" required /></label>
      <label>RAM (GiB-heure)<input v-model.number="ram" type="number" min="0" required /></label>
      <label>Stockage (GiB-mois)<input v-model.number="storage" type="number" min="0" required /></label>
      <BaseButton type="submit">Calculer</BaseButton>
    </form>

    <div v-if="result" class="result">
      <p>Émissions totales : <strong>{{ result.estimate.toFixed(2) }} kg CO₂e</strong></p>
    </div>
  </section>
</template>


<style scoped>
.form-page { max-width: 400px; margin: 2rem auto; }
.form-page label { display: block; margin-bottom: 1rem; }
.form-page input { width: 100%; padding: 0.4rem; }
.result { margin-top: 1.5rem; padding: 1rem; background: #eef; border-radius: 4px; }
</style>
