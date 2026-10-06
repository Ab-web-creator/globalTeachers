import ProgramSection from "../components/program-section";
import { searchIntroduction } from "./content";
import SearchStageTabs from "./search-stage-tabs";

export default function VipSearch() {
  return (
    <ProgramSection
      id="vip-search"
      label="Поиск вместе"
      title={<>Когда поиск <span className="text-brand-500">уже начался</span></>}
    >
      <p className="mt-7 max-w-3xl text-lg leading-relaxed text-neutral-600">{searchIntroduction}</p>
      <SearchStageTabs />
    </ProgramSection>
  );
}
