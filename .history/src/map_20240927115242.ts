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

      const companyName = document.createElement("h2") as HTMLHeadingElement;
      companyName.innerText = `${restaurant.name} - ${restaurant.company}`;

      popUpPlaceholder.appendChild(companyName);

      const companyAddress = document.createElement(
        "p"
      ) as HTMLParagraphElement;
      companyAddress.innerText = `${restaurant.address}, ${restaurant.postalCode} ${restaurant.city}`;

      popUpPlaceholder.appendChild(companyAddress);

      const companyPhone = document.createElement("p") as HTMLParagraphElement;
      companyPhone.innerText = `${restaurant.phone && restaurant.phone.trim() !== '-' ? restaurant.phone : 'No phone number'}`;

      popUpPlaceholder.appendChild(companyPhone);

      const popUpbuttons = document.createElement("div") as HTMLDivElement;
      popUpbuttons.classList.add("popup-buttons");
      const buttonUL = document.createElement("ul") as HTMLUListElement;
      const todayButtonLI = document.createElement("li") as HTMLLIElement;
      const weekButtonLI = document.createElement("li") as HTMLLIElement;
      const favoriteButtonLI = document.createElement("li") as HTMLLIElement;

      const todayButton = document.createElement("a") as HTMLAnchorElement;
      todayButton.href = `/restaurants/daily/${restaurant._id}/fi`;
      todayButton.innerText = "Today's menu";

      const weekButton = document.createElement("a") as HTMLAnchorElement;
      weekButton.href = `/restaurants/weekly/${restaurant._id}/fi`;
      weekButton.innerText = "Week's menu";

      const favoriteButton = document.createElement("a") as HTMLAnchorElement;
      favoriteButton.innerText = "Add as a favorite";

      todayButton.classList.add("popup-button");
      weekButton.classList.add("popup-button");
      favoriteButton.classList.add("popup-button");

      todayButtonLI.appendChild(todayButton);
      weekButtonLI.appendChild(weekButton);
      favoriteButtonLI.appendChild(favoriteButton);
      buttonUL.appendChild(todayButtonLI).after(weekButtonLI);
      buttonUL.appendChild(favoriteButtonLI);
      popUpbuttons.appendChild(buttonUL);
      popUpPlaceholder.appendChild(popUpbuttons);

      const popUp = new mapboxgl.Popup().setDOMContent(popUpPlaceholder);

      marker.setPopup(popUp);
    }
  } catch (error) {
    console.error("Failed to fetch restaurants:", error);
  }

  return map;
};

export { initializeMap };
