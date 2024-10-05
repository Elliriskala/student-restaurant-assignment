import { initializeMap } from "./map";
import { LoginUser } from "./interfaces/User";
import { apiUrl } from "./variables";
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

const loginSuccess = document.querySelector(".login-success") as HTMLDialogElement;

const registerSuccess = document.querySelector(".register-success") as HTMLDialogElement;

document.addEventListener("DOMContentLoaded", () => {
  const loginDialog = document.querySelector(".login-dialog") as HTMLDialogElement;
  const showButton = document.querySelector("#login") as HTMLButtonElement;
  const closeButton = document.querySelector("#close") as HTMLButtonElement;

  const loginForm = document.querySelector("#login-form") as HTMLFormElement;
  const registerForm = document.querySelector("#register-form") as HTMLFormElement;

  // "Show the dialog" button opens the dialog modally
  showButton.addEventListener("click", () => {
    loginDialog.showModal();
  });

  // "Close" button closes the dialog
  closeButton.addEventListener("click", () => {
    loginDialog.close();
  });

  loginForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();

    const loginUsernameInput = document.querySelector(
      "#username-login"
    ) as HTMLInputElement | null;
    const loginPasswordInput = document.querySelector(
      "#password-login"
    ) as HTMLInputElement | null;

    try {
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
      console.log(result);

      if (result.token) {
        localStorage.setItem("token", result.token);
        loginDialog.close();
        loginSuccess.showModal();
      }
    } catch (error) {
      newError((error as Error).message);
    }
  });

  registerForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();

    const registerUsernameInput = document.querySelector(
      "#username-register"
    ) as HTMLInputElement | null;
    const registerPasswordInput = document.querySelector(
      "#password-register"
    ) as HTMLInputElement | null;
    const registerEmailInput = document.querySelector("#email-register") as HTMLInputElement | null;

    try {
      if (!registerUsernameInput || !registerEmailInput ||!registerPasswordInput) {
        throw new Error("Element not found");
      }

      const username = registerUsernameInput.value;
      const email = registerEmailInput.value;
      const password = registerPasswordInput.value;
    
      const data = {
        username,
        password,
        email
      };
    
      const options: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
    
      const result = await fetchData<LoginUser>(apiUrl + "/users", options);
      console.log(result);

      console.log("Server Response:", result);

      if (result.token) {
        localStorage.setItem("token", result.token);
        loginDialog.close();
        registerSuccess.showModal();
      }
    } catch (error) {
      newError((error as Error).message);
    }
  });
});


const submitButton = document.querySelector("#submit") as HTMLButtonElement;

if (submitButton) {
  submitButton.addEventListener("click", async () => {
  });
}
const registerButton = document.querySelector("#register-success") as HTMLButtonElement;

if (registerButton) {
  registerButton.addEventListener("click", async () => {
  });
}

const loginSuccessClose = document.querySelector("#success-close") as HTMLButtonElement;

if (loginSuccessClose) {
  loginSuccessClose.addEventListener("click", () => {
    loginSuccess.close();
  });
}

if (registerSuccess) {
  loginSuccessClose.addEventListener("click", () => {
    registerSuccess.close();
  });
}