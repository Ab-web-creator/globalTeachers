export const photos = {
  study: "https://images.pexels.com/photos/5940838/pexels-photo-5940838.jpeg?auto=compress&cs=tinysrgb&w=1000",
  student: "https://images.pexels.com/photos/5940841/pexels-photo-5940841.jpeg?auto=compress&cs=tinysrgb&w=1000",
};

export const panels = {
  About: { title: "A world of learning, made for you.", text: "Educine brings curious minds together. Explore new interests, build practical skills, and find inspiration for your next chapter." },
  Courses: { title: "What will you learn next?", text: "Explore a preview of our learning categories. Course enrollment is coming soon." },
  Pages: { title: "Your learning journey starts here.", text: "Our educator directory, student stories, and learning resources are coming soon. In the meantime, explore the course categories to find your next interest." },
  Contact: { title: "Let’s connect.", text: "Have a question about learning with Educine? Contact details will be available here soon." },
  Demo: { title: "A little curiosity. Endless possibilities.", text: "Choose a subject you love, learn at your own pace, and build your confidence one lesson at a time. A video tour of the platform is coming soon." },
};
export type Panel = keyof typeof panels;

export type PanelProps = { openPanel: (panel: Panel) => void };
