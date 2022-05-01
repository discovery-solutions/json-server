import LocalStorage from "features/databases/custom/LocalStorage";
import { DB, USER } from "utilities/tests/constants";
import { ObjectId } from "mongodb";
import axios from "utilities/tests/axios";

// Setting up user for tests
const localStorage = new LocalStorage(DB);
localStorage.setEntity(USER.name);

let token, id;
const user = {
  id: new ObjectId(),
  name: "My User Name",
  email: "user-email@email.com",
  password: "my-password-1",
}

describe("Entity Routes With Valid Authentication", () => {
  const validateResponse = ({ data }, testFor) => {
    expect(data?.status).toBe(true);
    expect(data?.code).toBe(200);
    expect(typeof data.message).toBe("string");

    if (testFor !== "delete") {
      expect(typeof (data.user || data.records)).toBe("object");
      expect(Object.keys(data.user || data.records).length).toBeTruthy();
    }
  }

  beforeAll(async () => {
    localStorage.add(user);

    const { data, headers } = await axios.post("/system/auth", user);

    if (data.status)
      axios.defaults.headers.common["x-auth-token"] = headers["x-auth-token"];
  });

  test("POST /user", async () => {
    const res = await axios.post("/user", {
      password: user.password,
      email: user.email,
      name: user.name,
    });

    validateResponse(res);

    id = res?.data?.user?.id;
  });

  test("PATCH /user/{id}", async () => {
    const res = await axios.patch("/user/" + id, {
      name: "User name updated"
    });

    validateResponse(res);
  });

  test("GET /user/{id}", async () => {
    const res = await axios.get("/user/" + id);

    validateResponse(res);
  });

  test("GET /user", async () => {
    const res = await axios.get("/user");

    validateResponse(res);
  });

  test("GET /user/oldest", async () => {
    const res = await axios.get("/user");

    validateResponse(res);
  });

  test("GET /user/latest", async () => {
    const res = await axios.get("/user");

    validateResponse(res);
  });

  test("DELETE /user/{id}", async () => {
    const res = await axios.delete("/user/" + id);

    validateResponse(res, "delete");
  });

  afterAll(() => {
    localStorage.set(
      localStorage.getAll().filter(item => item.name !== user.name)
    );
  });
});
