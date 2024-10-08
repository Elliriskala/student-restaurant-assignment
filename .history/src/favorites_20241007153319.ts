import { checkLogin } from './main';

const favoriteRestaurants = document.querySelector(".favorite-restaurants") as HTMLTableElement | null;

const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th id="favorite-restaurants">Favorite restaurants:</th>
    </tr>
  `;
  favoriteRestaurants?.appendChild(thead);

const addFavorite = async (restaurantName: string, restaurantAddress: string): Promise<void> => {
  if (!checkLogin()) {
    alert('You need to be logged in to add favorites');
    return;
  }

  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

  const newFavorite = { name: restaurantName, address: restaurantAddress };
  favorites.push(newFavorite);

  localStorage.setItem('favorites', JSON.stringify(favorites));

  const tableRow = document.createElement("tr");
  tableRow.innerHTML = `
    <td>${restaurantName} - ${restaurantAddress}</td>
  `;
  favoriteRestaurants?.appendChild(tableRow);
  
};

const removeFavorite = async (restaurantName: string): Promise<void> => {
  if (!checkLogin()) {
    alert('You need to be logged in to remove favorites');
    return;
  }

  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  const updateFavorites = favorites.filter((favorite: { name: string; }) => favorite.name !== restaurantName);

  localStorage.setItem('favorites', JSON.stringify(updateFavorites));

  window.location.reload();
}

const showFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    favorites.forEach((restaurant: { name: string; address: string; }) => {
        const tableRow = document.createElement("tr");
        tableRow.innerHTML = `
        <td>${restaurant.name} - ${restaurant.address}</td>
        `;
        favoriteRestaurants?.appendChild(tableRow);
    });
}

export { addFavorite, removeFavorite, showFavorites };