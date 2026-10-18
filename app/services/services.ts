export const services = [
  {
    slug: "job-search",
    title: "services.jobSearch.jobSearchHero.message1699",
    description: "services.services.message1728",
    imageBounds: [79, 43, 495, 535] as const,
    introduction: "services.services.message1729",
    topics: [
      { title: "services.services.message1730", text: "services.services.message1731" },
      { title: "services.careerSupport.content.message1380", text: "services.services.message1732" },
      { title: "services.services.message1733", text: "services.services.message1734" },
    ],
    preparation: "services.services.message1735",
  },
  {
    slug: "cv-portfolio",
    title: "services.cvPortfolio.cvHero.message1478",
    description: "services.services.message1736",
    imageBounds: [665, 81, 550, 496] as const,
    introduction: "services.services.message1737",
    topics: [
      { title: "services.cvPortfolio.cvStructure.message1481", text: "services.services.message1738" },
      { title: "services.services.message1739", text: "services.services.message1740" },
      { title: "services.services.message1741", text: "services.services.message1742" },
    ],
    preparation: "services.services.message1743",
  },
  {
    slug: "interview-preparation",
    title: "programs.pro.content.message1149",
    description: "services.services.message1744",
    imageBounds: [63, 662, 508, 528] as const,
    introduction: "services.services.message1745",
    topics: [
      { title: "services.services.message1746", text: "services.services.message1747" },
      { title: "services.services.message1748", text: "services.services.message1749" },
      { title: "services.services.message1750", text: "services.services.message1751" },
    ],
    preparation: "services.services.message1752",
  },
  {
    slug: "career-support",
    title: "services.careerSupport.careerSupportHero.message1367",
    description: "services.services.message1753",
    imageBounds: [644, 693, 579, 493] as const,
    introduction: "services.services.message1754",
    topics: [
      { title: "services.services.message1755", text: "services.services.message1756" },
      { title: "services.services.message1757", text: "services.services.message1758" },
      { title: "services.services.message1759", text: "services.services.message1760" },
    ],
    preparation: "services.services.message1761",
  },
];

export type Service = (typeof services)[number];
