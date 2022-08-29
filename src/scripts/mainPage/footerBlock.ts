import { dataTeam } from "./team";
import "../../assets/styles/mainPage/footer.scss";

class FooterBlock {
  create(): HTMLElement {
    const container = document.createElement("div") as HTMLElement;
    const teamNames = document.createElement("div") as HTMLElement;

    container.setAttribute("class", "container footer");
    teamNames.setAttribute("class", "footer-team");

    container.innerHTML = `
      <p>RS LANG 2022</p>
      <img src="https://www.imagehousing.com/images/2022/08/28/rs-school-android.png" alt="rs-school-android.png" border="0" />
    `;
    dataTeam.forEach((el) => {
      teamNames.innerHTML += `
        <a href="${el.linkGitHub}">${el.name}</a>
      `;
    });

    container.append(teamNames);
    return container;
  }
}

export default FooterBlock;
