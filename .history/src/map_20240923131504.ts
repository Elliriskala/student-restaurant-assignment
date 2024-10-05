import { map, latLng, tileLayer, MapOptions } from "leaflet";
import 'leaflet/dist/leaflet.css';
//import { Restaurant } from './types/Restaurant';

export function initializeMap(): L.Map {
    const mapOptions: MapOptions = {
        center: latLng(60.2, 25),
        zoom: 12
    };
    
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) {
        throw new Error('Map container not found');
    }
    
    const myMap = map('map-container', mapOptions);
    
    const key = "9wmOBwPd64RVmIi73z51";

    tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${key}`,{ //style URL
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 1,
    attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
    crossOrigin: true
  }).addTo(myMap);
  return myMap;
}

export default { initializeMap };

/*
const restaurants: Restaurant[] = [];

restaurants.forEach((restaurant: Restaurant) => {
  const [longitude, latitude] = restaurant.location.coordinates;
  
  const marker = L.marker([latitude, longitude]).addTo(myMap);

  const popUp = document.createElement('div');

  const name = document.createElement('h3');
  name.textContent = `Restaurant: ${restaurant.name}`;

  const address = document.createElement('p');
  address.textContent = `Address: ${restaurant.address}`;

  popUp.appendChild(name);
  popUp.appendChild(address);

  marker.bindPopup(popUp);
});

export { myMap };
*/