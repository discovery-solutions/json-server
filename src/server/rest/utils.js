export function toJSON(data) {
  return JSON.stringify(data);
}

export function toCSV(data) {
  let header, content;

  if ( Array.isArray(data) === true ) {
    header = data[0];
    content = data;
  } else {
    header = data;
    content = [data];
  }

  header = Object.keys(header).join(",");
  content = data.map(item => Object.values(item).join(",")).join("\n");

  return [ header, content ].join("\n")
}

export function getBody(request) {
  return new Promise((resolve, reject) => {
    let data = "";

    request.on("data", chunk => {
      data += chunk;
    });

    request.on("end", () => {
      return resolve( JSON.parse(data) );
    });

    request.on("error", e => {
      return reject( e );
    });
  });
}
