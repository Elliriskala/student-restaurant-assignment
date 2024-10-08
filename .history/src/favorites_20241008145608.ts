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
        
        const response = await fetchData<{ name: string; address: string; _id: number }[]>(
            apiUrl + "/users/token", 
            options
        );

        console.log('Favorites: ', response);

        if (!response || response.length === 0) {
            favoritesList.innerHTML = "";
            return;
        }
        
        favoritesList.innerHTML = "";
        
        response.forEach((restaurant: { name: string; address: string; _id: number }) => {
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
        favoritesList.innerHTML = "<li>Failed to load favorites.</li>";
    }
    
};

// the favorite restaurant table
const addFavorite = async (token: string, restaurantId: number): Promise<void> => {
    try {
        const options: RequestInit = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: 'Bearer ' + token,
            },
            body: JSON.stringify({ restaurantId }),
        };

        const result: { message?: string } = await fetchData(apiUrl + "/users", options);
        console.log('Added to favorites: ', result);

        if (result && result.message === "Restaurant added to favorites") {
            console.log("Restaurant added to favorites");
            await showFavorites(token);
        } else {
            console.error("Failed to add favorite restaurant:", result);
        }
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

        const result = await fetchData(apiUrl + "/users", options);
        console.log('Removed from favorites: ', result);

        await showFavorites(token);
    } catch (error) {
        console.error("Error removing favorite restaurant:", error);
    }
};

export { addFavorite, removeFavorite, showFavorites };
