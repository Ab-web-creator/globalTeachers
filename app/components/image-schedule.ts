import { getImageProps } from "next/image";

const listeners = new Set<() => void>();
let heroSlidesReady = false;
let pagePhaseOpen = false;
const pendingPageImages = new Set<symbol>();
let finishPageImages: (() => void) | null = null;

const serviceHeroSizes = "(min-width: 1600px) 688px, (min-width: 1024px) 45vw, 100vw";
const bannerSizes = "(min-width: 1600px) 576px, (min-width: 768px) 40vw, 100vw";
const portfolioSizes = "(min-width: 1024px) 40vw, 90vw";

const laterOptimizedImages: [string, string][] = [
  ["/images/start-career-planning-hero.webp", serviceHeroSizes],
  ["/images/pro-application-hero.webp", serviceHeroSizes],
  ["/images/vip-personal-support-hero-cropped.webp", serviceHeroSizes],
  ["/images/job-search-hero.webp", serviceHeroSizes],
  ["/images/cv-portfolio-hero.webp", serviceHeroSizes],
  ["/images/interview-preparation-hero.webp", serviceHeroSizes],
  ["/images/career-compass.webp", serviceHeroSizes],
  ["/images/start-career-options-wide.webp", bannerSizes],
  ["/images/pro-development-wide.webp", bannerSizes],
  ["/images/career-vip-plan.webp", bannerSizes],
  ["/images/interview-vip-preparation.webp", bannerSizes],
  ["/images/consultation-globe-books.webp", "(min-width: 1024px) 100vw, 0px"],
  ["/images/start-outcomes-flower-stand-v15.webp", "384px"],
  ["/images/vip-career-tree-box-v6.webp", "(min-width: 1600px) 336px, 25vw"],
  ["/images/pro-document-vase-bouquet-v2.webp", "(min-width: 1024px) 384px, 0px"],
  ["/images/career-support-stage-vase-v12.webp", "(min-width: 1280px) 384px, 30vw"],
  ["/images/school-research-flowers-small-hibiscus.webp", "(min-width: 1600px) 576px, 40vw"],
  ["/images/interview-example-notes.webp", "(min-width: 1600px) 448px, 35vw"],
  ["/images/vip-after-offer-transparent.webp", "(min-width: 640px) 384px, 90vw"],
  ["/images/job_search_illust.jpeg", "32vw"],
  ["/images/portfolio/projects.webp", portfolioSizes],
  ["/images/portfolio/events.webp", portfolioSizes],
  ["/images/portfolio/planning.webp", portfolioSizes],
  ["/images/portfolio/achievements.webp", portfolioSizes],
  ["/images/portfolio/certificates.webp", portfolioSizes],
  ["/images/portfolio/clubs.webp", portfolioSizes],
  ["/images/portfolio/leadership.webp", portfolioSizes],
  ["/images/portfolio/materials.webp", portfolioSizes],
  ["/images/platforms/international-school-campus.webp", "(min-width: 1600px) 180px, (min-width: 1280px) 13vw, (min-width: 768px) 20vw, (min-width: 640px) 40vw, 80px"],
  ["/images/platforms/teacher-horizons.png", "240px"],
  ["/images/platforms/search-associates.png", "240px"],
  ["/images/platforms/iss.png", "240px"],
];

const laterRawImages = [
  "/images/start-outcomes-flower-stand-v15.webp",
  "/images/vip-career-tree-box-v6.webp",
  "/images/pro-document-vase-bouquet-v2.webp",
  "/images/career-support-stage-vase-v12.webp",
  "/images/interview-notes-cutout.webp",
  "/svg/masks/interview-notes.svg",
  "/svg/masks/hero-window.svg",
  "/svg/masks/hero-window-mobile.svg",
  "/svg/maps/world-map.svg",
  "/svg/logos/tes-logo.svg",
  "/svg/logos/schrole-logo.svg",
];

function settleWhenQuiet() {
  if (pagePhaseOpen && pendingPageImages.size === 0) finishPageImages?.();
}

export function holdPageImage() {
  const token = Symbol();
  pendingPageImages.add(token);
  let settled = false;
  return (loaded = true) => {
    if (settled) return;
    settled = true;
    pendingPageImages.delete(token);
    if (loaded) settleWhenQuiet();
  };
}

export function whenHeroSlidesReady(listener: () => void) {
  if (heroSlidesReady) listener();
  else listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function preload(src: string) {
  return new Promise<void>((resolve) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  });
}

function preloadOptimized(src: string, sizes: string) {
  const { props } = getImageProps({ alt: "", src, fill: true, sizes });
  return new Promise<void>((resolve) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    if (props.srcSet) {
      image.sizes = props.sizes || sizes;
      image.srcset = props.srcSet;
    } else image.src = props.src;
  });
}

function preloadOtherPages() {
  void Promise.all([
    ...laterOptimizedImages.map(([src, sizes]) => preloadOptimized(src, sizes)),
    ...laterRawImages.map(preload),
  ]);
}

export function markHeroSlidesReady() {
  if (heroSlidesReady) return;
  heroSlidesReady = true;
  listeners.forEach((listener) => listener());
  listeners.clear();
  document.documentElement.dataset.pageImages = "";
  for (const src of ["/images/footer-reference-pattern.webp", "/images/course-categories-four-colors.webp"]) {
    const release = holdPageImage();
    void preload(src).then(() => release(true));
  }
  const pageImagesDone = new Promise<void>((resolve) => {
    finishPageImages = resolve;
  });
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      pagePhaseOpen = true;
      settleWhenQuiet();
    });
  });
  void pageImagesDone.then(preloadOtherPages);
}
