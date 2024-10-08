import { fetchData } from "./functions";
import { apiUrl } from "./variables";

// function to show favorite restaurants

const showFavorites = async (token: string): Promise<void> => {

    const favoritesList = document.querySelector("#favorite-list") as HTMLUListElement | null;

    if (!favoritesList) {
        const noFavoritesDiv = document.querySelector('.favorites-container') as HTMLDivElement | null;
        const noFavorites = document.createElement("p");
        noFavorites.textContent = "No favorites added yet.";
        noFavoritesDiv?.appendChild(noFavorites);
        return;
    }

    try {
        const options: RequestInit = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: 'Bearer ' + token,
            },
        };

        const favorites = await fetchData<{ name: string; address: string; _id: number }[]>(
            apiUrl + "/users/token/favouriteRestaurant", 
            options
        );

        favoritesList.innerHTML = "";

        favorites.forEach((restaurant: { name: string; address: string; _id: number }) => {
            const li = document.createElement("li");
            li.textContent = `${restaurant.name} - ${restaurant.address}`;

            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.addEventListener("click", async () => {
                await removeFavorite(token, restaurant._id);
                await showFavorites(token);
            });

            li.appendChild(removeButton);
            favoritesList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching favorites:", error);
    }
};

// the favorite restaurant table
const addFavorite = async (token: string, restaurantId: number): Promise<void> => {
    try {
        const options: RequestInit = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: 'Bearer ' + token,
            },
            body: JSON.stringify({ restaurantId }),
        };

        const result = await fetchData(apiUrl + "/users/favouriteRestaurant", options);
        console.log('Added to favorites: ', result);

        await showFavorites(token);
    } catch (error) {
        console.error("Error adding favorite restaurant:", error);
    }
};

// function to remove a favorite restaurant

const removeFavorite = async (token: string, restaurantId: number): Promise<void> => {
    try {
        const options: RequestInit = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: 'Bearer ' + token,
            },
            body: JSON.stringify({ restaurantId }),
        };

        const result = await fetchData(apiUrl + "/users/favouriteRestaurant", options);
        console.log('Removed from favorites: ', result);

        await showFavorites(token);
    } catch (error) {
        console.error("Error removing favorite restaurant:", error);
    }
};

export { addFavorite, removeFavorite, showFavorites };
