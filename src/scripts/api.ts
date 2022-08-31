import constants from "../constants";
import { iAuthResp, iUser, iWord, iStatistics } from "../types/index";

export default class Api {
  public async getWords(group: string, page: string): Promise<iWord[]> {
    const res = await fetch(
      `${constants.URL}/words?group=${group}&page=${page}`,
      {
        method: "GET",
      }
    );
    const words = await res.json();
    const arr: Array<iWord> = [];
    for (const key in words) {
      arr.push(words[key]);
    }
    return arr;
  }
  public async takeStatistic(userUid: string | null): Promise<iStatistics> {
    const res = await fetch(`${constants.URL}/users/${userUid}/statistics`, {
      method: "GET",

      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const words = await res.json();
    return words;
  }
  public async transferData(userUid: string | null, datas: iStatistics) {
    const info = await fetch(`${constants.URL}/users/${userUid}/statistics`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datas),
    });
    const result = await info.json();
    return result;
  }
  public async createUser(user: iUser): Promise<string> {
    const res = await fetch(`${constants.URL}/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    let msg = "";
    if (res.ok) {
      msg = "Успешно!";
    } else if (res.status === 422) {
      msg = "Неверный e-mail или пароль!";
    } else if (res.status === 417) {
      msg = "Такой пользователь уже зарегестрирован!";
    }
    return msg;
  }
  public async signIn(user: iUser): Promise<iAuthResp> {
    const res = await fetch(`${constants.URL}/signin`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    let msg = "";
    if (res.ok) {
      const content = await res.json();
      return content;
    } else if (res.status === 403) {
      msg = "Неверный e-mail или пароль!";
    }
    const resp: iAuthResp = {
      message: msg,
      token: "",
      refreshToken: "",
      userId: "",
      name: "",
    };
    return resp;
  }
  public async refreshToken(userId: string | null): Promise<iAuthResp> {
    const res = await fetch(`${constants.URL}/users/${userId}/tokens`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const content = await res.json();
      return content;
    }
    const resp: iAuthResp = {
      message: "",
      token: "",
      refreshToken: "",
      userId: "",
      name: "",
    };
    return resp;
  }
}
