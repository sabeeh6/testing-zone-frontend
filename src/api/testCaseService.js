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

    // POST /tester/again-test/:id
    againTest: async (id, data) => {
        return apiClient.post(`/tester/again-test/${id}`, data);
    },

    // GET /tester/get-executions/:id
    getExecutions: async (id) => {
        return apiClient.get(`/tester/get-executions/${id}`);
    },

    // GET /tester/get-execution/:id
    getExecutionById: async (id) => {
        return apiClient.get(`/tester/get-execution/${id}`);
    },

    // PUT /tester/update-execution/:id
    updateExecution: async (id, data) => {
        return apiClient.put(`/tester/update-execution/${id}`, data);
    },

    // DELETE /tester/delete-execution/:id
    deleteExecution: async (id) => {
        return apiClient.delete(`/tester/delete-execution/${id}`);
    },
};
