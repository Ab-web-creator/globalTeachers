import type { SVGProps } from "react";

const personPath = "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21v-2a8 8 0 0 1 16 0v2";

const fieldPaths = {
  firstName: personPath,
  lastName: personPath,
  email: "M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm-1 2 9 6 9-6",
  country: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c-5 5-5 13 0 18 5-5 5-13 0-18Z",
  subject: "M3 4h6a4 4 0 0 1 3 2 4 4 0 0 1 3-2h6v15h-6a4 4 0 0 0-3 2 4 4 0 0 0-3-2H3V4Zm9 2v15",
  education: "m2 8 10-5 10 5-10 5L2 8Zm4 2v7c3 4 9 4 12 0v-7m4-2v10",
  english: "M5 3h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-8l-6 4v-4H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm3 12 4-9 4 9m-6.5-3h5",
  qualification: "M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm-4-1-2 7 6-3 6 3-2-7m-7-5 2 2 4-4",
  packagePreference: "M4 7h16v14H4V7Zm4 0V3h8v4M4 12h16m-8 0v4",
  contact: "M7 3 3 5c0 8 8 16 16 16l2-4-5-3-2 2c-3-1-5-3-6-6l2-2-3-5Z",
  goals: "M5 3h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-8l-6 4v-4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2 5h10M7 12h7",
};

export function ClientProfileFieldIcon({ field, ...props }: SVGProps<SVGSVGElement> & { field: keyof typeof fieldPaths }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d={fieldPaths[field]} />
    </svg>
  );
}
