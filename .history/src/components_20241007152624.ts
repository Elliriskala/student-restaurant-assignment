import { WeeklyMenu, Day } from "./types/Menu";
import { checkLogin } from "./main";

const todayModal = async (menu: Day) => {
  let html = `
    <table>
      <h2>Today's menu</h2>
      <tr>
        <th>Course</th>
        <th>Diet</th>
        <th>Price</th>
      </tr>
    `;

  if (menu.courses.length === 0) {
    return 'No menu available for today';
  }

  menu.courses.forEach((course) => {
    const {name, diets, price} = course;
    html += `
          <tr>
            <td>${name}</td>
            <td>${diets ?? ' - '}</td>
            <td>${price ?? ' - '}</td>
          </tr>
          `;
  });
  html += '</table>';
  return html;
};

const weekModal = async (menu: WeeklyMenu) => {

  let html = `
    <table>
      <h2>This week's menu</h2>
      `;
  
  if (menu.days.length === 0) {
    return 'No menu available for this week';
  }

  menu.days.forEach((day: Day) => {
    const {courses} = day;
    html += `
      <tr>
        <th <style class="date"</style>${day.date}</th>
      </tr>
      <tr>
        <th>Course</th>
        <th>Diet</th>
        <th>Price</th>
      </tr>
    `;

    courses.forEach((course) => {
      const {name, diets, price} = course;
      html += `
          <tr>
          <td>${name}</td>
          <td>${diets ?? ' - '}</td>
          <td>${price ?? ' - '}</td>
        </tr>
        `;
    });
  });
  html += '</table>'
  return html;
};

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

const errorModal = (message: string) => {
  const html = `
        <h3>Error</h3>
        <p>${message}</p>
        `;
  return html;
};

export {todayModal, weekModal, errorModal, addFavorite};