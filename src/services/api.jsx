let users = [
  {
    id: 1,
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    password: "1234",
  },
];

export async function signup({ firstName, lastName, email, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const existing = users.find((u) => u.email === email);
      if (existing) return reject(new Error("User already exists"));

      const newUser = {
        id: users.length + 1,
        firstName,
        lastName,
        email,
        password,
      };
      users.push(newUser);

      const token = btoa(`${newUser.id}:${newUser.email}`);

      resolve({
        user: {
          id: newUser.id,
          firstName,
          lastName,
          email,
          fullName: `${firstName} ${lastName}`,
        },
        token,
      });
    }, 500);
  });
}

export async function login({ email, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find(
        (u) => u.email === email && u.password === password
      );
      if (!user) return reject(new Error("Invalid credentials"));

      const token = btoa(`${user.id}:${user.email}`);

      resolve({
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          fullName: `${user.firstName} ${user.lastName}`,
        },
        token,
      });
    }, 500);
  });
}

export async function getProfile(token) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const [id, email] = atob(token).split(":");
        const user = users.find(
          (u) => u.id === Number(id) && u.email === email
        );

        if (!user) return reject(new Error("Invalid token"));

        resolve({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          fullName: `${user.firstName} ${user.lastName}`,
        });
      } catch {
        reject(new Error("Failed to parse token"));
      }
    }, 300);
  });
}
