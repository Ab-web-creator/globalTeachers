// Convert our authored Uzbek system copy only. Never apply this to user content.
const letters: Record<string, string> = {
  a: "а", b: "б", d: "д", e: "е", f: "ф", g: "г", h: "ҳ", i: "и",
  j: "ж", k: "к", l: "л", m: "м", n: "н", o: "о", p: "п", q: "қ",
  r: "р", s: "с", t: "т", u: "у", v: "в", x: "х", y: "й", z: "з",
  ö: "ў", ğ: "ғ", ş: "ш", ç: "ч",
};
const exceptions: Record<string, string> = {
  yanvar: "январь", fevral: "февраль", aprel: "апрель", sentabr: "сентябрь",
  oktabr: "октябрь", noyabr: "ноябрь", dekabr: "декабрь", iyun: "июнь", iyul: "июль",
  karyera: "карьера", differensial: "дифференциал",
  fransiya: "франция", şveytsariya: "швейцария", seksiya: "секция", funksiya: "функция",
  profil: "профиль", cookie: "куки",
  kompyuter: "компьютер", intervyu: "интервью", rezyume: "резюме", budjet: "бюджет",
  obyekt: "объект", subyekt: "субъект", fakultet: "факультет",
  email: "электрон почта", emailingizga: "электрон почтангизга", emailingiz: "электрон почтангиз",
  emailingizni: "электрон почтангизни", emailni: "электрон почтани", emailga: "электрон почтага",
  emaildan: "электрон почтадан", emailiga: "электрон почтасига", emaili: "электрон почтаси",
};
const protectedText = /https?:\/\/[^\s<>]+|[\w.+-]+@[\w.-]+\.[a-z]+|\{\w+\}|TeacherNavigator|Teacher Portfolio|Teacher Horizons|Search Associates|Global Privacy Control|Do Not Track|LinkedIn|WhatsApp|Telegram|Schrole|Resend|WebP|Word|localhost|sessionStorage|classroom management|extracurricular activities|extracurricular programme|professional statements|application forms?|cover letters?|mock interview|job offer|safeguarding|differentiation|curriculum|assessment|references|referees|Careers|Vacancies|Join Us|Teacher|Cover Letter|About|Year|Shift|Enter|Ctrl|\b(?:START|PRO|VIP|CV|PDF|DOCX?|JPG|PNG|GIF|CVC|CVV|QTS|PGCE|BEd|MEd|IELTS|DB-IP|URL|HTTPS|UTC|TURN|B2|C1|MB|KB)\b/giu;

function matchCase(source: string, target: string): string {
  if (source === source.toUpperCase()) return target.toUpperCase();
  if (source[0] === source[0].toUpperCase()) return target[0].toUpperCase() + target.slice(1);
  return target;
}

function wordToCyrillic(word: string): string {
  const lower = word.toLowerCase();
  for (const [stem, spelling] of Object.entries(exceptions)) {
    if (lower === stem || (["karyera", "differensial", "fransiya", "şveytsariya", "seksiya", "funksiya", "kompyuter", "intervyu", "rezyume", "budjet", "obyekt", "subyekt", "fakultet"].includes(stem) && lower.startsWith(stem))) {
      const suffix = lower.slice(stem.length);
      return matchCase(word, spelling + convertLetters(suffix));
    }
  }
  return matchCase(word, convertLetters(lower));
}

function convertLetters(word: string): string {
  return word
    .replace(/o[‘ʻ’']/g, "ö").replace(/g[‘ʻ’']/g, "ğ")
    .replace(/sh/g, "ş").replace(/ch/g, "ç")
    .replace(/tsiya/g, "ция").replace(/tsion/g, "цион")
    .replace(/ya/g, "я").replace(/yu/g, "ю").replace(/yo/g, "ё").replace(/ye/g, "е")
    .replace(/^e/, "э")
    .replace(/[a-zöğşç‘ʻ’ʼ']/g, letter => /[‘ʻ’ʼ']/.test(letter) ? "ъ" : letters[letter] ?? letter);
}

export function uzbekToCyrillic(text: string): string {
  const convert = (part: string) => part.replace(/[a-zöğşç]+(?:[‘ʻ’ʼ'][a-zöğşç]+)*/giu, wordToCyrillic);
  let result = "";
  let cursor = 0;
  for (const match of text.matchAll(protectedText)) {
    result += convert(text.slice(cursor, match.index)) + match[0];
    cursor = match.index + match[0].length;
  }
  return result + convert(text.slice(cursor));
}
