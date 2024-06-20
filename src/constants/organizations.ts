import { Organization } from "../types";


let organizations: Organization[] = [];

// getters and setters for testing
export const setOrganizations = (newOrganizations: Organization[]) => {
  organizations = newOrganizations;
};

export const getOrganizations = () => organizations;

// TODO: replace with database and real data
setOrganizations([
  {
    name: "Tech Innovators Inc.",
    description:
      "Tech Innovators Inc. creates cutting-edge software and AI solutions to empower businesses and individuals. Join us in shaping the future of technology.",
    walletAddress: "0xbE2861F99a051F3A902590f66697854cA215bEA8",
  },
  {
    name: "Green Earth Initiative",
    description:
      "Green Earth Initiative promotes environmental sustainability through awareness, green projects, and advocacy. Together, we can protect our planet.",
    walletAddress: "0xcdA8F5ae4837fF68a22acf3EEA172484180ee37f",
  },
  {
    name: "Health & Wellness Foundation",
    description:
      "Health & Wellness Foundation improves health and well-being with resources, education, and support for mental and physical fitness. Empowering healthier lives.",
    walletAddress: "0xdd51b653c4dFCcC045f91690906C529A1b9FBA95",
  },
]);
