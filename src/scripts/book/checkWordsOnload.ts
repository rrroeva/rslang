const studi = !localStorage.getItem("studi")
  ? []
  : localStorage.getItem("studi")?.split(",");
const cardDifficults = !localStorage.getItem("cardDifficults")
  ? []
  : localStorage.getItem("cardDifficults")?.split(",");

class CheckWordsOnload {
  studiCount: number;
  difficultiCount: number;

  constructor() {
    this.studiCount = 0;
    this.difficultiCount = 0;
  }

  check(wordsNode: HTMLElement, pagination: HTMLElement, pageNumber: number) {
    // console.log(pagination, pageNumber);

    for (let i = 0; i < wordsNode.childNodes.length; i++) {
      const child = wordsNode.childNodes[i] as HTMLElement;
      if (child.nodeName !== "#text") {
        const id = child.getAttribute("id");
        if (!id) return;
        if (studi?.length !== 0) {
          studi?.forEach((el: string): void => {
            if (el?.indexOf(id) !== -1) {
              (
                child.childNodes[5].childNodes[1] as HTMLElement
              ).classList.toggle("activ");
              child.style.backgroundColor = "green";
              this.studiCount++;
              if (this.studiCount >= 20) {
                wordsNode.style.backgroundColor = "rgba(144, 230, 151, 0.85)";
                wordsNode.style.padding = "10px 0";
                for (let i = 0; i < pagination.childNodes.length; i++) {
                  const pagin_el = pagination.childNodes[i] as HTMLElement;
                  if (pagin_el.nodeName !== "#text") {
                    const pagin_elNum = pagin_el
                      .getAttribute("id")
                      ?.split("-")[1];
                    if (pagin_elNum === String(pageNumber + 1)) {
                      pagin_el.style.backgroundColor = "green";
                    }
                  }
                }
              }
            }
          });
        }
        if (cardDifficults?.length !== 0) {
          cardDifficults?.forEach((el: string): void => {
            if (el?.indexOf(id) !== -1) {
              (child.childNodes[5].childNodes[3] as HTMLElement).style.display =
                "none";
              (child.childNodes[5].childNodes[5] as HTMLElement).style.display =
                "block";
              child.style.border = "5px solid red";
              this.difficultiCount++;
              if (this.difficultiCount >= 20) {
                wordsNode.style.border = "5px solid red";
                wordsNode.style.padding = "10px 0";
                for (let i = 0; i < pagination.childNodes.length; i++) {
                  const pagin_el = pagination.childNodes[i] as HTMLElement;
                  if (pagin_el.nodeName !== "#text") {
                    const pagin_elNum = pagin_el
                      .getAttribute("id")
                      ?.split("-")[1];
                    if (pagin_elNum === String(pageNumber + 1)) {
                      pagin_el.style.border = "2px solid red";
                    }
                  }
                }
              }
            }
          });
        }
      }
    }
  }
}

export default CheckWordsOnload;
