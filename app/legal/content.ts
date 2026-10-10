export type LegalDocument = {
  title: string;
  description: string;
  sections: { title: string; paragraphs: string[] }[];
};

export const operator = {
  name: "TeacherNavigator (предварительное наименование)",
  address: "Страна и юридический адрес будут указаны после подтверждения реквизитов.",
  email: "privacy@example.com",
};
