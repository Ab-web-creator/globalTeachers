const startServices = [
  "home.categories.featureText.message0319",
  "home.categories.featureText.message0321",
  "home.categories.featureText.message0323",
];
const proServices = [
  "home.categories.featureText.message0327",
  "home.categories.featureText.message0329",
  "home.categories.programs.message0358",
  "home.categories.featureText.message0332",
  "home.categories.programs.message0359",
];

export const programs = [
  {
    tier: "START", title: "home.categories.programs.message0360", image: "/images/startPackage.webp",
    price: 99,
    alt: "home.categories.programs.message0361",
    description: "home.categories.programs.message0362",
    inclusionLabel: "home.categories.programs.message0363",
    inheritedServices: [] as string[],
    supportSummary: "home.categories.programs.message0364",
    features: [...startServices, "home.categories.featureText.message0325"],
    icons: ["profile", "chat", "document", "support"],
  },
  {
    tier: "PRO", title: "home.categories.programs.message0365", image: "/images/proPackage.webp",
    price: 299,
    alt: "home.categories.programs.message0366",
    description: "home.categories.programs.message0367",
    inclusionLabel: "home.categories.programs.message0368",
    inheritedServices: startServices,
    supportSummary: "home.categories.programs.message0369",
    features: [proServices[0], proServices[1], proServices[3], "home.categories.featureText.message0334"],
    icons: ["document", "folder", "profile", "support"],
  },
  {
    tier: "VIP", title: "home.categories.programs.message0370", image: "/images/VIPpackage.webp",
    price: null,
    alt: "home.categories.programs.message0371",
    description: "home.categories.programs.message0372",
    inclusionLabel: "home.categories.programs.message0373",
    inheritedServices: [...startServices, ...proServices],
    supportSummary: "home.categories.programs.message0374",
    features: [
      "home.categories.featureText.message0336",
      "home.categories.featureText.message0338",
      "home.categories.featureText.message0340",
      "home.categories.featureText.message0342",
    ],
    icons: ["target", "profile", "document", "star"],
  },
];

export type Program = (typeof programs)[number];
