import { PreparationDocumentsIllustration } from "@/app/components/svg";

export default function PreparationNote() {
  return (
    <div aria-hidden="true" className="w-64">
      <PreparationDocumentsIllustration />
      <p style={{ fontFamily: '"Segoe Print", "Bradley Hand", cursive' }} className="-rotate-3 text-center text-xl italic leading-relaxed text-brand-500">
        От заявки до предложения<br />— мы рядом
      </p>
    </div>
  );
}
