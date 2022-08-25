import { iWord } from "../../types/index";
import Api from "../api";
import ItemPage from "./itemPage";
import PaginationItem from "./paginationItem";
import ChechActiv from "./chechActiv";
import CheckWordsOnload from "./checkWordsOnload";
import "../../assets/styles/bookStyle/pages.css";
import Sprint from "../sprint";

class Pages {
  page: number;

  constructor() {
    this.page = 0;
  }

  getWordData(chapters: HTMLElement, group: string) {
    const api = new Api();
    const words = api.getWords(group, `${this.page}`);
    words.then((data: iWord[]) => this.create(chapters, data, group));
  }

  create(chapters: HTMLElement, data: iWord[], group: string): void {
    const paginationItem = new PaginationItem();
    const chechActiv = new ChechActiv();
    const checkWordsOnload = new CheckWordsOnload();

    chapters.innerHTML = "";
    const containerWords = document.createElement("div") as HTMLDivElement;
    const prevBtn = document.createElement("button") as HTMLButtonElement;
    const nextBtn = document.createElement("button") as HTMLButtonElement;
    const words = document.createElement("div") as HTMLDivElement;
    const pageNumber = document.createElement("div") as HTMLDivElement;
    const pagination = document.createElement("div") as HTMLDivElement;
    const sprintBtn = document.createElement("button") as HTMLButtonElement;
    const audiocallBtn = document.createElement("button") as HTMLButtonElement;

    containerWords.setAttribute("class", `container-words`);
    pagination.setAttribute("class", `pagination`);
    words.setAttribute("class", `words group__${group}`);
    pageNumber.setAttribute("class", "pageNumber");
    prevBtn.setAttribute("id", "prev-btn");
    nextBtn.setAttribute("id", "next-btn");

    sprintBtn.id = "book-sprint-btn";
    sprintBtn.innerHTML = "Спринт";
    audiocallBtn.id = "book-audiocall-btn";
    audiocallBtn.innerHTML = "Аудиовызов";

    pageNumber.textContent = `${this.page + 1}`;
    const itemPage = new ItemPage();
    data.forEach((el): void => {
      words.innerHTML += itemPage.create(el);
    });

    for (let i = 0; i <= 29; i++) {
      pagination.innerHTML += paginationItem.create(i + 1);
    }

    prevBtn.innerHTML = "<";
    nextBtn.innerHTML = ">";

    containerWords.append(prevBtn);
    containerWords.append(nextBtn);
    containerWords.append(words);
    containerWords.append(pageNumber);
    containerWords.append(pagination);
    chapters.append(sprintBtn, audiocallBtn, containerWords);

    const wordsNode = document.querySelector(".words") as HTMLElement;
    checkWordsOnload.check(wordsNode, pagination, this.page, group);

    prevBtn.addEventListener("click", (): void => {
      if (this.page > 0) {
        this.page -= 1;
        this.getWordData(chapters, group);
      }
    });
    nextBtn.addEventListener("click", (): void => {
      if (this.page < 29) {
        this.page += 1;
        this.getWordData(chapters, group);
      }
    });

    const sprint = new Sprint();
    sprintBtn.addEventListener("click", (): void => {
      sprint.startFromBook(group, this.page);
    });
    document.addEventListener("keydown", (event) => {
      if (sprint.isKeyUp && sprint.isPlaying) {
        if (event.code === "ArrowRight") sprint.checkAnswer(true);
        if (event.code === "ArrowLeft") sprint.checkAnswer(false);
        sprint.isKeyUp = false;
      }
    });
    document.addEventListener("keyup", (event) => {
      if (event.code === "ArrowRight" || event.code === "ArrowLeft") {
        sprint.isKeyUp = true;
      }
    });

    pagination.addEventListener("click", (e: Event): void => {
      const idButton = (e.target as HTMLElement).closest(
        "button"
      ) as HTMLElement;
      if (!idButton?.getAttribute("id")) return;
      const page = idButton?.getAttribute("id")?.split("-")[1];
      if (!page) return;
      this.page = +page - 1;
      this.getWordData(chapters, group);
    });

    const containerWordsClass = document.querySelector(
      ".container-words"
    ) as HTMLElement;
    containerWordsClass.addEventListener("click", (e: Event): void => {
      chechActiv.check(e, this.page, group, wordsNode, pagination);
    });

    this.check();
  }

  check(): void {
    const authorizedCheck = true;
    const authorizedBlock: NodeListOf<HTMLElement> = document.querySelectorAll(
      ".item-page__authorized"
    );
    if (authorizedCheck) {
      authorizedBlock.forEach((el): void => {
        el.style.display = "block";
      });
    } else {
      authorizedBlock.forEach((el): void => {
        el.style.display = "none";
      });
    }
  }
}

export default Pages;
