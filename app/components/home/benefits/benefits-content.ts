export type BenefitIconName = "salary" | "housing" | "visa" | "relocation" | "flights" | "insurance" | "education" | "development";

export type Benefit = {
  id: BenefitIconName;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  color: string;
  iconColor: string;
  accentColor: string;
};

export const benefits: Benefit[] = [
  {
    id: "salary",
    title: "home.benefits.benefitsContent.message0291",
    subtitle: "home.benefits.benefitsContent.message0292",
    description: "home.benefits.benefitsContent.message0293",
    image: "/images/benefits/salary.webp",
    color: "bg-linear-to-br from-emerald-100 via-teal-50 to-cyan-50",
    iconColor: "bg-white text-emerald-700",
    accentColor: "text-emerald-700",
  },
  {
    id: "housing",
    title: "home.benefits.benefitsContent.message0294",
    subtitle: "home.benefits.benefitsContent.message0295",
    description: "home.benefits.benefitsContent.message0296",
    image: "/images/benefits/housing.webp",
    color: "bg-linear-to-br from-amber-100 via-orange-50 to-yellow-50",
    iconColor: "bg-white text-amber-700",
    accentColor: "text-amber-700",
  },
  {
    id: "visa",
    title: "home.benefits.benefitsContent.message0297",
    subtitle: "home.benefits.benefitsContent.message0298",
    description: "home.benefits.benefitsContent.message0299",
    image: "/images/benefits/visa-passport.jpg",
    color: "bg-linear-to-br from-violet-100 via-purple-50 to-fuchsia-50",
    iconColor: "bg-white text-violet-700",
    accentColor: "text-violet-700",
  },
  {
    id: "insurance",
    title: "home.benefits.benefitsContent.message0300",
    subtitle: "home.benefits.benefitsContent.message0301",
    description: "home.benefits.benefitsContent.message0302",
    image: "/images/benefits/insurance.webp",
    color: "bg-linear-to-br from-rose-100 via-pink-50 to-orange-50",
    iconColor: "bg-white text-rose-700",
    accentColor: "text-rose-700",
  },
  {
    id: "flights",
    title: "home.benefits.benefitsContent.message0303",
    subtitle: "home.benefits.benefitsContent.message0304",
    description: "home.benefits.benefitsContent.message0305",
    image: "/images/benefits/flights.webp",
    color: "bg-linear-to-br from-sky-100 via-blue-50 to-indigo-50",
    iconColor: "bg-white text-sky-700",
    accentColor: "text-sky-700",
  },
  {
    id: "relocation",
    title: "home.benefits.benefitsContent.message0306",
    subtitle: "home.benefits.benefitsContent.message0307",
    description: "home.benefits.benefitsContent.message0308",
    image: "/images/benefits/relocation.webp",
    color: "bg-linear-to-br from-orange-100 via-amber-50 to-rose-50",
    iconColor: "bg-white text-orange-700",
    accentColor: "text-orange-700",
  },
  {
    id: "development",
    title: "home.benefits.benefitsContent.message0312",
    subtitle: "home.benefits.benefitsContent.message0313",
    description: "home.benefits.benefitsContent.message0314",
    image: "/images/benefits/development.webp",
    color: "bg-linear-to-br from-fuchsia-100 via-pink-50 to-violet-50",
    iconColor: "bg-white text-fuchsia-700",
    accentColor: "text-fuchsia-700",
  },
  {
    id: "education",
    title: "home.benefits.benefitsContent.message0309",
    subtitle: "home.benefits.benefitsContent.message0310",
    description: "home.benefits.benefitsContent.message0311",
    image: "/images/benefits/education-classroom.jpg",
    color: "bg-linear-to-br from-indigo-100 via-violet-50 to-blue-50",
    iconColor: "bg-white text-indigo-700",
    accentColor: "text-indigo-700",
  },
];
