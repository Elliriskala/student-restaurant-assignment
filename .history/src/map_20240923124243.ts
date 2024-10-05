import L from 'leaflet';
import { Restaurant } from "./types/Restaurant";


// Step 1: Find the container element
const mapContainer = document.getElementById('map-container');
if (!mapContainer) {
  throw new Error('Map container not found');
}

// Step 2: Initialize the map and set its view
const myMap = L.map(mapContainer).setView([51.505, -0.09], 13);

// Step 3: Add a tile layer to the map (required for Leaflet)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

/*

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

export { map };

*/