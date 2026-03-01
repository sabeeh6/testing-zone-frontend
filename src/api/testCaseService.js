import apiClient from './apiClient';

export const testCaseService = {
    // GET /tester/get-testcase/:id
    getTestCaseById: async (id) => {
        return apiClient.get(`/tester/get-testcase/${id}`);
    },

    // GET /tester/get-testCases-by-featureId/:id
    getTestCasesByFeatureId: async (featureId) => {
        return apiClient.get(`/tester/get-testCases-by-featureId/${featureId}`);
    },

    // POST /tester/create-testCase
    createTestCase: async (testCaseData) => {
        return apiClient.post('/tester/create-testCase', testCaseData);
    },

    // PUT /tester/update-testCase/:id
    updateTestCase: async (id, testCaseData) => {
        return apiClient.put(`/tester/update-testCase/${id}`, testCaseData);
    },

    // DELETE /tester/delete-testcase/:id
    deleteTestCase: async (id) => {
        return apiClient.delete(`/tester/delete-testcase/${id}`);
    },
};
