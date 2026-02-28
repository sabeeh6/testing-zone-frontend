import apiClient from './apiClient';

export const featureService = {
    // GET /tester/get-feature/:id
    getFeatureById: async (id) => {
        return apiClient.get(`/tester/get-feature/${id}`);
    },

    // GET /tester/get-feature-by-projectId/:id
    getFeaturesByProjectId: async (projectId) => {
        return apiClient.get(`/tester/get-feature-by-projectId/${projectId}`);
    },

    // POST /tester/create-feature
    createFeature: async (featureData) => {
        return apiClient.post('/tester/create-feature', featureData);
    },

    // PUT /tester/update-feature/:id
    updateFeature: async (id, featureData) => {
        return apiClient.put(`/tester/update-feature/${id}`, featureData);
    },

    // DELETE /tester/delete-feature/:id
    deleteFeature: async (id) => {
        return apiClient.delete(`/tester/delete-feature/${id}`);
    },
};
