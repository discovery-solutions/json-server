import { JSON_EXAMPLE } from "utilities/tests/constants";

export { useID } from "utilities/utils";

export function configureEnviroment() {
  global["json-server"] = JSON_EXAMPLE;
}
