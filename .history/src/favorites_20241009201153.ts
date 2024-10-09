import { fetchData } from "./functions";
import { apiUrl } from "./variables";
import { Restaurant } from "./types/Restaurant";
import { User } from "./interfaces/User";

// function to fetch restaurant by ID
const fetchFavouriteRestaurantId = async (
  token: string
): Promise<string | null> => {
  try {
    const userData = await fetchData<User>(apiUrl + "/users/token", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    console.log("Fetched user data:", userData);

    if (!userData || !userData.favouriteRestaurant) {
        console.log("Favourite restaurant not found in user data.");
        return null; 
      }
      
      return userData.favouriteRestaurant;
  } catch (error) {
    console.error("Error fetching favourite restaurant ID:", error);
    return null;
  }
};

// function to fetch restaurant by ID
const fetchRestaurantId = async (
  restaurantId: string
): Promise<{ name: string; address: string } | null> => {
  try {
    const restaurantData = await fetchData<{ name: string, address: string}>(apiUrl + `/restaurants/${restaurantId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { name, address } = restaurantData;
    return { name, address };
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return null;
  }
};

// function to show favourite restaurant
const addFavouriteToDom = async (token: string) => {
  const favouriteRestaurant = document.querySelector(
    "#your-favourite"
  ) as HTMLParagraphElement;

  if (!favouriteRestaurant) {
    console.error("Could not find favourite-paragraph element.");
    return;
  }

  try {
    const favouriteRestaurantId = await fetchFavouriteRestaurantId(token);
    console.log("Your favourite restaurant ID:", favouriteRestaurantId);

    if (!favouriteRestaurantId) {
      favouriteRestaurant.textContent = "No favourite restaurant selected.";
      return;
    }

    const restaurantDetails = await fetchRestaurantId(favouriteRestaurantId);

    if (!restaurantDetails) {
      favouriteRestaurant.textContent = "No favourite restaurant selected.";
      return;
    }

    const { name, address } = restaurantDetails;
    favouriteRestaurant.textContent = `${name} - ${address}`;
    console.log("Favourite restaurant:", name, address);

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", async () => {
      await removeFavourite(token, favouriteRestaurantId);
    });

    favouriteRestaurant.appendChild(removeButton);
  } catch (error) {
    console.error("Error fetching favourite restaurant:", error);
  }
};

// select the favourite restaurant
const addFavourite = async (token: string, restaurantId: string) => {
  try {
    const response = await fetchData(apiUrl + "/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        favouriteRestaurant: restaurantId,
      }),
    });

    console.log("Favourite restaurant set:", response);

    await addFavouriteToDom(token);
  } catch (error) {
    console.error("Error adding favourite restaurant:", error);
  }
};

// function to remove a favourite restaurant

const removeFavourite = async (token: string, restaurantId: string) => {
  try {
    const updatedOptions: RequestInit = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ favouriteRestaurant: restaurantId }),
    };

    const result = await fetchData<{ message: string }>(
      apiUrl + "/users",
      updatedOptions
    );
    console.log("Removed from favourites: ", result);

    await addFavouriteToDom(token);
  } catch (error) {
    console.error("Error removing favourite restaurant:", error);
  }
};

// function to select a restaurant

const handleAddFavourite = async (restaurant: Restaurant) => {
  const token = localStorage.getItem("token");

  if (!token) {
    const modal = document.querySelector(
      "#please-login-modal"
    ) as HTMLDialogElement;
    modal.showModal();
    setTimeout(() => {
      modal.close();
    }, 1500);
    return;
  }

  await addFavourite(token, restaurant._id);
  console.log("Added to favourites:", restaurant);

  const modal = document.querySelector(
    "#favourite-success-modal"
  ) as HTMLDialogElement;
  const modalContent = document.querySelector(
    "#favourite-success-modal-content"
  ) as HTMLParagraphElement;
  modalContent.textContent = `Restaurant ${restaurant.name} added to favourites!`;
  modal.appendChild(modalContent);
  modal.showModal();
  setTimeout(() => {
    modal.close();
  }, 1200);
};

export { handleAddFavourite, addFavouriteToDom };
