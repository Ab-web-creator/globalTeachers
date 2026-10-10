import type { SVGProps } from "react";
import { programIconPaths } from "../data/program-icon-paths";

export function SearchDocumentsIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 440 470" fill="none" role="img" aria-label="CV, вакансия международной школы и заметки для интервью" {...props}>
      <ellipse cx="220" cy="236" rx="196" ry="192" className="fill-violet-50" />
      <ellipse cx="230" cy="420" rx="155" ry="13" className="fill-violet-100" />
      <g transform="rotate(9 292 178)">
        <rect x="189" y="57" width="196" height="250" rx="12" className="fill-white stroke-violet-200" strokeWidth="1.5" />
        <path d="M214 81h146v64H214z" className="fill-blue-100" />
        <path d={programIconPaths.school} transform="translate(269 94) scale(1.5)" className="stroke-indigo-500" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        <text x="214" y="177" className="fill-indigo-950" fontSize="15" fontWeight="600">Вакансия школы</text>
        <path d="M214 195h125 M214 208h108 M214 235h135 M214 248h118 M214 261h80" className="stroke-violet-200" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g transform="rotate(-8 147 241)">
        <rect x="48" y="108" width="205" height="280" rx="12" className="fill-white stroke-violet-200" strokeWidth="1.5" />
        <rect x="67" y="130" width="43" height="49" rx="6" className="fill-violet-50" />
        <path d={programIconPaths.profile} transform="translate(77 142)" className="stroke-violet-500" strokeWidth="1.5" strokeLinecap="round" />
        <text x="129" y="156" className="fill-indigo-950" fontSize="26" fontWeight="600">CV</text>
        <path d="M129 173h77" className="stroke-violet-200" strokeWidth="4" strokeLinecap="round" />
        <path d="M70 207h111 M70 265h89 M70 324h98" className="stroke-violet-500" strokeWidth="4" strokeLinecap="round" />
        <path d="M70 224h151 M70 237h126 M70 282h151 M70 295h136 M70 341h151 M70 354h117" className="stroke-violet-200" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g transform="rotate(5 300 349)">
        <rect x="211" y="287" width="190" height="130" rx="10" className="fill-blue-100 stroke-blue-200" />
        <path d={programIconPaths.chat} transform="translate(231 307)" className="stroke-indigo-500" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="268" y="325" className="fill-indigo-950" fontSize="15" fontWeight="600">Интервью</text>
        <g className="stroke-indigo-500" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="m233 349 3 3 6-7 m-9 24 3 3 6-7 m-9 24 3 3 6-7" />
        </g>
        <path d="M255 349h119 M255 369h103 M255 389h112" className="stroke-blue-300" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}
