import { fetchData } from "./functions";
import { apiUrl } from "./variables";
import { checkToken } from "./main";

// function to show favorite restaurants


const showFavorites = async (token: string): Promise<void> => {

    const favoritesList = document.querySelector("#favorites-list") as HTMLUListElement;

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
        
        const response = await fetchData<{ favoriteRestaurant: string | null }>(
            apiUrl + "/users/token", 
            options
        );
        
        console.log('Users data fetched: ', response);

        favoritesList.innerHTML = "";

        const { favoriteRestaurant } = response;

        if (!favoriteRestaurant) {
            favoritesList.innerHTML = "No favorite restaurants added yet.";
            return;
        }

        const restaurantResponse = await fetchData<{ name: string; address: string}>(
            apiUrl + `/restaurants/${favoriteRestaurant}`,
            options
        );

        const { name, address } = restaurantResponse;

        
        const li = document.createElement("li");
        li.textContent = `${name} - ${address}`;
            
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", async () => {
            await removeFavorite(token);
            await showFavorites(token);
        });
            
        li.appendChild(removeButton);
        favoritesList.appendChild(li);
        
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

        const result = await fetchData<{ message: string }>(apiUrl + "/users", options);
        console.log('Added to favorites: ', result);

        if (result.message === "Restaurant added to favorites") {
            await showFavorites(token);
        } else {
            console.error("Failed to add favorite restaurant:", result);
        }
    } catch (error) {
        console.error("Error adding favorite restaurant:", error);
    }
};

// function to remove a favorite restaurant

const removeFavorite = async (token: string): Promise<void> => {
    try {
        const options: RequestInit = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: 'Bearer ' + token,
            },
            body: JSON.stringify({ favoriteRestaurant: null}),
        };

        const result = await fetchData(apiUrl + "/users", options);
        console.log('Removed from favorites: ', result);

        await showFavorites(token);
    } catch (error) {
        console.error("Error removing favorite restaurant:", error);
    }
};

export { addFavorite, removeFavorite, showFavorites };
