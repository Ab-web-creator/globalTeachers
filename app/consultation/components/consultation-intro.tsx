export default function ConsultationIntro() {
  return (
    <div className="relative max-w-xl">
      <p className="hidden text-sm font-medium tracking-widest text-slate-500 uppercase lg:block">Новые возможности ждут</p>
      <h1 className="mt-4 hidden text-6xl leading-none font-semibold tracking-tight text-slate-950 lg:block xl:text-7xl">Один мир.<br />Больше<br />возможностей.</h1>
      <div className="lg:mt-6 lg:max-w-md">
        <div className="lg:rounded-2xl lg:bg-white/90 lg:p-5 lg:backdrop-blur-sm">
          <p className="text-base leading-relaxed text-slate-800 sm:text-lg">Оставьте заявку на консультацию — вместе определим ваш следующий шаг к работе в международной школе.</p>
          <div className="mt-6 hidden grid-cols-3 divide-x divide-slate-300 text-sm text-slate-700 lg:grid">
            <p className="pr-3"><strong className="block text-2xl font-semibold text-slate-950">{consultationSteps.length}</strong>коротких шагов</p>
            <p className="px-3"><strong className="block text-2xl font-semibold text-slate-950">Ваш</strong>личный план</p>
            <p className="pl-3"><strong className="block text-2xl font-semibold text-slate-950">Новые</strong>возможности</p>
          </div>
        </div>
      </div>
    </div>
  );
}
import { consultationSteps } from "./consultation-steps";
