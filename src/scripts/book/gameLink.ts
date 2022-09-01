class GameLink {
  studiKeys: string | null;
  studiKeysLength: number;

  constructor() {
    this.studiKeys = localStorage.getItem("studi");
    this.studiKeysLength = 0;
  }
  creat(link: string, name: string, group: number, page: number, img: string) {
    if (this.studiKeys) {
      const studiKeys = JSON.parse(this.studiKeys);
      if (studiKeys[group]) {
        if (studiKeys[group][page]) {
          this.studiKeysLength = studiKeys[group][page]["key"].length;
        }
      }
    }
    if (this.studiKeysLength === 20) {
      return `
        <div class="game" style="background-image: url(${img});">
          <div class="game-none"></div>
          <a href="" target="" rel="noopener noreferrer">${name}</a>
        </div>
      `;
    } else {
      return `
        <div class="game" style="background-image: url(${img});">
          <a href="${link}" target="" rel="noopener noreferrer">${name}</a>
        </div>
      `;
    }
  }
}

export default GameLink;
