import { initializeMap } from "./map";

document.addEventListener("DOMContentLoaded", () => {
  try {
    initializeMap();
    console.log("Map initialized");
  } catch (error) {
    console.error("Error initializing map:", error);
  }
});

const modal = document.querySelector(".menu-dialog") as HTMLDialogElement;
if (!modal) {
  throw new Error("Modal not found");
}
modal.addEventListener("click", () => {
  modal.close();
});

const loginDialog = document.querySelector(
  ".login-dialog"
) as HTMLDialogElement;
const showButton = document.querySelector("#login") as HTMLButtonElement;
const closeButton = document.querySelector("#close") as HTMLButtonElement;

// "Show the dialog" button opens the dialog modally
showButton.addEventListener("click", () => {
  loginDialog.showModal();
});

// "Close" button closes the dialog
closeButton.addEventListener("click", () => {
  loginDialog.close();
});

/*

const calculateDistance = (x1: number, y1: number, x2: number, y2: number) =>
  Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

const error = (err: GeolocationPositionError) => {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};

const success = async (pos: GeolocationPosition) => {
  try {
    const crd = pos.coords;
    const restaurants = await fetchData<Restaurant[]>(apiUrl + "/restaurants");
    console.log(restaurants);
    restaurants.sort((a, b) => {
      const x1 = crd.latitude;
      const y1 = crd.longitude;
      const x2a = a.location.coordinates[1];
      const y2a = a.location.coordinates[0];
      const distanceA = calculateDistance(x1, y1, x2a, y2a);
      const x2b = b.location.coordinates[1];
      const y2b = b.location.coordinates[0];
      const distanceB = calculateDistance(x1, y1, x2b, y2b);
      return distanceA - distanceB;
    });
  } catch (error) {
    modal.innerHTML = errorModal((error as Error).message);
    modal.showModal();
  }
};

navigator.geolocation.getCurrentPosition(success, error, positionOptions);
*/