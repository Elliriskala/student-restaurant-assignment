import { Restaurant } from "./types/Restaurant";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import { apiUrl } from "./variables";
import { fetchData } from "./functions";
import { todayModal, weekModal, errorModal } from "./components";
import { addFavorite } from "./main";

import { Day, WeeklyMenu } from "./types/Menu";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZWxsaW5vcm1ldHJvcG9saWEiLCJhIjoiY20xZjZzbm56MHFxajJtczlybTVmbHc0MyJ9.l94aCqR68sI1_1pJBfWyYg";

const initializeMap = async () => {
  const map = new mapboxgl.Map({
    container: "map-container",
    style: "mapbox://styles/mapbox/outdoors-v11",
    center: [24.9, 60.2],
    zoom: 11.5,
    projection: "globe",
    bearing: -10,
    pitch: 65,
  });
  map.addControl(new mapboxgl.NavigationControl());

  try {
    const restaurants = await fetchData<Restaurant[]>(apiUrl + "/restaurants");

    const filteredMarkers: mapboxgl.Marker[] = [];
    let closestRestaurant: Restaurant | null = null;
    let closestDistance = Infinity;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLatitude = position.coords.latitude;
        const userLongitude = position.coords.longitude;

        for (const restaurant of restaurants) {
          const [longitude, latitude] = restaurant.location.coordinates;

          if (isNaN(longitude) || isNaN(latitude)) {
            console.error(
              `Invalid coordinates for ${restaurant.name}: [${longitude}, ${latitude}]`
            );
            return;
          }

          const calculateDistance = Math.sqrt(
            (userLatitude - latitude) ** 2 + (userLongitude - longitude) ** 2
          );

          if (calculateDistance < closestDistance) {
            closestDistance = calculateDistance;
            closestRestaurant = restaurant;
          }

          if (closestRestaurant !== restaurant) {
            const markerElement = document.createElement("div");
            markerElement.className = "custom-marker";

            const marker = new mapboxgl.Marker({
              element: markerElement,
            }).setLngLat([longitude, latitude]);

            initializePopup(restaurant, marker);
            marker.addTo(map);
            filteredMarkers.push(marker);
          }
        }

        if (closestRestaurant) {
          const [longitude, latitude] = closestRestaurant.location.coordinates;

          const closestMarkerElement = document.createElement(
            "div"
          ) as HTMLDivElement;
          closestMarkerElement.className = "custom-marker closest";

          const closestMarker = new mapboxgl.Marker({
            element: closestMarkerElement,
          }).setLngLat([longitude, latitude]);

          initializePopup(closestRestaurant, closestMarker);
          closestMarker.addTo(map);

          map.flyTo({
            center: [longitude, latitude],
            zoom: 12,
            essential: true,
          });
        }

        filterRestaurants(restaurants, map, filteredMarkers);
      },
      (error) => {
        console.error("Error getting location", error);
      }
    );
  } catch (error) {
    console.error("Failed to fetch restaurants", error);
  }

  return map;
};

// buttons for filtering
const filterRestaurants = (
  restaurants: Restaurant[],
  map: mapboxgl.Map,
  filteredMarkers: mapboxgl.Marker[]
) => {
  const sodexoBtn = document.querySelector("#sodexo");
  const compassBtn = document.querySelector("#compass");
  const resetBtn = document.querySelector("#reset");

  if (!sodexoBtn || !compassBtn || !resetBtn) {
    console.log("Button element was not found in HTML!");
    return;
  }

  const resetMarkers = (filteredRestaurants: Restaurant[]) => {
    filteredMarkers.forEach((marker, index) => {
      const restaurant = restaurants[index];

      if (filteredRestaurants.includes(restaurant)) {
        marker.addTo(map);
      } else {
        marker.remove();
      }
    });
  };

  sodexoBtn.addEventListener("click", () => {
    const sodexoRestaurants = restaurants.filter(
      (restaurant) => restaurant.company === "Sodexo"
    );
    resetMarkers(sodexoRestaurants);
  });

  compassBtn.addEventListener("click", () => {
    const compassRestaurants = restaurants.filter(
      (restaurant) => restaurant.company === "Compass Group"
    );
    resetMarkers(compassRestaurants);
  });

  resetBtn.addEventListener("click", () => {
    resetMarkers(restaurants);
  });
};

const initializePopup = (restaurant: Restaurant, marker: mapboxgl.Marker) => {
  const popUpPlaceholder = document.createElement("div") as HTMLDivElement;
  popUpPlaceholder.classList.add("popup");

  const companyName = document.createElement("h2") as HTMLHeadingElement;
  companyName.innerText = `${restaurant.name} - ${restaurant.company}`;

  popUpPlaceholder.appendChild(companyName);

  const companyAddress = document.createElement("p") as HTMLParagraphElement;
  companyAddress.innerText = `${restaurant.address}, ${restaurant.postalCode} ${restaurant.city}`;

  popUpPlaceholder.appendChild(companyAddress);

  const companyPhone = document.createElement("p") as HTMLParagraphElement;
  companyPhone.innerText = `${
    restaurant.phone && restaurant.phone.trim() !== "-"
      ? restaurant.phone
      : "No phone number"
  }`;

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

  todayButton.addEventListener("click", (event) => {
    event.preventDefault();
    showTodaymenu([restaurant]);
  });

  const weekButton = document.createElement("a") as HTMLAnchorElement;
  weekButton.href = `/restaurants/weekly/${restaurant._id}/fi`;
  weekButton.innerText = "Week's menu";

  weekButton.addEventListener("click", (event) => {
    event.preventDefault();
    showWeekmenu([restaurant]);
  });

  const favorites: Restaurant[] = [];

  const favoriteDiv = document.createElement("div") as HTMLDivElement;
  favoriteDiv.classList.add("favorite-restaurant");

  const favoriteButton = document.createElement("button") as HTMLButtonElement;
  favoriteButton.innerText = "Add as a favorite";

  const removeFavorite = document.createElement("button") as HTMLButtonElement;
  removeFavorite.innerText = "Remove from favorites";

  favoriteButton.addEventListener("click", async (event) => {
    event.preventDefault();
    await addFavorite(restaurant.name, restaurant.address);
    favorites.push(restaurant);
  });

  removeFavorite.addEventListener("click", async (event) => {
    event.preventDefault();
    favorites.pop();
    console.log("Remove favorite");
  });

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
};

const showTodaymenu = (restaurants: Restaurant[]) => {
  const modal = document.querySelector("#today-menu") as HTMLDialogElement;
  if (!modal) {
    throw new Error("Modal not found");
  }
  modal.addEventListener("click", () => {
    modal.close();
  });

  const table = document.createElement("table") as HTMLTableElement;

  modal.innerHTML = "";

  table.innerHTML = "";
  restaurants.forEach(async (restaurant) => {
    try {
      const menu = await fetchData<Day>(
        apiUrl + `/restaurants/daily/${restaurant._id}/fi`
      );
      console.log(menu);

      const menuHtml = todayModal(menu);
      modal.insertAdjacentHTML("beforeend", await menuHtml);

      modal.showModal();
    } catch (error) {
      modal.innerHTML = errorModal((error as Error).message);
      modal.showModal();
    }
  });
};

const showWeekmenu = (restaurants: Restaurant[]) => {
  const modal = document.querySelector("#week-menu") as HTMLDialogElement;
  if (!modal) {
    throw new Error("Modal not found");
  }
  modal.addEventListener("click", () => {
    modal.close();
  });

  const table = document.createElement("table") as HTMLTableElement;

  modal.innerHTML = "";

  table.innerHTML = "";
  restaurants.forEach(async (restaurant) => {
    try {
      const menu = await fetchData<WeeklyMenu>(
        apiUrl + `/restaurants/weekly/${restaurant._id}/fi`
      );
      console.log(menu);

      const menuHtml = weekModal(menu);
      modal.insertAdjacentHTML("beforeend", await menuHtml);

      modal.showModal();
    } catch (error) {
      modal.innerHTML = errorModal((error as Error).message);
      modal.showModal();
    }
  });
};

export { initializeMap };
