const request = require('supertest');
const app = require('../../index');

describe('Users Routes', () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    // Get admin token
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .expect(200)
      .send({
        email: 'admin@example.com',
        password: 'admin123'
      });
    adminToken = adminLogin.body.data.token;

    // Get user token
    const userLogin = await request(app)
      .post('/api/auth/login')
      .expect(200)
      .send({
        email: 'user@example.com',
        password: 'admin123'
      });
    userToken = userLogin.body.data.token;
  });

  describe('GET /api/users', () => {
    it('should get all users as admin', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.users).toBeDefined();
      expect(Array.isArray(response.body.data.users)).toBe(true);
      expect(response.body.data.total).toBeDefined();
    });

    it('should not allow regular user to get all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Insufficient permissions');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/users/profile', () => {
    it('should get current user profile', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe('user@example.com');
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should require authentication for profile', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should allow user to update their own profile', async () => {
      const updateData = {
        name: 'Updated Name'
      };

      const response = await request(app)
        .put('/api/users/2') // User ID 2
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.name).toBe(updateData.name);
    });

    it('should allow admin to update any user', async () => {
      const updateData = {
        name: 'Admin Updated Name'
      };

      const response = await request(app)
        .put('/api/users/2')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.name).toBe(updateData.name);
    });

    it('should not allow user to update other users', async () => {
      const updateData = {
        name: 'Unauthorized Update'
      };

      const response = await request(app)
        .put('/api/users/1') // Admin user ID
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});