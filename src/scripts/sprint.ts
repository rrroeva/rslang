import constants from "../constants";
import { iPair, iWord } from "../types/index";
import Api from "./api";

export default class Sprint {
  api: Api;
  pairs: Array<iPair>;
  currentPair: number;
  points: number;
  rightInRow: number;
  koef: number;
  results: Array<iPair>;

  constructor() {
    this.api = new Api();
    this.currentPair = 0;
    this.pairs = [];
    this.points = 0;
    this.rightInRow = 0;
    this.koef = 1;
    this.results = [];
  }
  public async start(): Promise<void> {
    const level: number = this.askLevel();
    const words: Array<iWord> = await this.getAllWordsOfLevel(level);
    this.setPairs(words);
    this.shuffle();
    this.drawPlay();
    this.play();
  }
  async getAllWordsOfLevel(group: number): Promise<iWord[]> {
    const res: Array<iWord> = [];
    let page = 0;
    while (page < constants.amountOfLevels - 1) {
      const answer: Array<iWord> = await this.api.getWords(
        group.toString(),
        page.toString()
      );
      answer.forEach((item) => res.push(item));
      page += 1;
    }
    return res;
  }
  private askLevel(): number {
    return 0;
  }
  private setPairs(words: Array<iWord>): void {
    this.pairs.length = 0;
    for (let i = 0; i < words.length; i += 1) {
      const isCorrect: number = this.getRandomNumber(0, 1);
      const wrongIndex: number = this.getRandomNumber(0, words.length - 1);
      const translate: string =
        isCorrect === 1
          ? words[i].wordTranslate
          : words[wrongIndex].wordTranslate;
      const pair: iPair = {
        word: words[i].word,
        translate: translate,
        isCorrect: translate === words[i].wordTranslate,
      };
      this.pairs.push(pair);
    }
  }
  private getRandomNumber(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  private shuffle(): void {
    for (let i = this.pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.pairs[i], this.pairs[j]] = [this.pairs[j], this.pairs[i]];
    }
  }
  private drawPlay(): void {
    const mainDiv: HTMLDivElement | null = document.querySelector(".main");
    const sprintDiv: HTMLDivElement | null = document.querySelector(".sprint");
    sprintDiv?.classList.remove("hidden");
    mainDiv?.classList.add("hidden");

    sprintDiv?.replaceChildren();

    const sprint_dlg: HTMLDivElement = document.createElement("div");
    sprint_dlg.className = "sprint_dlg";
    sprintDiv?.append(sprint_dlg);

    const header_sprint: HTMLDivElement = document.createElement("div");
    header_sprint.className = "header_sprint";
    const words_sprint: HTMLDivElement = document.createElement("div");
    words_sprint.className = "words_sprint";
    const buttons_sprint: HTMLDivElement = document.createElement("div");
    buttons_sprint.className = "buttons_sprint";

    sprint_dlg.append(header_sprint, words_sprint, buttons_sprint);

    const sprintTimer: HTMLSpanElement = document.createElement("span");
    sprintTimer.innerHTML = constants.timerValue.toString();
    sprintTimer.id = "sprint_timer";

    const rightAnswers: HTMLDivElement = document.createElement("div");

    const sprintPoints: HTMLSpanElement = document.createElement("span");
    sprintPoints.innerHTML = "0";
    sprintPoints.id = "sprint_points";

    header_sprint.append(sprintTimer, rightAnswers, sprintPoints);

    const answer1: HTMLInputElement = document.createElement("input");
    answer1.type = "checkbox";
    answer1.id = "sprint_answer1";
    const answer2: HTMLInputElement = document.createElement("input");
    answer2.type = "checkbox";
    answer2.id = "sprint_answer2";
    const answer3: HTMLInputElement = document.createElement("input");
    answer3.type = "checkbox";
    answer3.id = "sprint_answer3";
    rightAnswers.append(answer1, answer2, answer3);

    const sprintWord: HTMLSpanElement = document.createElement("span");
    sprintWord.id = "sprint_word";

    const sprintTranslate: HTMLSpanElement = document.createElement("span");
    sprintTranslate.id = "sprint_translate";

    words_sprint.append(sprintWord, sprintTranslate);

    const sprintFalseBtn: HTMLButtonElement = document.createElement("button");
    sprintFalseBtn.id = "sprint_false";
    sprintFalseBtn.innerHTML = "◄ Неверно";

    const sprintTrueBtn: HTMLButtonElement = document.createElement("button");
    sprintTrueBtn.id = "sprint_true";
    sprintTrueBtn.innerHTML = "Верно ►";

    buttons_sprint.append(sprintFalseBtn, sprintTrueBtn);
  }
  private play(): void {
    this.currentPair = 0;
    this.changeWord();

    const timer: HTMLSpanElement | null =
      document.querySelector("#sprint_timer");
    if (timer) {
      let timePassed = 0;
      const timerId = setInterval(() => {
        timePassed = timePassed += 1;
        if (constants.timerValue - timePassed === 0) {
          clearInterval(timerId);
          this.showResults();
        }
        timer.innerHTML = (constants.timerValue - timePassed).toString();
      }, 1000);
    }

    const true_btn: HTMLButtonElement | null =
      document.querySelector("#sprint_true");
    const false_btn: HTMLButtonElement | null =
      document.querySelector("#sprint_false");

    true_btn?.addEventListener("click", (): void => {
      this.checkAnswer(true);
    });
    false_btn?.addEventListener("click", (): void => {
      this.checkAnswer(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.code === "ArrowRight") this.checkAnswer(true);
      if (event.code === "ArrowLeft") this.checkAnswer(false);
    });
  }
  private changeWord() {
    const word: HTMLSpanElement | null = document.querySelector("#sprint_word");
    const translate: HTMLSpanElement | null =
      document.querySelector("#sprint_translate");
    if (word && translate) {
      word.innerHTML = this.pairs[this.currentPair].word;
      translate.innerHTML = this.pairs[this.currentPair].translate;
    }
  }
  private checkAnswer(answer: boolean): void {
    if (answer === this.pairs[this.currentPair].isCorrect) {
      const res: iPair = {
        word: this.pairs[this.currentPair].word,
        translate: this.pairs[this.currentPair].translate,
        isCorrect: true,
      };
      this.results.push(res);
      this.addPoints();
    } else {
      const res: iPair = {
        word: this.pairs[this.currentPair].word,
        translate: this.pairs[this.currentPair].translate,
        isCorrect: false,
      };
      this.results.push(res);
      this.rightInRow = 0;
      this.koef = 1;
      this.removeChecks();
    }
    this.currentPair += 1;
    this.changeWord();
  }
  private addPoints(): void {
    console.log(this.rightInRow);
    if (this.rightInRow === 3) {
      this.rightInRow = 0;
      this.koef += 1;
      this.removeChecks();
    }
    this.points += constants.points * this.koef;
    this.rightInRow += 1;
    const pointsSpan: HTMLSpanElement | null =
      document.querySelector("#sprint_points");
    if (pointsSpan) {
      pointsSpan.innerHTML = this.points.toString();
    }
    if (this.rightInRow === 1) {
      const answer1: HTMLInputElement | null =
        document.querySelector("#sprint_answer1");
      if (answer1) answer1.checked = true;
    }
    if (this.rightInRow === 2) {
      const answer2: HTMLInputElement | null =
        document.querySelector("#sprint_answer2");
      if (answer2) answer2.checked = true;
    }
    if (this.rightInRow === 3) {
      const answer3: HTMLInputElement | null =
        document.querySelector("#sprint_answer3");
      if (answer3) answer3.checked = true;
    }
  }
  private showResults() {
    const sprintDiv: HTMLDivElement | null = document.querySelector(".sprint");
    const sprintRes: HTMLDivElement | null =
      document.querySelector(".sprint_results");
    sprintDiv?.classList.add("hidden");
    sprintRes?.classList.remove("hidden");
    console.log(this.results);
  }
  private removeChecks() {
    const answer1: HTMLInputElement | null =
      document.querySelector("#sprint_answer1");
    if (answer1) answer1.checked = false;
    const answer2: HTMLInputElement | null =
      document.querySelector("#sprint_answer2");
    if (answer2) answer2.checked = false;
    const answer3: HTMLInputElement | null =
      document.querySelector("#sprint_answer3");
    if (answer3) answer3.checked = false;
  }
}
