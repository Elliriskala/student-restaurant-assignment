import L from 'leaflet';
import { Restaurant } from './types';

const mapContainer = document.getElementById('map-container');
if (!mapContainer) {
  throw new Error('Map container not found');
}

const myMap = L.map(mapContainer).setView([60.2, 25], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 20
}).addTo(map);

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
