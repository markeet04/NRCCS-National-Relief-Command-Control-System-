/**
 * Mock API Client
 * Simulates API calls for development (Deliverable 3)
 * Will be replaced with real Axios client in Deliverable 4
 */

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MockAPIClient {
  constructor(baseURL = '/api', defaultDelay = 500) {
    this.baseURL = baseURL;
    this.defaultDelay = defaultDelay;
  }

  /**
   * Simulate GET request
   */
  async get(endpoint, config = {}) {
    await delay(config.delay || this.defaultDelay);
    
    console.log(`[Mock API] GET ${this.baseURL}${endpoint}`);
    
    // Return mock data based on endpoint
    return {
      data: this._getMockData(endpoint),
      status: 200,
      statusText: 'OK',
    };
  }

  /**
   * Simulate POST request
   */
  async post(endpoint, data, config = {}) {
    await delay(config.delay || this.defaultDelay);
    
    console.log(`[Mock API] POST ${this.baseURL}${endpoint}`, data);
    
    return {
      data: { success: true, message: 'Resource created', id: Date.now(), ...data },
      status: 201,
      statusText: 'Created',
    };
  }

  /**
   * Simulate PUT request
   */
  async put(endpoint, data, config = {}) {
    await delay(config.delay || this.defaultDelay);
    
    console.log(`[Mock API] PUT ${this.baseURL}${endpoint}`, data);
    
    return {
      data: { success: true, message: 'Resource updated', ...data },
      status: 200,
      statusText: 'OK',
    };
  }

  /**
   * Simulate PATCH request
   */
  async patch(endpoint, data, config = {}) {
    await delay(config.delay || this.defaultDelay);
    
    console.log(`[Mock API] PATCH ${this.baseURL}${endpoint}`, data);
    
    return {
      data: { success: true, message: 'Resource patched', ...data },
      status: 200,
      statusText: 'OK',
    };
  }

  /**
   * Simulate DELETE request
   */
  async delete(endpoint, config = {}) {
    await delay(config.delay || this.defaultDelay);
    
    console.log(`[Mock API] DELETE ${this.baseURL}${endpoint}`);
    
    return {
      data: { success: true, message: 'Resource deleted' },
      status: 200,
      statusText: 'OK',
    };
  }

  /**
   * Get mock data based on endpoint
   * Override this method to return different mock data
   */
  _getMockData(endpoint) {
    // Default empty response
    return { data: [], message: 'Mock data not configured for this endpoint' };
  }
}

// Create default instance
const mockClient = new MockAPIClient();

export default mockClient;
export { MockAPIClient };
