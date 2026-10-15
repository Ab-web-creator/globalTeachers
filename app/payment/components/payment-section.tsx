import Image from "next/image";
import Link from "next/link";
import type { Program } from "../../components/home/categories/programs";

type Props = { program: Program };

export default function PaymentSection({ program }: Props) {
  const tierPath = program.tier.toLowerCase();

  return (
    <section aria-labelledby="payment-title" className="mx-auto max-w-6xl px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
      <Link href={`/programs/${tierPath}`} className="text-sm font-medium text-brand-600 underline underline-offset-4 hover:text-brand-800">
        Вернуться к программе {program.tier}
      </Link>
      <h1 id="payment-title" className="mt-7 text-3xl font-semibold tracking-tight sm:text-4xl">Оплата программы {program.tier}</h1>
      <p className="mt-7 max-w-2xl text-base leading-relaxed text-neutral-600">{program.description}</p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="overflow-hidden rounded-3xl border border-brand-100 bg-white">
          <div className="relative aspect-video bg-brand-100">
            <Image src={program.image} alt={program.alt} fill sizes="(min-width: 1024px) 480px, 100vw" className="object-cover" />
          </div>
          <div className="p-6 sm:p-8">
            <p className="text-sm font-semibold tracking-widest text-brand-500">{program.tier}</p>
            <h2 className="mt-3 text-2xl font-semibold">{program.title.trim()}</h2>
            <p className="mt-7 text-base leading-relaxed text-neutral-600">{program.inclusionLabel}</p>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-base leading-relaxed">
              {program.features.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-neutral-500">{program.supportSummary}</p>
          </div>
        </div>

        <aside aria-labelledby="order-title" className="rounded-3xl border border-brand-100 bg-white p-6 sm:p-8">
          <h2 id="order-title" className="text-2xl font-semibold">Вы выбрали {program.tier}</h2>
          <dl className="mt-7">
            <dt className="text-sm text-neutral-500">Стоимость программы</dt>
            <dd className="mt-2 text-4xl font-semibold text-brand-500">{program.price === null ? "Индивидуально" : `$${program.price}`}</dd>
          </dl>
          <p className="mt-3 text-sm leading-relaxed text-neutral-500">
            {program.price === null ? "Стоимость VIP согласовывается индивидуально." : "Единоразовая оплата в долларах США."}
          </p>
          <div className="mt-7 rounded-2xl bg-brand-50 p-5">
            <h3 className="text-lg font-semibold">Онлайн-оплата скоро появится</h3>
            <p className="mt-3 text-base leading-relaxed">Сейчас оплатить программу на сайте пока нельзя. Мы добавим возможность оплаты на этой странице.</p>
          </div>
          <Link href="/#plans" className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-brand-200 px-5 py-3 text-center font-medium hover:bg-brand-50">
            Сравнить программы
          </Link>
        </aside>
      </div>
    </section>
  );
}
