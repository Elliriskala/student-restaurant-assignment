import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import { Restaurant } from './types/Restaurant';
import { apiUrl } from './variables';
import { restaurantModal } from './components';
import { fetchData } from './functions';
import { DailyMenu } from './types/Menu';

mapboxgl.accessToken = 'pk.eyJ1IjoiZWxsaW5vcm1ldHJvcG9saWEiLCJhIjoiY20xZjZzbm56MHFxajJtczlybTVmbHc0MyJ9.l94aCqR68sI1_1pJBfWyYg';


const initializeMap = async () => {
    const map = new mapboxgl.Map({
        container: 'map-container',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [24.9, 60.2],
        zoom: 11
    });
    map.addControl(new mapboxgl.NavigationControl());

    try {
        const response = await fetch(`${apiUrl}/restaurants`);
        if (!response.ok) {
            throw new Error('Failed to fetch restaurants');
        }
        const restaurants: Restaurant[] = await response.json();

        restaurants.forEach((restaurant: Restaurant) => {
            const [longitude, latitude] = restaurant.location.coordinates;

            if (isNaN(longitude) || isNaN(latitude)) {
                console.error(`Invalid coordinates for ${restaurant.name}: [${longitude}, ${latitude}]`);
                return;
            }
  
            const marker = new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map); 

            restaurants.forEach((restaurant) => {
                try {
                    const menu = await fetchData<DailyMenu>(
                        apiUrl + `/restaurants/daily/${restaurant._id}/fi`
                      );
                      console.log(menu);
                    } catch (error) {
                        throw new Error('Failed to fetch daily menu');
                    }
                    const dailyMenu = await response.json();
                    console.log(dailyMenu);

                    const popUpPlaceholder = document.createElement('div');
                    popUpPlaceholder.classList.add('popup');

                    const popUpContent: string = restaurantModal(restaurant, dailyMenu);

                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = popUpContent;
                    while (tempDiv.firstChild) {
                        popUpPlaceholder.appendChild(tempDiv.firstChild);
                    }

                    const popUp = new mapboxgl.Popup().setDOMContent(popUpPlaceholder);

                    marker.setPopup(popUp);
                });
            });

            } catch (error) {
        console.error('Failed to fetch restaurants:', error);
    }

    return map;
}

export { initializeMap };

