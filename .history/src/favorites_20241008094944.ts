import { checkLogin } from "./main";
import { fetchData } from "./functions";
import { apiUrl } from "./variables";


// the favorite restaurant table
const favoriteRestaurants = document.querySelector(
  ".favorite-restaurants"
) as HTMLTableElement | null;

const thead = document.createElement("thead");
thead.innerHTML = `
    <tr>
      <th id="favorite-restaurants">Favorite restaurants:</th>
    </tr>
  `;
favoriteRestaurants?.appendChild(thead);

// function to add a favorite restaurant
const addFavoriteRestaurant = async (token: string, restaurantId: string): Promise<void> => {
    if (!checkLogin()) {
        alert("You need to be logged in to remove favorites");
        return;
      }
    
    const response: Response = await fetchData(apiUrl + '/users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({ favouriteRestaurant: restaurantId })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Favorite restaurant added:', data);
      await showFavorites(token);
    } else {
      const errorData = await response.json();
      console.error('Error adding favorite restaurant:', errorData);
    }
  }

// function to remove a favorite restaurant

const removeFavorite = async (restaurantId: string): Promise<void> => {
  if (!checkLogin()) {
    alert("You need to be logged in to remove favorites");
    return;
  }

  const options: RequestInit = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },

    body: JSON.stringify({ favouriteRestaurant: restaurantId }),
  };

  const response: Response = await fetchData(apiUrl + '/users', options);
  
  if (response.ok) {
    console.log('Favorite restaurant removed successfully');
    await showFavorites(localStorage.getItem("token") || ""); 
  } else {
    const errorData = await response.json();
    console.error('Error removing favorite restaurant:', errorData);
  }
};

// function to show favorite restaurants

const showFavorites = async (token: string): Promise<void> => {

    const favoriteTable = document.querySelector(".favorite-restaurants") as HTMLTableElement;

    const response: Response = await fetchData(apiUrl + "/users/token", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.ok) {
        const data = await response.json();
        const favoriteRestaurantIds: string[] = data.favouriteRestaurant;
        
        favoriteTable.innerHTML = "";
        const tbody = document.createElement("tbody") as HTMLTableSectionElement;

        if (!favoriteRestaurantIds.length) {
            const tableRow = document.createElement("tr");
            tableRow.innerHTML = `
                <td colspan="2">No favorite restaurants</td>
            `;
            tbody.appendChild(tableRow);
          } else {
            await Promise.all(favoriteRestaurantIds.map(async (restaurantId) => {
                const restaurant: Response = await fetchData(apiUrl + `/restaurants/${restaurantId}`); // Assuming you have an endpoint to get restaurant details
                const restaurantData = await restaurant.json();
        
                const tableRow = document.createElement("tr");
                tableRow.innerHTML = `
                    <td>${restaurantData.name}</td>
                    <td><button class="remove-favorite" data-id="${restaurantId}">Remove</button></td>
                `;
        
                // Add event listener for the remove button
                tableRow.querySelector(".remove-favorite")?.addEventListener("click", () => {
                  removeFavorite(restaurantId);
                });
        
                tbody.appendChild(tableRow);
              }));
            }
        
            favoriteTable.appendChild(tbody);
          } else {
            console.error('Error fetching user favorites:', await response.json());
          }  
};

export { addFavoriteRestaurant, removeFavorite, showFavorites };
