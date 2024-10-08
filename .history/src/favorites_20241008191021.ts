import { fetchData } from "./functions";
import { apiUrl } from "./variables";

// function to show favorite restaurants


const showFavorites = async (token: string): Promise<void> => {

    const favoritesList = document.querySelector("#favorite-list") as HTMLUListElement;

    if (!favoritesList) {
        console.error("Could not find favorite-list element.");
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
        
        const response = await fetchData<{ favoriteRestaurant: string[] | null }>(
            apiUrl + "/users/token", 
            options
        );
        console.log('Users favorites fetched: ', response);

        favoritesList.innerHTML = "";

        const favoriteRestaurant = response.favoriteRestaurant;
        console.log('Favorite restaurants: ', favoriteRestaurant);

        if (!favoriteRestaurant || favoriteRestaurant.length === 0) {
            favoritesList.innerHTML = "No favorite restaurants added yet.";
            console.log("No favorites to display.");
            return;
        }

        for (const restaurantId of favoriteRestaurant) {
            console.log('Fetching details for restaurant ID:', restaurantId);

            const restaurantResponse = await fetchData<{ name: string; address: string}>(
            apiUrl + `/restaurants/${restaurantId}`,
            options
        );

        console.log('Fetched restaurant details:', restaurantResponse);
        if (!restaurantResponse || !restaurantResponse.name || !restaurantResponse.address) {
            console.warn(`No data returned for restaurant ID: ${restaurantId}`);
            continue;
        }

        const { name, address } = restaurantResponse;

        const li = document.createElement("li") as HTMLLIElement;
        li.textContent = `${name} - ${address}`;

        console.log('Restaurant name:', name);
        console.log('Restaurant address:', address);
            
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", async () => {
            await removeFavorite(token, restaurantId);
            await showFavorites(token);
        });
            
        li.appendChild(removeButton);
        favoritesList.appendChild(li);

        }

        console.log("Favorites list updated successfully.");
        
    } catch (error) {
        console.error("Error fetching favorites:", error);
    }
    
};

// the favorite restaurant table
const addFavorite = async (token: string, restaurantId: string): Promise<void> => {
    try {
        const options: RequestInit = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: 'Bearer ' + token,
            },
            body: JSON.stringify({ favoriteRestaurant: restaurantId }),
        };

        const result = await fetchData<{message: string, data: { favouriteRestaurant: string[] | null }}>(apiUrl + "/users", options);
        console.log('API response for adding favorite:', result);

        if (result.message === "User modified") {
            await showFavorites(token);
            const {favoriteRestaurant} = result.data.favouriteRestaurant;
            
            if (favoriteRestaurant.includes(restaurantId)) { // Check if the restaurant ID is in the array
                console.log("Successfully added restaurant to favorites.");

                const modal = document.querySelector("#favorite-success-modal") as HTMLDialogElement;
                modal.showModal();
                setTimeout(() => {
                    modal.close();
                }, 1200);
            } else {
                console.error("Favorite restaurant not updated as expected.");
            } 
        }
    } catch (error) {
        console.error("Error adding favorite restaurant:", error);
    }
};

// function to remove a favorite restaurant

const removeFavorite = async (token: string, restaurantId: string): Promise<void> => {
    try {
        const options: RequestInit = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: 'Bearer ' + token,
            },
            body: JSON.stringify({ favoriteRestaurant: restaurantId}),
        };

        const result = await fetchData(apiUrl + "/users", options);
        console.log('Removed from favorites: ', result);

        await showFavorites(token);
    } catch (error) {
        console.error("Error removing favorite restaurant:", error);
    }
};

export { addFavorite, removeFavorite, showFavorites };
