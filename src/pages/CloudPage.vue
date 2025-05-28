<template>
  <form @submit.prevent="handleSubmit">
    <label>
      Duration (h) :
      <input v-model.number="duration" type="number" required />
    </label>

    <label>
      Nb CPUs :
      <input v-model.number="cpu_count" type="number" required />
    </label>

    <label>
      Mémoire (GB) :
      <input v-model.number="memory" type="number" required />
    </label>

    <button type="submit">Estimer CO₂</button>
  </form>

  <div v-if="result !== null">
    <p>Émissions estimées : {{ result }} kg CO₂e</p>
  </div>

  <div v-if="error" style="color: red;">
    {{ error }}
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { estimateCpu, estimateRam } from '../api/climatiq'

const duration = ref(1)
const cpu_count = ref(2)
const memory = ref(4)

const result = ref(null)
const error = ref('')

async function handleSubmit() {
  error.value = ''
  result.value = null

  const totalCpuHours = duration.value * cpu_count.value
  const totalRamHours = duration.value * memory.value

  try {
    const [cpuRes, ramRes] = await Promise.all([
      estimateCpu(totalCpuHours),
      estimateRam(totalRamHours)
    ])

    const total = cpuRes.co2e + ramRes.co2e
    result.value = total.toFixed(4)
  } catch (err) {
    console.error(err)
    error.value = 'Erreur lors de l’estimation'
  }
}
</script>

<style scoped>
form {
  margin-bottom: 1rem;
}

label {
  margin-right: 1rem;
  display: inline-block;
}

button {
  margin-left: 1rem;
}
</style>
