import HighlightCard from "./highlight-card";

// A highlighted card that leads into one key question, shown in a bordered box.
export default function QuestionCard({ lead, question }: { lead: string; question: string }) {
  return (
    <HighlightCard>
      <p className="leading-relaxed text-neutral-600">{lead}</p>
      <p className="mt-4 rounded-2xl border border-brand-300 px-4 py-5 text-center text-lg font-semibold leading-snug text-brand-500">{question}</p>
    </HighlightCard>
  );
}
