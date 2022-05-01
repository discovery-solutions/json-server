import { DB } from "utilities/tests/constants";
import axios from "utilities/tests/axios";

let id;

describe("Entity Routes Without Authentication", () => {
  test("POST /user", async () => {
    const { data } = await axios.post("/user", {
      name: "Test User",
      email: "test-user@email.com",
      password: "mytestpassword1"
    });

    expect(data.status).toBe(true);
    expect(data.code).toBe(200);
    expect(typeof data.message).toBe("string");
    expect(typeof data.user).toBe("object");
    expect(Object.keys(data.user).length).toBeTruthy();

    id = data.user.id;
  });

  test("PATCH /user/" + id, async () => {
    const { data } = await axios.patch("/user/" + id, {
      name: "my test name updated"
    });

    expect(data?.status).toBe(true);
    expect(data?.code).toBe(200);
    expect(typeof data.message).toBe("string");
    expect(typeof data.user).toBe("object");
    expect(Object.keys(data.user).length).toBeTruthy();
  });

  test("GET /user/" + id, async () => {
    const { data } = await axios.get("/user/" + id);

    expect(data?.status).toBe(true);
    expect(data?.code).toBe(200);
    expect(typeof data.message).toBe("string");
    expect(typeof data.user).toBe("object");
    expect(Object.keys(data.user).length).toBeTruthy();
  });

  test("GET /user", async () => {
    const { data } = await axios.get("/user");

    expect(data?.status).toBe(true);
    expect(data?.code).toBe(200);
    expect(typeof data.message).toBe("string");
    expect(typeof data.records).toBe("object");
    expect(Object.keys(data.records).length).toBeTruthy();
  });

  test("GET /user/oldest", async () => {
    const { data } = await axios.get("/user");

    expect(data?.status).toBe(true);
    expect(data?.code).toBe(200);
    expect(typeof data.message).toBe("string");
    expect(typeof data.records).toBe("object");
    expect(Object.keys(data.records).length).toBeTruthy();
  });

  test("GET /user/latest", async () => {
    const { data } = await axios.get("/user");

    expect(data?.status).toBe(true);
    expect(data?.code).toBe(200);
    expect(typeof data.message).toBe("string");
    expect(typeof data.records).toBe("object");
    expect(Object.keys(data.records).length).toBeTruthy();
  });

  test("DELETE /user/" + id, async () => {
    const { data } = await axios.delete("/user/" + id);

    expect(data?.status).toBe(true);
    expect(data?.code).toBe(200);
    expect(typeof data.message).toBe("string");
  });
})
