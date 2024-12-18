import { LOGIN_URL, REGISTER_URL } from "./authCrud";

const userTableMock = [
  {
    id: 1,
    name: "aghmaz",
    email: "abc@gmail.com",
    password: "12345678",
    token: "1232443554765876ityhfdfdsdfsacsdvsd",
  },
];

export default function mockAuth(mock) {
  mock.onPost(LOGIN_URL).reply(({ data }) => {
    const { email, password } = JSON.parse(data);

    if (email && password) {
      const user = userTableMock.find(
        (x) =>
          x.email.toLowerCase() === email.toLowerCase() &&
          x.password === password
      );

      if (user) {
        return [200, { ...user, password: undefined }];
      }
    }

    return [400];
  });

  mock.onPost(REGISTER_URL).reply(({ data }) => {
    const { email, name, password } = JSON.parse(data);

    if (email && name && password) {
      const user = {
        id: generateUserId(),
        email,
        name,
        password,
      };

      userTableMock.push(user);

      return [200, { ...user, password: undefined }];
    }

    return [400];
  });

  function generateUserId() {
    const ids = userTableMock.map((el) => el.id);
    const maxId = Math.max(...ids);
    return maxId + 1;
  }
}
