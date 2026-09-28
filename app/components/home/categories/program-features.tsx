import FeatureText from "./feature-text";

export default function ProgramFeatures({ features }: { features: string[] }) {
  return (
    <ul className="list-disc space-y-3 py-4 pl-5 marker:text-neutral-300">
      {features.map((feature) => (
        <li key={feature} className="pl-1 wrap-break-word text-base leading-normal text-neutral-900 lg:text-sm">
          <FeatureText text={feature} />
        </li>
      ))}
    </ul>
  );
}
