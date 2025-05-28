<template>
  <main class="grid">
    <div class="card">
      <h2>Nombre de vols cette année</h2>
      <p class="value">123</p>
    </div>
    <div class="card">
      <h2>Estimations CO₂</h2>
      <p class="value">843 kg</p>
      <p class="description">Émissions totales calculées</p>
    </div>
    <div class="card">
      <h2>Nombre de trajet par semaine</h2>
      <p class="value">7</p>
      <p class="description">40km</p>
    </div>
    <div class="card">
      <h2>Emission moyenne</h2>
      <p class="value">Dans la moyenne française</p>
      <p class="description">Mise à jour automatique</p>
    </div>
  </main>
</template>

<script setup>
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.card {
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
}

.card h2 {
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 0.5rem;
}

.value {
  font-size: 2rem;
  font-weight: bold;
  color: #2e86de;
}

.description {
  color: #888;
  font-size: 0.9rem;
}
</style>
