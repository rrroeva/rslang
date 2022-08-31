import Authorization from "./mainPage/authorization/authorization";
import Main from "./mainPage/main";
import Menu from "./mainPage/menu";

export default class App {
  menu: Menu;
  authorization: Authorization;
  constructor() {
    this.menu = new Menu();
    this.authorization = new Authorization();
  }
  public start(): void {
    const main = new Main();
    main.start();

    const menuBurger = document.querySelector(".header__burger");
    menuBurger?.addEventListener("click", () => {
      const menuSection = document.querySelector(".menu") as HTMLElement;
      if (menuSection) {
        menuSection.style.display = "block";
      } else {
        this.menu.create();
      }
    });
    const headerauthorization = document.querySelector(
      ".header__authorization"
    ) as HTMLElement;
    headerauthorization?.addEventListener("click", () => {
      if (!headerauthorization.classList.contains("isAuth")) {
        this.authorization.create(this);
        const signupButton = document.querySelector(
          ".signup_button"
        ) as HTMLButtonElement;
        if (signupButton) {
          signupButton.style.display = "block";
        } else {
          this.authorization.create(this);
        }
      } else {
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        const auth: HTMLDivElement | null = document.querySelector(
          ".header__authorization"
        );
        if (auth) {
          const img: HTMLImageElement | null = document.querySelector(
            ".header__authorization img"
          );
          auth.classList.remove("isAuth");
          if (img) {
            img.src =
              "https://www.imagehousing.com/images/2022/08/27/avatar.png";
          }
        }
      }
    });
    /*
    const sprint = new Sprint();
    const sprintBtn: HTMLButtonElement | null =
      document.querySelector("#btn_sprint");
    sprintBtn?.addEventListener("click", (): void => {
      sprint.start();
    });
    
        const textbookBtn: HTMLButtonElement | null =
          document.querySelector("#btn_textbook");
        textbookBtn?.addEventListener("click", (): void => {
          const chapter = new Chapter();
          chapter.create();
        });
    
        const AudioBtn: HTMLButtonElement | null =
          document.querySelector("#btn_audiocall");
        AudioBtn?.addEventListener("click", (): void => {
          process();
        });
        */
  }
  public auth(userName: string) {
    const auth: HTMLDivElement | null = document.querySelector(
      ".header__authorization"
    );
    if (auth) {
      const img: HTMLImageElement | null = document.querySelector(
        ".header__authorization img"
      );
      auth.classList.add("isAuth");
      if (img) {
        img.src = "./assets/img/logout.png";
      }
      console.log(userName);
    }
  }
}
