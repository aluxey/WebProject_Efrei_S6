<template>
  <div class="flights-page">
    <h2>Flight Emissions Calculator</h2>

    <FlightsMap
      v-model:origin="selectedOrigin"
      v-model:destination="selectedDestination"
    />

    <div class="selection-info" v-if="!selectedOrigin || !selectedDestination">
      <p>Please click on two airport markers on the map above.</p>
      <p>
        Selected:
        <strong>{{ selectedOrigin || '––' }} → {{ selectedDestination || '––' }}</strong>
      </p>
    </div>
    <div class="selection-info" v-else>
      <p>
        Selected Route:
        <strong>{{ selectedOrigin }} → {{ selectedDestination }}</strong>
      </p>
    </div>

    <form @submit.prevent="calculateEmission" class="emission-form">
      <label>
        Passengers:
        <input
          type="number"
          v-model.number="passengers"
          min="1"
          :disabled="!canEstimate"
        />
      </label>

      <label>
        Class:
        <select v-model="flightClass" :disabled="!canEstimate">
          <option value="economy">Economy</option>
          <option value="premium_economy">Premium Economy</option>
          <option value="business">Business</option>
          <option value="first">First</option>
        </select>
      </label>

      <button
        type="submit"
        :disabled="!canEstimate || loading"
        class="estimate-button"
      >
        {{ loading ? 'Estimating …' : 'Estimate CO₂' }}
      </button>
    </form>

    <div v-if="error" class="error">{{ error }}</div>
    <div v-else-if="emission !== null" class="result">
      Estimated CO₂ Emissions: <strong>{{ emission }} kg CO₂e</strong>
    </div>
  </div>
</template>

<script>
import FlightsMap from '@/components/FlightsMap.vue';
import { estimateFlightEmission } from '@/api/emissionService';

export default {
  name: 'FlightsPage',
  components: { FlightsMap },
  data() {
    return {
      selectedOrigin: '',
      selectedDestination: '',

      passengers: 1,
      flightClass: 'economy',

      emission: null,
      loading: false,
      error: null,
    };
  },
  computed: {
    canEstimate() {
      return this.selectedOrigin && this.selectedDestination;
    },
  },
  methods: {
    async calculateEmission() {
      this.error = null;
      this.emission = null;
      this.loading = true;

      try {
        const kgCO2 = await estimateFlightEmission(
          this.selectedOrigin.toUpperCase(),
          this.selectedDestination.toUpperCase(),
          this.passengers,
          this.flightClass
        );
        this.emission = Number(kgCO2.toFixed(2));
      } catch (e) {
        this.error =
          'Could not fetch emission data. Make sure both airports are valid and try again.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.flights-page {
  max-width: 800px;
  margin: auto;
  padding: 1rem;
}

.selection-info {
  margin: 1rem 0;
  font-size: 1rem;
}

.emission-form {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.emission-form label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
}

.estimate-button {
  align-self: flex-end;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
}

.error {
  color: #b00020;
  margin-top: 1rem;
}

.result {
  margin-top: 1rem;
  font-size: 1.1rem;
}
</style>
