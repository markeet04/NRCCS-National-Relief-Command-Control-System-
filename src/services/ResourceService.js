/**
 * Resource Service Module
 * Handles all resource-related data operations and business logic
 * Ready for backend API integration
 */

class ResourceService {
  constructor() {
    this.storageKey = 'ndma_resources';
  }

  /**
   * Get all resources with optional filtering
   * @param {Object} filters - Filter options
   * @returns {Array} Array of resource objects
   */
  async getAllResources(filters = {}) {
    try {
      const resources = this.getLocalResources();
      
      if (filters.status) {
        return resources.filter(resource => resource.status === filters.status);
      }
      
      if (filters.province) {
        return resources.filter(resource => resource.province === filters.province);
      }
      
      if (filters.type) {
        return resources.filter(resource => resource.name.toLowerCase().includes(filters.type.toLowerCase()));
      }
      
      return resources;
    } catch (error) {
      console.error('Error fetching resources:', error);
      return [];
    }
  }

  /**
   * Alias for getAllResources - for backward compatibility
   * @param {Object} filters - Filter options
   * @returns {Array} Array of resource objects
   */
  async getResources(filters = {}) {
    return this.getAllResources(filters);
  }

  /**
   * Get resource by ID
   * @param {number} id - Resource ID
   * @returns {Object|null} Resource object or null if not found
   */
  async getResourceById(id) {
    try {
      const resources = this.getLocalResources();
      return resources.find(resource => resource.id === id) || null;
    } catch (error) {
      console.error('Error fetching resource:', error);
      return null;
    }
  }

  /**
   * Create new resource
   * @param {Object} resourceData - Resource data
   * @returns {Object} Created resource object
   */
  async createResource(resourceData) {
    try {
      const resources = this.getLocalResources();
      const newResource = {
        id: Date.now(),
        ...resourceData,
        status: resourceData.status || 'available',
        lastUpdated: new Date().toISOString(),
        history: [
          {
            date: new Date().toISOString(),
            action: 'Created',
            details: 'Resource added to system',
            user: 'Admin'
          }
        ]
      };
      
      resources.push(newResource);
      this.saveLocalResources(resources);
      
      return newResource;
    } catch (error) {
      console.error('Error creating resource:', error);
      throw error;
    }
  }

  /**
   * Update existing resource
   * @param {number} id - Resource ID
   * @param {Object} updateData - Updated resource data
   * @returns {Object} Updated resource object
   */
  async updateResource(id, updateData) {
    try {
      const resources = this.getLocalResources();
      const index = resources.findIndex(resource => resource.id === id);
      
      if (index === -1) {
        throw new Error('Resource not found');
      }
      
      // Add history entry
      const historyEntry = {
        date: new Date().toISOString(),
        action: 'Updated',
        details: `Resource updated`,
        user: 'Admin'
      };
      
      resources[index] = {
        ...resources[index],
        ...updateData,
        lastUpdated: new Date().toISOString(),
        history: [...(resources[index].history || []), historyEntry]
      };
      
      this.saveLocalResources(resources);
      return resources[index];
    } catch (error) {
      console.error('Error updating resource:', error);
      throw error;
    }
  }

  /**
   * Delete resource
   * @param {number} id - Resource ID
   * @returns {boolean} Success status
   */
  async deleteResource(id) {
    try {
      const resources = this.getLocalResources();
      const filteredResources = resources.filter(resource => resource.id !== id);
      
      if (resources.length === filteredResources.length) {
        throw new Error('Resource not found');
      }
      
      this.saveLocalResources(filteredResources);
      return true;
    } catch (error) {
      console.error('Error deleting resource:', error);
      throw error;
    }
  }

  /**
   * Get resource allocation statistics
   * @returns {Object} Resource statistics
   */
  async getResourceStats() {
    try {
      const resources = this.getLocalResources();
      
      return {
        total: resources.length,
        available: resources.filter(r => r.status === 'available').length,
        allocated: resources.filter(r => r.status === 'allocated').length,
        critical: resources.filter(r => r.status === 'critical').length,
        maintenance: resources.filter(r => r.status === 'maintenance').length
      };
    } catch (error) {
      console.error('Error getting resource stats:', error);
      return {
        total: 0, available: 0, allocated: 0, critical: 0, maintenance: 0
      };
    }
  }

  /**
   * Allocate resource to a location/operation
   * @param {number} id - Resource ID
   * @param {Object} allocationData - Allocation details
   * @returns {Object} Updated resource object
   */
  async allocateResource(id, allocationData) {
    try {
      return await this.updateResource(id, {
        status: 'allocated',
        allocation: allocationData
      });
    } catch (error) {
      console.error('Error allocating resource:', error);
      throw error;
    }
  }

  // Private methods for localStorage operations
  getLocalResources() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : this.getDefaultResources();
  }

  saveLocalResources(resources) {
    localStorage.setItem(this.storageKey, JSON.stringify(resources));
  }

  getDefaultResources() {
    return [
      {
        id: 1,
        name: 'Food Supplies',
        icon: 'food',
        quantity: '5,000 units',
        location: 'National Warehouse',
        province: 'Islamabad',
        status: 'available',
        description: 'Emergency food supplies including rice, flour, and canned goods',
        contact: 'warehouse@ndma.gov.pk',
        lastUpdated: new Date().toISOString(),
        history: [
          { date: new Date().toISOString(), action: 'Created', details: 'Initial resource entry', user: 'Admin' }
        ]
      },
      {
        id: 2,
        name: 'Medical Equipment',
        icon: 'medical',
        quantity: '200 units',
        location: 'Medical Depot',
        province: 'Punjab',
        status: 'allocated',
        description: 'Emergency medical equipment and supplies',
        contact: 'medical@ndma.gov.pk',
        lastUpdated: new Date().toISOString(),
        history: [
          { date: new Date().toISOString(), action: 'Created', details: 'Initial resource entry', user: 'Admin' }
        ]
      }
    ];
  }
}

// Create and export service instance
const resourceService = new ResourceService();
export { resourceService as ResourceService };
export default resourceService;