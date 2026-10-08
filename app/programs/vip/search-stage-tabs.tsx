import VerticalStageTabs from "../../services/components/vertical-stage-tabs";
import { icons } from "../components/icons";
import { searchStages } from "./content";

export default function SearchStageTabs() {
  return (
    <VerticalStageTabs
      id="vip-search"
      autoPreview
      label="Этапы поиска"
      labels={["Вакансии", "Заявки", "Интервью"]}
      paths={[icons.search, icons.document, icons.chat]}
      stages={searchStages}
    />
  );
}
