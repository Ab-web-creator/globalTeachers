import SectionHeading from "../section-heading";
import SectionLabel from "./section-label";

export default function PlatformsHeader() {
  return (
    <div className="max-w-3xl">
      <SectionLabel>Полезные ресурсы</SectionLabel>
      <SectionHeading id="recruitment-platforms" className="text-brand-950">
        Полезные платформы для поиска вакансий
      </SectionHeading>
      <p className="mt-7 text-lg leading-relaxed text-neutral-600">
        Существует несколько веб-платформ, на которых международные школы из разных стран публикуют вакансии. Используйте их, чтобы найти позиции, которые соответствуют вашему опыту, предмету и желаемой стране.
      </p>
      <p className="mt-4 text-lg leading-relaxed text-neutral-600">
        <strong className="font-semibold text-brand-950">Совет:</strong> создайте профиль на нескольких платформах и настройте уведомления о новых вакансиях — так вы не пропустите подходящие возможности.
      </p>
    </div>
  );
}
