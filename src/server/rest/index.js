import http from "http";
import Handler from "./handler";
import * as Utils from "utilities/utils";

export default class Rest {
  constructor(props) {
    const { port, type, format } = props;

    this.port = port;
    this.host = Utils.getIP();

    this.server = http.createServer( new Handler(props) );

    this.server.listen(this.port, this.host, () => {
      console.log(`Server running on http://${this.host}:${this.port}`);
    });

    return this;
  }
}
