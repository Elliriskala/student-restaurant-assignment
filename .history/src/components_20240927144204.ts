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
        <th>${day.date}</th>
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

const errorModal = (message: string) => {
  const html = `
        <h3>Error</h3>
        <p>${message}</p>
        `;
  return html;
};

export {todayModal, weekModal, errorModal};