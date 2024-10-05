import { initializeMap } from "./map";
import { UpdateResult } from "./interfaces/UpdateResult";
import { UploadResult } from "./interfaces/UploadResult";
import { LoginUser, UpdateUser, User } from "./interfaces/User";
import { apiUrl, uploadUrl } from "./variables";
import { fetchData } from "./functions";

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

const loginForm = document.querySelector("#login-form") as HTMLFormElement;
const submitButton = document.querySelector("#submit") as HTMLButtonElement;

if (submitButton) {
  submitButton.addEventListener("click", async () => {
    loginDialog.close();
  });
}

const loginSuccess = document.querySelector("#login-success") as HTMLDivElement;

// select register inputs from the DOM
const usernameInput = document.querySelector(
  "#username-register"
) as HTMLInputElement | null;
const passwordInput = document.querySelector(
  "#password-register"
) as HTMLInputElement | null;

// select login inputs from the DOM

const loginUsernameInput = document.querySelector(
  "#username-login"
) as HTMLInputElement | null;
const loginPasswordInput = document.querySelector(
  "#password-login"
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
  if (!loginUsernameInput || !loginPasswordInput) {
    throw new Error("Element not found");
  }
  const username = loginUsernameInput.value;
  const password = loginPasswordInput.value;

  const data = {
    username,
    password,
  };

  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  const result = await fetchData<LoginUser>(apiUrl + "/auth/login", options);
  return result;
};

if (loginForm) {
  loginForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    try {
      const loginResult = await login();
      console.log(loginResult);
      loginSuccess.innerHTML = `Welcome, ${loginResult}`;
      localStorage.setItem("token", loginResult.token);
    } catch (error) {
      newError((error as Error).message);
    }
  });
}
