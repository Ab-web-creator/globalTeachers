import SiteHeader from "./home/site-header";

export default function PageHeader({ inFlow = false }: { inFlow?: boolean }) {
  return (
    <>
      <SiteHeader inFlow={inFlow} />
      {!inFlow && <div aria-hidden="true" className="h-14 lg:h-16" />}
    </>
  );
}
