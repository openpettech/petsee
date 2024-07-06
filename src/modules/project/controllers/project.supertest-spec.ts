import * as request from 'supertest';

const baseURL = 'http://localhost:4000/';

describe('Project', () => {
  const apiRequest = request(baseURL);

  describe('GET: /projects', () => {
    it('should have no response when no bearer provided', async () => {
      const response = await apiRequest.get('projects');

      expect(response.status).toBe(401);
    });
  });

  describe('GET: /projects/:id', () => {
    it('should have no response when no bearer provided', async () => {
      const response = await apiRequest.get('projects/1');

      expect(response.status).toBe(401);
    });
  });

  describe('POST: /projects', () => {
    it('should have no response when no bearer provided', async () => {
      const response = await apiRequest.post('projects');

      expect(response.status).toBe(401);
    });
  });

  describe('PATCH: /projects/:id', () => {
    it('should have no response when no bearer provided', async () => {
      const response = await apiRequest.patch('projects/1');

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE: /projects/:id', () => {
    it('should have no response when no bearer provided', async () => {
      const response = await apiRequest.delete('projects/1');

      expect(response.status).toBe(401);
    });
  });
});
