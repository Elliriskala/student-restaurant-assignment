import { initializeMap } from "./map";

document.addEventListener("DOMContentLoaded", () => {
  try {
    initializeMap();
    console.log("Map initialized");
  } catch (error) {
    console.error("Error initializing map:", error);
  }
});

const modal = document.querySelector(".menu-dialog") as HTMLDialogElement;
if (!modal) {
  throw new Error("Modal not found");
}
modal.addEventListener("click", () => {
  modal.close();
});

const loginDialog = document.querySelector(
  ".login-dialog"
) as HTMLDialogElement;
const showButton = document.querySelector("#login") as HTMLButtonElement;
const closeButton = document.querySelector("#close") as HTMLButtonElement;

// "Show the dialog" button opens the dialog modally
showButton.addEventListener("click", () => {
  loginDialog.showModal();
});

// "Close" button closes the dialog
closeButton.addEventListener("click", () => {
  loginDialog.close();
});
