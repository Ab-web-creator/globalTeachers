// A block is a paragraph, a small heading over a list, a bullet list, or a table with an optional total row.
export type LegalBlock =
  | string
  | { heading: string }
  | { list: string[] }
  | { table: { head: string[]; rows: string[][]; foot?: string[] } };

export type LegalSection = { title: string; paragraphs: LegalBlock[]; subsections?: LegalSection[] };

export type LegalDocument = {
  title: string;
  description: string;
  // Pages without final terms show a draft notice; set false once the text is approved.
  draft?: boolean;
  sections: LegalSection[];
};

export const operator = {
  introduction: "По вопросам обработки персональных данных, доступа к ним, исправления или удаления вы можете обратиться к нам:",
  email: "tn.connect@teachernavigator.com",
  website: "https://teachernavigator.com",
  registrationNotice: "Юридические реквизиты компании будут указаны после завершения регистрации.",
};
