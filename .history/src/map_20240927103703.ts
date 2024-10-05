import { Restaurant } from "./types/Restaurant";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import { apiUrl } from "./variables";
import { restaurantModal } from "./components";
import { fetchData } from "./functions";
import { DailyMenu } from "./types/Menu";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZWxsaW5vcm1ldHJvcG9saWEiLCJhIjoiY20xZjZzbm56MHFxajJtczlybTVmbHc0MyJ9.l94aCqR68sI1_1pJBfWyYg";

const initializeMap = async () => {
  const map = new mapboxgl.Map({
    container: "map-container",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [24.9, 60.2],
    zoom: 11,
  });
  map.addControl(new mapboxgl.NavigationControl());

  try {
    const response = await fetch(`${apiUrl}/restaurants`);
    if (!response.ok) {
      throw new Error("Failed to fetch restaurants");
    }
    const restaurants: Restaurant[] = await response.json();

    for (const restaurant of restaurants) {
      const [longitude, latitude] = restaurant.location.coordinates;

      if (isNaN(longitude) || isNaN(latitude)) {
        console.error(
          `Invalid coordinates for ${restaurant.name}: [${longitude}, ${latitude}]`
        );
        return;
      }

      const marker = new mapboxgl.Marker()
        .setLngLat([longitude, latitude])
        .addTo(map);

      const popUpPlaceholder = document.createElement("div") as HTMLDivElement;
      popUpPlaceholder.classList.add("popup");

      const popUpContent = `${restaurant.name}, ${restaurant.address}, ${restaurant.city}, ${restaurant.phone}`;

      const popUpButtons = document.createElement("button") as HTMLButtonElement;
      popUpButtons.classList.add("popup-button");

      const placeholder = document.createElement("div");
      placeholder.innerText = popUpContent;
      while (placeholder.firstChild) {
        popUpPlaceholder.appendChild(placeholder.firstChild);
      }

      const popUp = new mapboxgl.Popup().setDOMContent(popUpPlaceholder);

      marker.setPopup(popUp);
    }
  } catch (error) {
    console.error("Failed to fetch restaurants:", error);
  }

  return map;
};

export { initializeMap };
