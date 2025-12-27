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
    // Mock AI suggestions endpoint
    if (endpoint.startsWith('/reasoning/suggestions')) {
      return [
        {
          id: 1,
          status: 'PENDING',
          resourceType: 'food',
          suggestedQuantity: 1000,
          provinceId: 1,
          provinceName: 'Punjab',
          reasoning: 'High flood risk detected in Punjab region with ML confidence of 92%',
          ruleIds: ['RULE-001', 'RULE-302'],
          confidenceScore: 0.92,
          mlPredictionData: { flood_risk: 0.85, rainfall: 150, temperature: 35 },
          createdAt: new Date().toISOString(),
          flags: ['HIGH_PRIORITY'],
        },
        {
          id: 2,
          status: 'APPROVED',
          resourceType: 'water',
          suggestedQuantity: 500,
          provinceId: 2,
          provinceName: 'Sindh',
          reasoning: 'Severe rainfall predicted in Sindh region',
          ruleIds: ['RULE-002'],
          confidenceScore: 0.88,
          mlPredictionData: { flood_risk: 0.80, rainfall: 120 },
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          reviewedAt: new Date(Date.now() - 3600000).toISOString(),
          allocationId: 42,
        },
        {
          id: 3,
          status: 'PENDING',
          resourceType: 'medical',
          suggestedQuantity: 250,
          provinceId: 3,
          provinceName: 'KPK',
          reasoning: 'Population at risk requires medical supplies',
          ruleIds: ['RULE-003'],
          confidenceScore: 0.75,
          mlPredictionData: { flood_risk: 0.65 },
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          flags: ['LOW_CONFIDENCE'],
        },
      ];
    }
    // Default empty response
    return { data: [], message: 'Mock data not configured for this endpoint' };
  }
}

// Create default instance
const mockClient = new MockAPIClient();

export default mockClient;
export { MockAPIClient };
