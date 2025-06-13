<template>
  <section class="container my-5">
    <h2 class="mb-4">Mon historique de consommations</h2>
    <p>(seulement pour les users connectés avec google)</p>

    <div v-if="!uid" class="alert alert-warning">
      Vous devez être connecté·e pour voir votre historique.
    </div>

    <table v-else-if="consumptions.length" class="table table-striped">
      <thead>
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Détails</th>
          <th>kg CO₂e</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in consumptions" :key="c.id">
          <td>{{ formatDate(c.calculationAt) }}</td>
          <td>{{ c.type || 'cloud' }}</td>
          <td>
            <template v-if="c.type === 'flight'">
              {{ c.origin }} → {{ c.destination }}, {{ c.passengers }} pax, {{ c.flightClass }}
            </template>
            <template v-else>
              CPU: {{ c.params?.cpuHours }}h, RAM: {{ c.params?.ramHours }} GBh, Storage:
              {{ c.params?.storageGbm }} GBm, Energy: {{ c.params?.energyKwh }} kWh
            </template>
          </td>
          <td>
            <span v-if="c.type === 'flight'">
              {{ (c.co2Kg || 0).toFixed(2) }}
            </span>
            <span v-else>
              {{ (c.total || 0).toFixed(2) }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>Aucun calcul trouvé pour votre compte.</p>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useUserStore } from '@/stores/user'
import { db } from '@/firebase'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'

const store = useUserStore()
const uid = computed(() => store.currentUser?.uid || null)

const consumptions = ref([])
let unsubscribe = null

const formatDate = (ts) => ts.toDate().toLocaleString()

onMounted(() => {
  if (!uid.value) return

  // Cible la sous‐collection "consommation" de l'utilisateur
  const q = query(
    collection(db, 'user', uid.value, 'consommation'),
    orderBy('calculationAt', 'desc'),
  )

  unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      consumptions.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    },
    (error) => {
      console.error('Erreur chargement historique :', error)
    },
  )
})

onBeforeUnmount(() => {
  if (unsubscribe) unsubscribe()
})
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
