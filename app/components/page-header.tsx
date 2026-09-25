import SiteHeader from "./home/site-header";

export default function PageHeader() {
  return (
    <>
      <SiteHeader />
      <div aria-hidden="true" className="h-14 lg:h-16" />
    </>
  );
}
