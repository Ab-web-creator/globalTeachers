import ProgramSection from "../components/program-section";
import AnimatedQuestions from "./animated-questions";

export default function StartQuestions() {
  return (
    <ProgramSection id="start-questions" label="Знакомо?" title="Хотите начать, но есть вопросы?">
      <p className="mt-7 max-w-3xl text-lg leading-relaxed text-neutral-600">Вы хотите работать в международной школе, но пока не уверены, с чего начать. Возможно, вас волнуют такие вопросы:</p>
      <div className="mt-10 text-lg">
        <AnimatedQuestions />
      </div>
    </ProgramSection>
  );
}
