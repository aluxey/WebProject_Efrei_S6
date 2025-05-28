<template>
  <div class="map-wrapper">
    <div ref="mapRef" class="map-test"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Import des images par défaut de Leaflet
import defaultIconUrl      from 'leaflet/dist/images/marker-icon.png'
import defaultIcon2xUrl    from 'leaflet/dist/images/marker-icon-2x.png'
import defaultShadowUrl    from 'leaflet/dist/images/marker-shadow.png'

// Crée une icône agrandie pour les aéroports
const airportIcon = L.icon({
  iconUrl:        defaultIconUrl,
  iconRetinaUrl:  defaultIcon2xUrl,
  shadowUrl:      defaultShadowUrl,    // taille plus large
  iconAnchor:     [15, 30],   // ancre au bas de l'icône
  popupAnchor:    [0, -30]
})

const airports = [
  { name: 'Atlanta (ATL)', code: 'ATL', lat: 33.6407, lon: -84.4277 },
  { name: 'Beijing (PEK)', code: 'PEK', lat: 40.0801, lon: 116.5846 },
  { name: 'Los Angeles (LAX)', code: 'LAX', lat: 33.9416, lon: -118.4085 },
  { name: 'Dubai (DXB)', code: 'DXB', lat: 25.2532, lon: 55.3657 },
  { name: 'Tokyo Haneda (HND)', code: 'HND', lat: 35.5494, lon: 139.7798 },
  { name: 'Chicago O’Hare (ORD)', code: 'ORD', lat: 41.9742, lon: -87.9073 },
  { name: 'London Heathrow (LHR)', code: 'LHR', lat: 51.4700, lon: -0.4543 },
  { name: 'Shanghai Pudong (PVG)', code: 'PVG', lat: 31.1443, lon: 121.8083 },
  { name: 'CDG (Charles de Gaulle)', code: 'CDG', lat: 49.0097, lon: 2.5479 },
  { name: 'Dallas/Fort Worth (DFW)', code: 'DFW', lat: 32.8998, lon: -97.0403 }
]

const mapRef = ref(null)

onMounted(() => {
  const map = L.map(mapRef.value).setView([20, 0], 2)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  airports.forEach(a => {
    const marker = L.marker([a.lat, a.lon], { icon: airportIcon })
      .addTo(map)
      .bindPopup(`${a.name}`)
  })
})
</script>

<style scoped>
.map-wrapper {
  width: 100%;
  height: 80vh;  /* 80 % de la hauteur de la fenêtre */
}
.map-test {
  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>
