interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  name: string;
  image: string;
}

export const users: { [email: string]: User } = {};

// Add default user for demonstration
users["user@example.com"] = {
  firstName: "John",
  lastName: "Doe",
  email: "user@example.com",
  password: "password123",
  role: "user",
  name: "John Doe",
  image: "/images/user/owner.jpg",
};
