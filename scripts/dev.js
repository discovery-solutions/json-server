import { JSON_EXAMPLE } from "utilities/tests/constants";
import Server from "../src/";

const server = new Server(JSON_EXAMPLE);

server.setup({
  request: {
    limit: 5
  }
});

// server.getServerByPort(3501)

server.run();
