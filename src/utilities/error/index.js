import { CODES } from "./constants";

export default class Error {
  static get(code) {
    return {
      status: code === 200,
      ...CODES[code],
    }
  }
}
