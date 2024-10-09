import { fetchData } from "./functions";
import { apiUrl } from "./variables";
import { Restaurant } from "./types/Restaurant";
import { LoginUser } from "./types/User";

// function to fetch restaurant by ID
const fetchFavoriteRestaurantId = async (
  token: string
): Promise<string | null> => {
  try {
    const userData = await fetchData<LoginUser>(apiUrl + "/users/token", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    console.log("Fetched user data:", userData);

    return userData.data.favouriteRestaurant || null;
  } catch (error) {
    console.error("Error fetching favorite restaurant ID:", error);
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

// function to show favorite restaurant
const addFavoriteToDom = async (token: string) => {
  const favoriteRestaurant = document.querySelector(
    "#your-favorite"
  ) as HTMLParagraphElement;

  if (!favoriteRestaurant) {
    console.error("Could not find favorite-paragraph element.");
    return;
  }

  try {
    const favoriteRestaurantId = await fetchFavoriteRestaurantId(token);
    console.log("Your favorite restaurant ID:", favoriteRestaurantId);

    if (!favoriteRestaurantId) {
      favoriteRestaurant.textContent = "No favorite restaurant selected.";
      return;
    }

    const restaurantDetails = await fetchRestaurantId(favoriteRestaurantId);

    if (!restaurantDetails) {
      favoriteRestaurant.textContent = "No favorite restaurant selected.";
      return;
    }

    const { name, address } = restaurantDetails;
    favoriteRestaurant.textContent = `${name} - ${address}`;
    console.log("Favorite restaurant:", name, address);

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", async () => {
      await removeFavorite(token, favoriteRestaurantId);
    });

    favoriteRestaurant.appendChild(removeButton);
  } catch (error) {
    console.error("Error fetching favorite restaurant:", error);
  }
};

// select the favorite restaurant
const addFavorite = async (token: string, restaurantId: string) => {
  try {
    const response = await fetchData(apiUrl + "/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        favoriteRestaurant: restaurantId,
      }),
    });

    console.log("Favorite restaurant set:", response);

    await addFavoriteToDom(token);
  } catch (error) {
    console.error("Error adding favorite restaurant:", error);
  }
};

// function to remove a favorite restaurant

const removeFavorite = async (token: string, restaurantId: string) => {
  try {
    const updatedOptions: RequestInit = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ favoriteRestaurant: restaurantId }),
    };

    const result = await fetchData<{ message: string }>(
      apiUrl + "/users",
      updatedOptions
    );
    console.log("Removed from favorites: ", result);

    await addFavoriteToDom(token);
  } catch (error) {
    console.error("Error removing favorite restaurant:", error);
  }
};

// function to select a restaurant

const handleAddFavorite = async (restaurant: Restaurant) => {
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

  await addFavorite(token, restaurant._id);
  console.log("Added to favorites:", restaurant);

  const modal = document.querySelector(
    "#favorite-success-modal"
  ) as HTMLDialogElement;
  const modalContent = document.querySelector(
    "#favorite-success-modal-content"
  ) as HTMLParagraphElement;
  modalContent.textContent = `Restaurant ${restaurant.name} added to favorites!`;
  modal.appendChild(modalContent);
  modal.showModal();
  setTimeout(() => {
    modal.close();
  }, 1200);
};

export { handleAddFavorite, addFavoriteToDom };
