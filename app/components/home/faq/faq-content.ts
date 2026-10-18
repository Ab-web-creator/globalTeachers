import type { FaqIconName } from "@/app/components/svg";

export const faqItems: { question: string; answer: string; icon: FaqIconName; action?: { href: string; label: string } }[] = [
  {
    icon: "experience",
    question: "home.faq.faqContent.message0378",
    answer: "home.faq.faqContent.message0379",
  },
  {
    icon: "education",
    question: "home.faq.faqContent.message0380",
    answer: "home.faq.faqContent.message0381",
  },
  {
    icon: "language",
    question: "home.faq.faqContent.message0382",
    answer: "home.faq.faqContent.message0383",
  },
  {
    icon: "countries",
    question: "home.faq.faqContent.message0384",
    answer: "home.faq.faqContent.message0385",
  },
  {
    icon: "salary",
    question: "home.faq.faqContent.message0386",
    answer: "home.faq.faqContent.message0387",
  },
  {
    icon: "visa",
    question: "home.faq.faqContent.message0388",
    answer: "home.faq.faqContent.message0389",
  },
  {
    icon: "family",
    question: "home.faq.faqContent.message0390",
    answer: "home.faq.faqContent.message0391",
  },
  {
    icon: "timing",
    question: "home.faq.faqContent.message0392",
    answer: "home.faq.faqContent.message0393",
  },
  {
    icon: "hiring",
    question: "home.faq.faqContent.message0394",
    answer: "home.faq.faqContent.message0395",
  },
  {
    icon: "start",
    question: "home.faq.faqContent.message0396",
    answer: "home.faq.faqContent.message0397",
    action: { href: "/consultation", label: "home.faq.faqContent.message0398" },
  },
];
