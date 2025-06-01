<template>
  <div class="flights-map-container">
    <div id="leaflet-map" ref="mapContainer"></div>
    <p class="map-instructions">
      Click on two airport markers to select your origin & destination.
    </p>
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default {
  name: 'FlightsMap',
  props: {
    origin: {
      type: String,
      default: '',
    },
    destination: {
      type: String,
      default: '',
    },
  },
  emits: ['update:origin', 'update:destination'],
  data() {
    return {
      map: null,
      clickedAirports: [], // will hold up to two IATA codes
    };
  },
  mounted() {
    this.map = L.map(this.$refs.mapContainer).setView([48.8566, 2.3522], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    fetch('/airports.geojson')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to load airports.geojson');
        }
        return res.json();
      })
      .then((geojson) => {
        // Add the GeoJSON as a layer with clickable markers
        L.geoJSON(geojson, {
          pointToLayer: (feature, latlng) => {
            return L.circleMarker(latlng, {
              radius: 6,
              fillColor: '#FF5722',
              color: '#FFFFFF',
              weight: 1,
              fillOpacity: 0.8,
            });
          },
          onEachFeature: (feature, layer) => {
            layer.on('click', () => {
              const clickedIata = feature.properties.iata;
              if (!clickedIata) return;

              if (this.clickedAirports.includes(clickedIata)) return;

              if (this.clickedAirports.length === 2) {
                this.clickedAirports = [];
              }

              this.clickedAirports.push(clickedIata);

              this.$emit('update:origin', this.clickedAirports[0] || '');
              this.$emit('update:destination', this.clickedAirports[1] || '');
            });

            layer.bindTooltip(feature.properties.iata, {
              permanent: false,
              direction: 'top',
            });
          },
        }).addTo(this.map);
      })
      .catch((err) => {
        console.error(err);
      });
  },
};
</script>

<style scoped>
.flights-map-container {
  width: 100%;
  height: 450px;
  margin-bottom: 1rem;
  position: relative;
}

#leaflet-map {
  width: 100%;
  height: 100%;
}

.map-instructions {
  text-align: center;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  color: #555;
}
</style>
