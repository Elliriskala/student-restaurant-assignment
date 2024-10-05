import L from 'leaflet';
import { Restaurant } from "./types/Restaurant";

const map = L.map('map').setView([60.2, 25], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 20
}).addTo(map);

const restaurants: Restaurant[] = [];

restaurants.forEach((restaurant: Restaurant) => {
  const [longitude, latitude] = restaurant.location.coordinates;
  
  const marker = L.marker([latitude, longitude]).addTo(map);

  const popUp = document.createElement('div');

  const name = document.createElement('h3');
  name.textContent = `Restaurant: ${restaurant.name}`;

  const address = document.createElement('p');
  address.textContent = `Address: ${restaurant.address}`;

  popUp.appendChild(name);
  popUp.appendChild(address);

  marker.bindPopup(popUp);
});