<template>
  <section class="history">
    <h2>Historique des émissions</h2>
    <canvas ref="chartEl"></canvas>
  </section>
</template>

<style scoped>
.history {
  max-width: 700px;
  margin: 2rem auto;
}
canvas {
  width: 100% !important;
  height: 300px !important;
}
</style>
