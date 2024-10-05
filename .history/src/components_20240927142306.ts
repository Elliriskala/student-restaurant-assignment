import { DailyMenu, WeeklyMenu, Day } from "./types/Menu";

const todayModal = async (menu: DailyMenu) => {
  let html = `
    <table>
      <h2>Today's menu</h2>
      <p>Date</p>
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

const weekModal = async (menu: WeeklyMenu) => {
  let html = `
    <table>
      <h2>This week's menu</h2>
      <p>Date</p>
      <tr>
        <th>Course</th>
        <th>Diet</th>
        <th>Price</th>
      </tr>
    `;

  menu.days.forEach((day: Day) => {
    const {date, courses} = day;

    courses.forEach((course) => {
      const {name, diets, price} = course;
      html += `
          <tr>
          <td>${date}</td>
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

const errorModal = (message: string) => {
  const html = `
        <h3>Error</h3>
        <p>${message}</p>
        `;
  return html;
};

export {restaurantRow, todayModal, errorModal};