import { fetchData } from "./functions";
import { apiUrl } from "./variables";
import { Restaurant } from "./types/Restaurant";

// function to show favorite restaurants

const showFavorites = async (token: string): Promise<void> => {
  const favoriteRestaurant = document.querySelector(
    "#your-favorite"
  ) as HTMLParagraphElement;

  if (!favoriteRestaurant) {
    console.error("Could not find favorite-paragraph element.");
    return;
  }

  try {
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    const response = await fetchData<{ restaurantId : string }>(
      apiUrl + '/users/token/',
      options
    );
    console.log("Users favorite fetched: ", response);

    const yourFavorite = response.restaurantId; 

    favoriteRestaurant.innerHTML = "";

    console.log("Fetching details for restaurant ID:", yourFavorite);

    const restaurantResponse = await fetchData<{
        name: string;
        address: string;
      }>(apiUrl + `/restaurants}`, options);

      console.log("Fetched restaurant details:", restaurantResponse);

      const { name, address } = restaurantResponse;

      
      favoriteRestaurant.textContent = `${name} - ${address}`;

      console.log("Restaurant name:", name);
      console.log("Restaurant address:", address);

      const removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.addEventListener("click", async () => {
        await showFavorites(token);
      });

    console.log("Favorites list updated successfully.");

  } catch (error) {
    console.error("Error fetching favorites:", error);
  }
};

// Function to fetch the current user's favorites after updating
const fetchUserFavorites = async (token: string): Promise<void> => {
    try {
        const response = await fetch(apiUrl + "/users/token", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + token,
            },
        });
        if (!(response instanceof Response) || !response.ok) {
            throw new Error("Failed to fetch user favorites.");
        }
        const userData = await response.json();
        console.log("Users favorites fetched after update:", userData);
    } catch (error) {
        console.error("Error fetching user favorites:", error);
    }
};

// the favorite restaurant table
const addFavorite = async (
  token: string,
  restaurantId: string
): Promise<void> => {
  try {

    const currentFavorites = await fetchUserFavorites(token);
    console.log("Current favorites:", currentFavorites);

    const updatedFavorites = [currentFavorites, restaurantId];

    const response = await fetch(apiUrl + "/users", {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ 
        favoriteRestaurant: updatedFavorites
        }),
    });

    if (!response.ok) {
      throw new Error("Failed to add favorite restaurant.");
    }

    const data = await response.json();
    console.log("API response for adding favorite:", data);

    await showFavorites(token);

  } catch (error) {
    console.error("Error adding favorite restaurant:", error);
  }
};

// function to select a restaurant

const restaurantSelection = async (restaurantId: string): Promise<void> => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      const modal = document.querySelector("#please-login-modal") as HTMLDialogElement;
      modal.showModal();
      setTimeout(() => {
        modal.close();
      }, 1500);
      return;
    }
  
    try {
      const restaurant = await fetchData<Restaurant>(apiUrl + `/restaurants/${restaurantId}`);
      console.log("Restaurant selected:", restaurant);
  
      addFavorite(token, restaurantId);

      const modal = document.querySelector("#favorite-success-modal") as HTMLDialogElement;
      const modalContent = document.querySelector("#favorite-success-modal-content") as HTMLParagraphElement;
        modalContent.textContent = `Restaurant ${restaurant.name} added to favorites!`;
        modal.appendChild(modalContent);
        modal.showModal();
        setTimeout(() => {
          modal.close();
        }, 1200);

    } catch (error) {
      alert("Failed to add restaurant to favorites.");
      console.error("Failed to add restaurant to favorites:", error);
    }
  };

// function to remove a favorite restaurant

const removeFavorite = async (
  token: string,
  restaurantId: string
): Promise<void> => {
  try {
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    const response = await fetchData<{ favoriteRestaurant: string[] }>(
      apiUrl + `/users/token`,
      options
    );

    const updatedFavorites = response.favoriteRestaurant.filter(
      (id) => id !== restaurantId
    );

    const updatedOptions: RequestInit = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ favoriteRestaurant: updatedFavorites }),
    };

    const result = await fetchData<{ message: string }>(
      apiUrl + "/users",
      updatedOptions
    );
    console.log("Removed from favorites: ", result);

    await showFavorites(token);
  } catch (error) {
    console.error("Error removing favorite restaurant:", error);
  }
};

export { addFavorite, removeFavorite, showFavorites, restaurantSelection };
