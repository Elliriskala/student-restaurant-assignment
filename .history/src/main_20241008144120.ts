import { initializeMap } from "./map";
import { LoginUser, User } from "./interfaces/User";
import { apiUrl } from "./variables";
import { fetchData } from "./functions";
import { showFavorites } from "./favorites";

const newError = (message: string): void => {
  alert(message);
  console.error(message);
};

const checkbox = document.getElementById("checkbox");

if (checkbox) {
  checkbox.addEventListener("change", () => {
    toggleLight();
  });
}

const toggleLight = () => {
  document.body.classList.toggle("light");
  document.documentElement.classList.toggle("light");

  const body = document.querySelector("body");
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");
  const main = document.querySelector("main");
  const dialog = document.querySelector(".menu-dialog");

  if (body && header && footer && main && dialog) {
    body.classList.toggle("light-mode");
    header.classList.toggle("light-mode");
    footer.classList.toggle("light-mode");
    main.classList.toggle("light-mode");
    dialog.classList.toggle("light-mode");
  }
};

const handleLogin = async (evt: Event): Promise<void> => {
  evt.preventDefault();
  
  const loginUsernameInput = document.querySelector(
    ".username-login"
  ) as HTMLInputElement | null;
  const loginPasswordInput = document.querySelector(
    ".password-login"
  ) as HTMLInputElement | null;
  
  if (!loginUsernameInput || !loginPasswordInput) {
    newError("Element not found");
    return;
  }
    
  const username = loginUsernameInput.value;
  const password = loginPasswordInput.value;

  try {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    };

    const result = await fetchData<LoginUser>(apiUrl + "/auth/login", options);
    console.log(result);

    if (result.token) {
      localStorage.setItem("token", result.token);
      closeLoginDialog();
      showLoginSuccessDialog();
      await checkToken();
    }
  } catch {
    newError('Login failed, check your username and password');
  }
};

const handleRegister = async (evt: Event): Promise<void> => {
  evt.preventDefault();
  
  const registerUsernameInput = document.querySelector(
    "#username-register"
  ) as HTMLInputElement | null;
  const registerPasswordInput = document.querySelector(
    "#password-register"
  ) as HTMLInputElement | null;
  const registerEmailInput = document.querySelector("#email-register") as HTMLInputElement | null;
  
  if (!registerUsernameInput || !registerEmailInput ||!registerPasswordInput) {
    newError("Element not found");
    return;
  }
  
  const username = registerUsernameInput.value;
  const email = registerEmailInput.value;
  const password = registerPasswordInput.value;
  
  try {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    };
  
    const result = await fetchData<User>(apiUrl + "/users", options);
    console.log(result);
    
    if (result) {
      closeLoginDialog();
      showRegistersuccessDialog();
    }
  } catch (error) {
    newError((error as Error).message);
  }
};

const closeLoginDialog = (): void => {
  const loginDialog = document.querySelector(".login-dialog") as HTMLDialogElement | null;
  if (!loginDialog) {
    newError("Element not found");
    return;
  }
  loginDialog.close();
}

const showLoginSuccessDialog = (): void => {
  const loginSuccess = document.querySelector(".login-success") as HTMLDialogElement | null;
  if (!loginSuccess) {
    newError("Element not found");
    return;
  }
  loginSuccess.showModal();
}

const showRegistersuccessDialog = (): void => {
  const registerSuccess = document.querySelector(".register-success") as HTMLDialogElement | null;
  if (!registerSuccess) {
    newError("Element not found");
    return;
  }
  registerSuccess.showModal();

}

const loginEventListeners = (): void => {
  const registerForm = document.querySelector("#register-form") as HTMLFormElement;
  const loginForm = document.querySelector(".login-form") as HTMLFormElement;
  const loginButton = document.querySelector("#login") as HTMLButtonElement;
  const loginCloseButton = document.querySelector("#close") as HTMLButtonElement;

  if (loginButton) {
    loginButton.addEventListener("click", ()  => {
      const loginDialog = document.querySelector(".login-dialog") as HTMLDialogElement;
      loginDialog.showModal();
    });
  }

  if (loginCloseButton) {
    loginCloseButton.addEventListener("click", closeLoginDialog);
  }

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }
};

// function to check local storage for token and if it exists fetch
// userdata with getUserData then update the DOM with addUserDataToDom

const checkToken = async (): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('No token found');
    return;
  }

  const user = await getUserData(token);
  addUserDataToDom(user);
  showFavorites(token);
};

// display user info in the userpage

const addUserDataToDom = (user: User): void => {
  const usernameTarget = document.querySelector("#your-username") as HTMLSpanElement | null;

  const emailTarget = document.querySelector("#your-email") as HTMLSpanElement | null;

  if (!usernameTarget || !emailTarget) {
    newError('Failed to update profile elements');
    return;
  }

  // adding the userdata to the DOM

  emailTarget.innerText = user.email;
  usernameTarget.innerText = user.username;
};

// function to get userdata from API using token

const getUserData = async (token: string): Promise<User> => {
  const options: RequestInit = {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  };

  return await fetchData<User>(apiUrl + '/users/token', options);
};

// logout button

const loggingOut = () => {
  const logoutButton = document.querySelector(
    '#logout'
  ) as HTMLButtonElement | null;

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('token');

      const displayUserInfo = document.querySelector(".user-info") as HTMLDialogElement;

      displayUserInfo.close();

      const usernameTarget = document.querySelector("#your-username") as HTMLSpanElement | null;
      const emailTarget = document.querySelector("#your-email") as HTMLSpanElement | null;
      
      if (!emailTarget || !usernameTarget) {
        return;
      }

      emailTarget.innerText = '';
      usernameTarget.innerText = '';

      const loginForm = document.querySelector(".login-form") as HTMLFormElement;
      if (loginForm) {
        loginForm.reset();
      }

      console.log('User logged out');
    });
  }
};

const displaySuccessDialogs = () => {

  const loginSuccessClose = document.querySelector("#login-close") as HTMLButtonElement;
  const registerSuccessClose = document.querySelector(".submit") as HTMLButtonElement;
  const loginSuccess = document.querySelector(".login-success") as HTMLDialogElement;
  const registerSuccess = document.querySelector(".register-success") as HTMLDialogElement;

  if (loginSuccessClose) {
    loginSuccessClose.addEventListener("click", () => {
      loginSuccess.close();
    });
  }
  
  if (registerSuccessClose) {
    registerSuccessClose.addEventListener("click", () => {
      registerSuccess.close();
      loginSuccess.showModal();
    });
  }
};

const displayUserPage = () => {

  const userInfoButton = document.querySelector("#user-page") as HTMLButtonElement;
  const displayUserInfo = document.querySelector(".user-info") as HTMLDialogElement;
  const userPageCloseButton = document.querySelector("#close-user-info") as HTMLDivElement;

  if (userInfoButton) {
    userInfoButton.addEventListener("click", async () => {
      displayUserInfo.showModal();
    });
  }

  if (userPageCloseButton) {
    userPageCloseButton.addEventListener("click", () => {
      displayUserInfo.close();
   });
  }
};

const checkLogin = () => {
  const token = localStorage.getItem('token');
  return !!token;
}

const runApp = (): void => {
  displayUserPage();
  displaySuccessDialogs();
  loggingOut();
  loginEventListeners();
  checkToken();
  initializeMap();

  console.log("App started");
}

document.addEventListener("DOMContentLoaded", runApp);

const modal = document.querySelector(".menu-dialog") as HTMLDialogElement | null;
if (!modal) {
  throw new Error("Modal not found");
}
modal.addEventListener("click", () => {
  modal.close();
});


export { checkLogin, getUserData };