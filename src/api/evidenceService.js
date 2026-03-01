// api/evidenceService.js
import apiClient from "./apiClient";

export const evidenceService = {
    // POST /api/evidence/create-evidence
    // Body: FormData { evidence: File, testCaseId: string }
    uploadEvidence: async (testCaseId, file) => {
        const formData = new FormData();
        formData.append("evidence", file);
        formData.append("testCaseId", testCaseId);
        return apiClient.post("/evidence/create-evidence", formData);
    },

    // GET /api/evidence/get-evidence/:testCaseId
    getEvidenceByTestCaseId: async (testCaseId) => {
        return apiClient.get(`/evidence/get-evidence/${testCaseId}`);
    },

    // DELETE /api/evidence/del-evidence/:evidenceId
    deleteEvidence: async (evidenceId) => {
        return apiClient.delete(`/evidence/del-evidence/${evidenceId}`);
    }
};
