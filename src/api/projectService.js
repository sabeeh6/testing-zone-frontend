import apiClient from './apiClient';

export const projectService = {
    getAllProjects: async () => {
        return apiClient.get('/tester/get-all-projects');
    },

    createProject: async (projectData) => {
        return apiClient.post('/tester/create-project', projectData);
    },

    updateProject: async (projectData) => {
        // Now sending ID in URL parameter
        const { _id, ...data } = projectData;
        return apiClient.put(`/tester/update-project/${_id}`, data);
    },

    deleteProject: async (id) => {
        // Now sending ID in URL parameter
        return apiClient.delete(`/tester/delete-project/${id}`);
    }
};
