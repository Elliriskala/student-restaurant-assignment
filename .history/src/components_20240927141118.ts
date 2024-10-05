import { DailyMenu } from 'types/Menu';
import { DailyMenu, WeeklyMenu, Day } from "./types/Menu";
import { Restaurant } from "./types/Restaurant";

const todayModal = async (menu: DailyMenu) => {
  let html = `
    <table>
      <h2>Today's menu</h2>
      <p>_date_</p>
      <tr>
        <th>Course</th>
        <th>Diet</th>
        <th>Price</th>
      </tr>
    `;

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

const weekModal = async (menu: WeeklyMenu[]) => {
  let html = `
    <table>
      <h2>This week's menu</h2>
      <p>_date_</p>
      <tr>
        <th>Course</th>
        <th>Diet</th>
        <th>Price</th>
      </tr>
    `;

  menu.forEach((DailyMenu) => {
    const {date, courses} = Day;
    courses.forEach((course) => {
      const {name, diets, price} = course;
      html += `
          <tr>
            <td>${date

const errorModal = (message: string) => {
  const html = `
        <h3>Error</h3>
        <p>${message}</p>
        `;
  return html;
};

export {restaurantRow, todayModal, errorModal};