import { JSON_EXAMPLE } from "utilities/tests/constants";
import Server from "../src/";
// import Server from "../dist/index.esm";

const server = new Server(JSON_EXAMPLE);

server.setup({
  request: {
    limit: 5
  }
});

server.run();
