import { initializeMap } from "./map";
import {UpdateResult} from './interfaces/UpdateResult';
import {UploadResult} from './interfaces/UploadResult';
import {LoginUser, UpdateUser, User} from './interfaces/User';
import {apiUrl, uploadUrl} from './variables';
import {fetchData} from './functions';

const newError = (message: string): void => {
  alert(message);
  console.error(message);
};

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
const submitButton = document.querySelector("#submit") as HTMLButtonElement;

// select inputs from the DOM
const usernameInput = document.querySelector(
  '#username'
) as HTMLInputElement | null;
const passwordInput = document.querySelector(
  '#password'
) as HTMLInputElement | null;

// "Show the dialog" button opens the dialog modally
showButton.addEventListener("click", () => {
  loginDialog.showModal();
});

// "Close" button closes the dialog
closeButton.addEventListener("click", () => {
  loginDialog.close();
});

// Login - submit button sends a POST request

const login = async (): Promise<LoginUser> => {
  if (!usernameInput || !passwordInput) {
    throw new Error('Element not found');
  }
  const username = usernameInput.value;
  const password = passwordInput.value;

  const data = {
    username,
    password,
  };

  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  const result = await fetchData<LoginUser>(apiUrl + '/auth/login', options);
  return result;
};

if (loginDialog) {
  loginDialog.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    try {
      const loginResult = await login();
      console.log(loginResult);
      localStorage.setItem('token', loginResult.token);
    } catch (error) {
      newError((error as Error).message);
    }
  });
}