import IconPanel from "../cv-portfolio/icon-panel";
import { supportMeaning } from "./content";

export default function SupportMeaning() {
  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 bg-linear-to-r from-blue-50 to-violet-100">
      <div className="mx-auto grid max-w-400 gap-6 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-2 lg:px-16 lg:py-20 xl:px-20">
        <IconPanel id="support-not" title="Сопровождение: чем оно не является" icon="info" tone="yellow">
          <p className="mt-5 max-w-[64ch] text-lg leading-relaxed text-neutral-600">{supportMeaning.isNot}</p>
          <p className="mt-6 text-lg font-semibold leading-relaxed text-yellow-700">{supportMeaning.decision}</p>
        </IconPanel>
        <IconPanel id="support-gives" title="Сопровождение: что оно даёт" icon="handshake" tone="green">
          <p className="mt-5 max-w-[64ch] text-lg leading-relaxed text-neutral-600">{supportMeaning.is}</p>
        </IconPanel>
      </div>
    </div>
  );
}
