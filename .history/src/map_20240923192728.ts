import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';

mapboxgl.accessToken = 'pk.eyJ1IjoiZWxsaW5vcm1ldHJvcG9saWEiLCJhIjoiY20xZjZzbm56MHFxajJtczlybTVmbHc0MyJ9.l94aCqR68sI1_1pJBfWyYg';


const initializeMap = () => {
    const map = new mapboxgl.Map({
        container: 'map-container',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [30, 24.7], 
        zoom: 20
    });
    console.log('Map initialized:', map);
    return map;
}

export { initializeMap };

/*

import { map, latLng, tileLayer, MapOptions } from "leaflet";
import 'leaflet/dist/leaflet.css';
//import { Restaurant } from './types/Restaurant';

export function initializeMap(): L.Map {

    const mapOptions: MapOptions = {
        center: latLng(60, 24.8),
        zoom: 12,
        zoomControl: true,
    };
    
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) {
        throw new Error('Map container not found');
    }
    
    const myMap = map(mapContainer, mapOptions);
    
    const key = "nd0wv3x7LYJKj0bPEQni";

    tileLayer(`https://api.maptiler.com/maps/edbcab60-9372-4882-88d1-c36eb89834a0/{z}/{x}/{y}.png?key=${key}`,{ 
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