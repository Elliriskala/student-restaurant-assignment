import { checkLogin } from "./main";
import { fetchData } from "./functions";
import { apiUrl } from "./variables";
import { Restaurant } from "./types/Restaurant";

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

const addFavorite = async (
  restaurantName: string,
  restaurantAddress: string
): Promise<void> => {
  if (!checkLogin()) {
    alert("You need to be logged in to add favorites");
    return;
  }

  const options: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },

    body: JSON.stringify({ name: restaurantName, address: restaurantAddress }),
  };

  await fetchData(apiUrl + "/users", options);
};

const removeFavorite = async (restaurantName: string): Promise<void> => {
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

    body: JSON.stringify({ name: restaurantName }),
  };

  await fetchData(apiUrl + "/users", options);
};

const showFavorites = (favorites: Restaurant[]): void => {
    const favoriteTable = document.querySelector(".favorite-restaurants") as HTMLTableElement;

    if (!favoriteTable) {
        return;
    }

    favoriteTable.innerHTML = "";

    favorites.forEach((restaurant) => {
        const tableRow = document.createElement("tr");
        tableRow.innerHTML = `
            <td>${restaurant.name} - ${restaurant.address}</td>
            `;

        favoriteTable.appendChild(tableRow);
    });
};

export { addFavorite, removeFavorite, showFavorites };
