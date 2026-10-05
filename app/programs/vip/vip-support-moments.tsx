import LineIcon from "../../services/components/line-icon";
import { icons } from "../components/icons";
import { iconTones } from "../components/icon-tones";
import { value } from "./content";

export default function VipSupportMoments() {
  return (
    <ul className="mt-10 grid gap-5 sm:grid-cols-2">
      {value.moments.map(({ title, text, icon }, index) => (
        <li key={title} className="flex w-full max-w-2xl items-start gap-5 rounded-3xl bg-white p-5">
          <span aria-hidden="true" className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${iconTones[index]}`}>
            <LineIcon path={icons[icon]} className="size-6" />
          </span>
          <div className="min-w-0">
            <h3 className="text-lg font-semibold leading-snug text-brand-950">{title}</h3>
            <p className="text-base leading-relaxed text-neutral-600">{text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
