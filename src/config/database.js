// In-memory database simulation for demo purposes
// In production, you would use a real database like PostgreSQL, MongoDB, etc.

class Database {
  constructor() {
    this.users = [
      {
        id: 1,
        email: 'admin@example.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewreZhFy7jw5l8KW', // password: admin123
        name: 'Administrator',
        role: 'admin',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      },
      {
        id: 2,
        email: 'user@example.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewreZhFy7jw5l8KW', // password: admin123
        name: 'Regular User',
        role: 'user',
        createdAt: new Date('2023-01-02'),
        updatedAt: new Date('2023-01-02')
      }
    ];
    this.nextUserId = 3;
  }

  // User methods
  findUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  findUserById(id) {
    return this.users.find(user => user.id === parseInt(id));
  }

  createUser(userData) {
    const user = {
      id: this.nextUserId++,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(user);
    return user;
  }

  updateUser(id, userData) {
    const userIndex = this.users.findIndex(user => user.id === parseInt(id));
    if (userIndex === -1) return null;

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...userData,
      updatedAt: new Date()
    };
    return this.users[userIndex];
  }

  deleteUser(id) {
    const userIndex = this.users.findIndex(user => user.id === parseInt(id));
    if (userIndex === -1) return null;

    const deletedUser = this.users[userIndex];
    this.users.splice(userIndex, 1);
    return deletedUser;
  }

  getAllUsers() {
    return this.users;
  }
}

module.exports = new Database();