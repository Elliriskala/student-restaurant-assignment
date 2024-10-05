import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import { Restaurant } from './types/Restaurant';

mapboxgl.accessToken = 'pk.eyJ1IjoiZWxsaW5vcm1ldHJvcG9saWEiLCJhIjoiY20xZjZzbm56MHFxajJtczlybTVmbHc0MyJ9.l94aCqR68sI1_1pJBfWyYg';


const initializeMap = () => {
    const map = new mapboxgl.Map({
        container: 'map-container',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [24.8, 60.2],
        zoom: 8
    });
    map.addControl(new mapboxgl.NavigationControl());

    const restaurants: Restaurant[] = [];

    restaurants.forEach((restaurant: Restaurant) => {
        const [longitude, latitude] = restaurant.location.coordinates;
  
        const marker = new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);

        const popUpContent = document.createElement('div');

        const name = document.createElement('h3');
        name.textContent = `Restaurant: ${restaurant.name}`;

        const address = document.createElement('p');
        address.textContent = `Address: ${restaurant.address}`;

        popUpContent.appendChild(name);
        popUpContent.appendChild(address);

        const popUp = new mapboxgl.Popup().setDOMContent(popUpContent);

        marker.setPopup(popUp);
    });
    return map;
}

export { initializeMap };

