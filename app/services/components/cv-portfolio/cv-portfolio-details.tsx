import CvExperience from "./cv-experience";
import CvHero from "./cv-hero";
import CvStructure from "./cv-structure";
import QualitySection from "./quality-section";
import TeacherPortfolio from "./teacher-portfolio";

export default function CvPortfolioDetails() {
  return (
    <main className="mx-auto max-w-400 px-6 pt-6 pb-12 sm:px-10 sm:pb-16 lg:px-16 lg:pt-0 lg:pb-20 xl:px-20">
      <article>
        <CvHero />
        <div>
          <CvStructure />
          <CvExperience />
          <TeacherPortfolio />
          <QualitySection />
        </div>
      </article>
    </main>
  );
}
