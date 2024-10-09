import { fetchData } from "./functions";
import { apiUrl } from "./variables";
import { Restaurant } from "./types/Restaurant";

// function to show favorite restaurant
const addFavoriteToDom = async (token: string): Promise<void> => {
  const favoriteRestaurant = document.querySelector(
    "#your-favorite"
  ) as HTMLParagraphElement;

  if (!favoriteRestaurant) {
    console.error("Could not find favorite-paragraph element.");
    return;
  }

  const fetchRestaurantId = async (restaurantId: string) => {
    try {
        const response = await fetch(`https://media1.edu.metropolia.fi/restaurant/api/v1/restaurants/${restaurantId}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch restaurant with ID: ${restaurantId}`);
          }

          const restaurant = await response.json(); 
          console.log("Fetched restaurant:", restaurant);
          
          return restaurant;
        } catch (error) {
          console.error("Error fetching restaurant:", error);
        }
      };

    const favoriteRestaurantId = fetchRestaurantId(token);
    console.log("Your favorite restaurant:", favoriteRestaurantId);

    if (!favoriteRestaurantId) {
      favoriteRestaurant.textContent = "No favorite restaurant selected.";
      return;
    }

    const restaurantResponse = await fetchData<{
      name: string;
      address: string;
    }>(apiUrl + `/restaurants/${favoriteRestaurantId}`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
    }
    });

    console.log("Fetched restaurant details:", restaurantResponse);

    const { name, address } = restaurantResponse;
    favoriteRestaurant.textContent = `${name} - ${address}`;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", async () => {
      await removeFavorite(token, favoriteRestaurantId);
    });

    favoriteRestaurant.appendChild(removeButton);

};

// the favorite restaurant to the DOM
const addFavorite = async (
  token: string,
  restaurantId: string
): Promise<void> => {
  try {
    const response = await fetch(apiUrl + "/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        favoriteRestaurant: restaurantId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add favorite restaurant.");
    }

    await addFavoriteToDom(token);
    console.log("Restaurant added to favorites");
  } catch (error) {
    console.error("Error adding favorite restaurant:", error);
  }
};

// function to remove a favorite restaurant

const removeFavorite = async (
  token: string,
  restaurantId: string
): Promise<void> => {
  try {
    const updatedOptions: RequestInit = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ favoriteRestaurant: restaurantId })
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

  const modal = document.querySelector("#favorite-success-modal") as HTMLDialogElement;
  const modalContent = document.querySelector("#favorite-success-modal-content") as HTMLParagraphElement;
  modalContent.textContent = `Restaurant ${restaurant.name} added to favorites!`;
  modal.appendChild(modalContent);
  modal.showModal();
    setTimeout(() => {
      modal.close();
    }, 1200);
};

export { handleAddFavorite, addFavoriteToDom
 };
