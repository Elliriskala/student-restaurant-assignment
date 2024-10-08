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
        
        console.log('Users data fetched: ', response);

        favoritesList.innerHTML = "";

        const { favoriteRestaurant } = response;

        if (!favoriteRestaurant || favoriteRestaurant.length === 0) {
            favoritesList.innerHTML = "No favorite restaurants added yet.";
            return;
        }

        for (const restaurantId of favoriteRestaurant) {
            const restaurantResponse = await fetchData<{ name: string; address: string}>(
            apiUrl + `/restaurants/${restaurantId}`,
            options
        );

        console.log('Fetched restaurant details:', restaurantResponse);
        const { name, address } = restaurantResponse;

        const li = document.createElement("li");
        li.textContent = `${name} - ${address}`;
            
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

        const result = await fetchData<{message: string}>(apiUrl + "/users", options);
        console.log('API response for adding favorite:', result);

        if (result && result.message) {
            console.log('Message from API:', result.message);
            if (result.message === "user modified") { 
                console.log("Successfully added restaurant to favorites.");

                const modal = document.querySelector("#favorite-success-modal") as HTMLDialogElement;
                if (modal) {
                    modal.showModal();
                    setTimeout(() => {
                        modal.close();
                    }, 1200);
                } else {
                    console.error("Favorite restaurant not updated as expected.");
                }   

                await showFavorites(token);

             } else {
                console.warn("Unexpected message:", result.message);
            }
         } else {
            console.error("Result does not have expected structure:", result);
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
