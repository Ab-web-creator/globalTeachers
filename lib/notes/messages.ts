const en = {
  heading: "My Notes",
  count: (count: number) =>
    `At the moment you have ${count} ${count === 1 ? "note" : "notes"}`,
  device:
    "This browser only. Notes are not sent to the server. Clearing site data deletes them.",
  search: "Search notes",
  newNote: "New Note",
  empty: "No notes yet",
  emptyHint: "Create your first note to keep an idea close by.",
  noMatches: "No notes match your search",
  noMatchesHint: "Try another word or clear the search.",
  title: "Title",
  body: "Write your note…",
  untitled: "Untitled",
  close: "Close notes",
  open: "Open notes",
  drag: "Drag to reorder. Use arrow keys to move a note.",
  delete: "Delete note",
  confirmDelete: "Delete this note? This cannot be undone.",
  storageError:
    "These changes could not be saved in this browser. Keep this page open to avoid losing them.",
};
export type NotesMessages = typeof en;
export const notesMessages: Record<
  "en" | "de" | "nl" | "tr" | "uz" | "ru",
  NotesMessages
> = {
  en,
  de: {
    heading: "Meine Notizen",
    count: (n) => `Du hast momentan ${n} Notizen`,
    device:
      "Nur in diesem Browser. Notizen werden nicht an den Server gesendet. Beim Löschen der Websitedaten gehen sie verloren.",
    search: "Notizen suchen",
    newNote: "Neue Notiz",
    empty: "Noch keine Notizen",
    emptyHint: "Erstelle deine erste Notiz für eine Idee.",
    noMatches: "Keine passenden Notizen",
    noMatchesHint: "Suche nach einem anderen Wort oder leere die Suche.",
    title: "Titel",
    body: "Schreibe deine Notiz…",
    untitled: "Ohne Titel",
    close: "Notizen schließen",
    open: "Notizen öffnen",
    drag: "Zum Sortieren ziehen oder die Pfeiltasten verwenden.",
    delete: "Notiz löschen",
    confirmDelete:
      "Diese Notiz löschen? Dies kann nicht rückgängig gemacht werden.",
    storageError:
      "Änderungen konnten nicht gespeichert werden. Lass diese Seite geöffnet, um sie nicht zu verlieren.",
  },
  nl: {
    heading: "Mijn notities",
    count: (n) => `Je hebt momenteel ${n} notities`,
    device:
      "Alleen in deze browser. Notities worden niet naar de server gestuurd. Als je sitegegevens wist, verdwijnen ze.",
    search: "Notities zoeken",
    newNote: "Nieuwe notitie",
    empty: "Nog geen notities",
    emptyHint: "Maak je eerste notitie om een idee te bewaren.",
    noMatches: "Geen notities gevonden",
    noMatchesHint: "Probeer een ander woord of wis de zoekopdracht.",
    title: "Titel",
    body: "Schrijf je notitie…",
    untitled: "Zonder titel",
    close: "Notities sluiten",
    open: "Notities openen",
    drag: "Sleep om te sorteren of gebruik de pijltjestoetsen.",
    delete: "Notitie verwijderen",
    confirmDelete:
      "Deze notitie verwijderen? Dit kan niet ongedaan worden gemaakt.",
    storageError:
      "Wijzigingen konden niet worden opgeslagen. Houd deze pagina open om ze niet te verliezen.",
  },
  tr: {
    heading: "Notlarım",
    count: (n) => `Şu anda ${n} notunuz var`,
    device:
      "Yalnızca bu tarayıcıda. Notlar sunucuya gönderilmez. Site verileri temizlenirse notlar silinir.",
    search: "Notlarda ara",
    newNote: "Yeni Not",
    empty: "Henüz not yok",
    emptyHint: "Bir fikri saklamak için ilk notunuzu oluşturun.",
    noMatches: "Aramanızla eşleşen not yok",
    noMatchesHint: "Başka bir kelime deneyin veya aramayı temizleyin.",
    title: "Başlık",
    body: "Notunuzu yazın…",
    untitled: "Başlıksız",
    close: "Notları kapat",
    open: "Notları aç",
    drag: "Sıralamak için sürükleyin veya ok tuşlarını kullanın.",
    delete: "Notu sil",
    confirmDelete: "Bu not silinsin mi? Bu işlem geri alınamaz.",
    storageError:
      "Değişiklikler kaydedilemedi. Kaybetmemek için bu sayfayı açık tutun.",
  },
  uz: {
    heading: "Qaydlarim",
    count: (n) => `Hozir sizda ${n} ta qayd bor`,
    device:
      "Faqat shu brauzerda. Qaydlar serverga yuborilmaydi. Sayt maʼlumotlari tozalansa, qaydlar oʻchadi.",
    search: "Qaydlarni qidirish",
    newNote: "Yangi qayd",
    empty: "Hali qaydlar yoʻq",
    emptyHint: "Fikrni saqlash uchun birinchi qaydingizni yarating.",
    noMatches: "Qidiruvga mos qaydlar yoʻq",
    noMatchesHint: "Boshqa soʻzni sinab koʻring yoki qidiruvni tozalang.",
    title: "Sarlavha",
    body: "Qaydingizni yozing…",
    untitled: "Sarlavhasiz",
    close: "Qaydlarni yopish",
    open: "Qaydlarni ochish",
    drag: "Tartiblash uchun torting yoki yoʻnalish tugmalaridan foydalaning.",
    delete: "Qaydni oʻchirish",
    confirmDelete: "Bu qayd oʻchirilsinmi? Buni qaytarib boʻlmaydi.",
    storageError:
      "Oʻzgarishlar saqlanmadi. Ularni yoʻqotmaslik uchun sahifani ochiq tuting.",
  },
  ru: {
    heading: "Мои заметки",
    count: (n) => `Сейчас у вас заметок: ${n}`,
    device:
      "Заметки сохраняются только в этом браузере на этом устройстве и недоступны в других браузерах или на других устройствах. Заметки не отправляются на сервер. Очистка данных сайта удалит их.",
    search: "Поиск заметок",
    newNote: "Новая заметка",
    empty: "Заметок пока нет",
    emptyHint: "Создайте первую заметку, чтобы сохранить идею.",
    noMatches: "Заметки не найдены",
    noMatchesHint: "Попробуйте другое слово или очистите поиск.",
    title: "Заголовок",
    body: "Напишите заметку…",
    untitled: "Без названия",
    close: "Закрыть заметки",
    open: "Открыть заметки",
    drag: "Перетащите для сортировки или используйте клавиши со стрелками.",
    delete: "Удалить заметку",
    confirmDelete: "Удалить эту заметку? Это действие нельзя отменить.",
    storageError:
      "Изменения не удалось сохранить в браузере. Оставьте страницу открытой, чтобы не потерять их.",
  },
};
export type NotesLocale = keyof typeof notesMessages;
