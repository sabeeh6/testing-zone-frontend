// pages/Features.jsx

import { FeatureCardGrid } from "../components/Card";

export const Features = () => {

  // Temporary dummy data (API aane tak)
  const features = [
    {
      id: 1,
      featureName: "Login System",
      projectName: "ERP System",
      description: "User can login using email and password.",
      type: "feature",
      priority: "medium",
      status: "pending",
    },
    {
      id: 2,
      featureName: "Register API",
      projectName: "ERP System",
      description: "User registration functionality.",
      type: "feature",
      priority: "high",
      status: "active",
    },
    {
      id: 3,
      featureName: "Dashboard UI",
      projectName: "CRM",
      description: "Main dashboard for analytics.",
      type: "improvement",
      priority: "low",
      status: "in_review",
    },
    {
      id: 4,
      featureName: "Bug Fix Payment",
      projectName: "Ecommerce",
      description: "Fix payment gateway issue.",
      type: "bug",
      priority: "critical",
      status: "blocked",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">Features Page</h1>

      <FeatureCardGrid
        features={features}
        onEdit={(id) => console.log("Edit:", id)}
        onDelete={(id) => console.log("Delete:", id)}
      />
    </div>
  );
};