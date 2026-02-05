"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  type MotionValue,
  useMotionTemplate,
} from "framer-motion";
import {
  BookOpen,
  Sparkles,
  Share2,
  ScanText,
  Smartphone,
  Zap,
  Heart,
  Clock,
  Printer,
  ChefHat,
  Utensils,
  Coffee,
  Pizza,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import CoverFront from "@/assets/front-cover-book.png";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// --- MOCK DATA FOR RECIPE PRINT ---
const MOCK_RECIPE = {
  name: "Poke Bowl Saumon",
  servings: 2,
  prep_time: 25,
  image_url:
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1200",
  ingredients: [
    "200g de saumon frais",
    "1 avocat mûr",
    "150g de riz à sushi",
    "1 mangue",
    "Edamames",
    "Sauce soja sucrée",
    "Graines de sésame",
  ],
  steps: [
    "Rincez le riz jusqu'à ce que l'eau soit claire, puis faites-le cuire.",
    "Coupez le saumon en dés réguliers et réservez au frais.",
    "Tranchez l'avocat et la mangue en lamelles fines.",
    "Disposez le riz tiède au fond du bol.",
    "Arrangez harmonieusement les garnitures par-dessus.",
    "Parsemez de sésame et arrosez de sauce juste avant de servir.",
  ],
};

// --- COMPONENT: RECIPE PRINT ---
const PAGE_WIDTH = 900;
const PAGE_HEIGHT = 1270;

function RecipePrint({
  recipe,
  startIndex,
}: {
  recipe: typeof MOCK_RECIPE;
  startIndex: number;
}) {
  if (!recipe) return null;

  return (
    <div
      className="recipe-print-container"
      style={{
        width: `${PAGE_WIDTH}px`,
        maxWidth: `${PAGE_WIDTH}px`,
        backgroundColor: "#ffffff",
        padding: "48px",
        color: "#1a1a1a",
        fontFamily: '"Playfair Display", serif',
        position: "relative",
        minHeight: `${PAGE_HEIGHT}px`,
        height: `${PAGE_HEIGHT}px`,
        overflow: "hidden",
      }}
    >
      <header className="flex flex-col items-end mb-5">
        <h1
          style={{
            fontFamily: '"Dancing Script", cursive',
            fontSize: "65px",
            fontWeight: 700,
            letterSpacing: "0.05em",
            lineHeight: 1,
            color: "#000",
            marginTop: "8px",
            textAlign: "right",
          }}
        >
          {recipe.name}
        </h1>

        <div
          className="flex gap-8 items-center mt-3 mb-1"
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: "18px",
            color: "#1f2937",
          }}
        >
          <div className="flex items-center gap-2">
            <span>
              {recipe.servings} {recipe.servings > 1 ? "personnes" : "personne"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>{recipe.prep_time} minutes</span>
          </div>
        </div>
      </header>

      <div className="relative w-full mb-8">
        <div
          className="w-full overflow-hidden"
          style={{ height: "450px", borderRadius: "50px" }}
        >
          <img
            src={recipe.image_url}
            alt={recipe.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            right: 0,
            top: "320px",
            width: "320px",
            backgroundColor: "#f2eeeb",
            borderRadius: "30px",
            padding: "32px",
            zIndex: 10,
          }}
        >
          <h3
            style={{
              fontFamily: '"Dancing Script", cursive',
              fontWeight: 700,
              fontSize: "32px",
              marginBottom: "24px",
              letterSpacing: "0.05em",
            }}
          >
            Ingrédients
          </h3>
          <ul
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: "18px",
              color: "#1f2937",
              lineHeight: "1.4",
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex" style={{ fontFamily: '"Playfair Display", serif' }}>
        <div
          style={{ width: "100%", paddingRight: "32px", paddingTop: "16px" }}
        >
          <h2
            style={{
              fontWeight: 700,
              fontSize: "40px",
              marginBottom: "24px",
              letterSpacing: "0.05em",
              fontFamily: '"Dancing Script", cursive',
            }}
          >
            Préparation
          </h2>

          <ol
            style={{
              listStyleType: "decimal",
              listStylePosition: "outside",
              marginLeft: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              color: "#1f2937",
              fontSize: "17px",
              lineHeight: "1.625",
            }}
          >
            {recipe.steps.map((step, i) => (
              <li key={i} style={{ paddingLeft: "8px" }}>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "24px",
          left: "48px",
          right: "48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "16px",
          borderTop: "1px solid #d1d5db",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            color: "#9ca3af",
            fontFamily: "monospace",
          }}
        >
          Mon Carnet de Recettes
        </span>
        <span
          style={{
            fontSize: "14px",
            fontWeight: 700,
            fontFamily: "monospace",
            color: "#4b5563",
          }}
        >
          {startIndex}
        </span>
      </div>
    </div>
  );
}

// --- DATA: Features ---
const interactiveFeatures = [
  {
    id: 0,
    title: "Votre carnet, version blog",
    desc: "Créez, éditez et stockez toutes vos recettes dans un espace personnel élégant. Chaque recette devient un véritable article, clair et agréable à lire.",
    icon: Zap,
    image:
      "https://images.unsplash.com/photo-1495521821378-860fa0171970?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 1,
    title: "Profil public partageable",
    desc: "Transformez votre carnet en vitrine culinaire. Partagez un lien unique pour permettre à vos proches (ou au monde entier) de découvrir vos recettes.",
    icon: Share2,
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 2,
    title: "Scan OCR intelligent",
    desc: "Prenez en photo une recette papier. MyCook extrait automatiquement le texte et crée une recette propre, prête à être modifiée et enregistrée.",
    icon: ScanText,
    image:
      "https://images.unsplash.com/photo-1589820296156-2454bb8a441e?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 3,
    title: "Carnet imprimé à la demande",
    desc: "À tout moment, commandez votre carnet de recettes en version papier. Un bel objet, personnalisé, à garder dans votre cuisine ou à offrir.",
    icon: Smartphone,
    image:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200",
  },
];

// --- DATA: Hero recipe cards ---
const heroRecipeCards = [
  {
    title: "Poke Bowl",
    subtitle: "@ChefAlex",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
    isMain: true,
    initX: 0,
    initY: 0,
    initRotation: 0,
    initScale: 1,
    zIndex: 30,
  },
  {
    title: "Pancakes Fluffy",
    subtitle: "Petit-Dej",
    img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&q=80&w=400",
    isMain: false,
    initX: -300,
    initY: -100,
    initRotation: -6,
    initScale: 0.85,
    zIndex: 10,
  },
  {
    title: "Salade César",
    subtitle: "Healthy",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
    isMain: false,
    initX: 250,
    initY: 130,
    initRotation: 6,
    initScale: 0.85,
    zIndex: 10,
  },
  {
    title: "Avocado Toast",
    subtitle: "Brunch",
    img: "https://plus.unsplash.com/premium_photo-1691090282768-380cc3e34b23?q=80&w=2670&auto=format&fit=crop",
    isMain: false,
    initX: 280,
    initY: -80,
    initRotation: 3,
    initScale: 0.85,
    zIndex: 10,
  },
];

// --- Floating card Component ---
const FloatingHeroCard = ({
  card,
  index,
  progress,
}: {
  card: (typeof heroRecipeCards)[0];
  index: number;
  progress: MotionValue<number>;
}) => {
  const x = useTransform(progress, [0.08, 0.28], [card.initX, 0]);
  const y = useTransform(progress, [0.08, 0.28], [card.initY, index * 3 - 5]);
  const rotate = useTransform(
    progress,
    [0.08, 0.28],
    [card.initRotation, (index - 1.5) * 2],
  );
  const scale = useTransform(
    progress,
    [0.08, 0.24, 0.36],
    [card.initScale, card.isMain ? 0.6 : 0.45, 0],
  );

  const blur = useTransform(progress, [0.25, 0.35], [0, 200]);

  const opacity = useTransform(progress, [0.3, 0.38], [1, 0]);
  const filter = useMotionTemplate`blur(${blur}px)`;

  return (
    <motion.div
      style={{ x, y, rotate, scale, opacity, zIndex: card.zIndex, filter }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none will-change-transform"
    >
      {card.isMain ? (
        <div className="w-[280px] md:w-[360px] bg-white rounded-[2rem] shadow-2xl border border-white/50">
          <div className="h-44 md:h-56 overflow-hidden rounded-t-[2rem] relative bg-gray-100">
            <Image
              src={card.img}
              alt={card.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl md:text-2xl font-black text-neutral-900 mb-1">
                  {card.title}
                </h3>
              </div>
              <div className="p-2 rounded-full bg-orange-50 text-orange-500">
                <Heart size={18} fill="currentColor" />
              </div>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-lg bg-neutral-100 text-neutral-600 text-xs font-bold flex items-center gap-1">
                <Clock size={12} /> 25 min
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-44 md:w-52 bg-white p-3 rounded-2xl shadow-lg border border-neutral-100">
          <div className="relative h-24 md:h-28 rounded-xl overflow-hidden mb-2 bg-gray-100">
            <Image
              src={card.img}
              alt={card.title}
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

const getColSpan = (idx: number) => {
  switch (idx) {
    case 0:
      return "lg:col-span-2";
    case 3:
      return "lg:col-span-2";
    default:
      return "lg:col-span-1";
  }
};

// --- Unified section: Hero cards → Book ---
const HeroCardsToBook = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });

  // On commence avec une lueur visible (0.4) dès le début
  const glowScale = useTransform(progress, [0, 0.1, 0.38], [0.5, 1, 0.2]);
  const glowOpacity = useTransform(progress, [0, 0.06, 0.4], [0.4, 0.7, 0]);

  const bookOpacity = useTransform(progress, [0.3, 0.42], [0, 1]);
  const bookScale = useTransform(progress, [0, 0.3, 0.42], [0.1, 0.3, 1]);
  const bookBlur = useTransform(progress, [0, 0.32], [100, 0]);
  const bookBlurFilter = useMotionTemplate`blur(${bookBlur}px)`;

  const coverRotate = useTransform(progress, [0.5, 0.74], [0, -160]);
  const shadowOpacity = useTransform(progress, [0.5, 0.74], [0.08, 0.35]);

  const titleOpacity = useTransform(progress, [0.36, 0.48], [0, 1]);
  const titleY = useTransform(progress, [0.36, 0.48], [30, 0]);

  const pageContentOpacity = useTransform(progress, [0.65, 0.8], [0, 1]);

  const ctaOpacity = useTransform(progress, [0.7, 0.8], [0, 1]);
  const ctaY = useTransform(progress, [0.8, 0.9], [20, 0]);

  return (
    // AJOUT DE MARGE NÉGATIVE ICI (-mt) pour remonter la section sous le Hero
    <section
      ref={sectionRef}
      className="relative h-[400vh] bg-[#FDFBF9] -mt-[25vh] md:-mt-[35vh]"
    >
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden perspective-2000">
        <motion.div
          style={{ opacity: glowOpacity, scale: glowScale }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-orange-200/40 via-purple-200/20 to-blue-200/30 blur-[120px] rounded-full pointer-events-none"
        />

        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="text-center mb-14 relative z-20 px-4"
        >
          <h2 className="text-4xl lg:text-6xl font-medium text-neutral-900 tracking-tight">
            Du digital au{" "}
            <span className="text-orange-600 font-secondary text-5xl lg:text-7xl">
              papier .
            </span>
          </h2>
          <p className="text-lg text-neutral-500 mt-4 max-w-lg mx-auto">
            Vos recettes se transforment en un vrai carnet de recettes.
          </p>
        </motion.div>

        <div className="relative w-[320px] h-[420px] md:w-[380px] md:h-[500px]">
          {/* Floating cards */}
          {heroRecipeCards.map((card, idx) => (
            <FloatingHeroCard
              key={idx}
              card={card}
              index={idx}
              progress={progress}
            />
          ))}

          {/* THE BOOK */}
          <motion.div
            style={{
              opacity: bookOpacity,
              scale: bookScale,
              filter: bookBlurFilter,
            }}
            className="absolute inset-0 preserve-3d"
          >
            {/* Back pages */}
            <div className="absolute inset-0 bg-white rounded-r-2xl rounded-l-md shadow-2xl border-l-[12px] border-neutral-200 overflow-hidden">
              <div className="absolute top-0 bottom-0 right-0 left-0 border-r-[4px] border-b-[4px] border-neutral-100 bg-[#FAFAFA]" />
              <motion.div
                style={{ opacity: pageContentOpacity }}
                className="absolute inset-0 z-10 overflow-hidden bg-white"
              >
                <div className="w-[900px] h-[1270px] origin-top-left scale-[0.35] md:scale-[0.41]">
                  <RecipePrint recipe={MOCK_RECIPE} startIndex={1} />
                </div>
                <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
              </motion.div>
            </div>

            {/* Front cover */}
            <motion.div
              style={{ rotateY: coverRotate }}
              className="absolute inset-0 origin-left preserve-3d"
            >
              <div className="absolute inset-0 bg-[#FFF8E7] rounded-r-2xl rounded-l-md backface-hidden overflow-hidden border-l-[4px] border-[#E0D6C2] shadow-sm">
                <div className="relative w-full h-full">
                  <Image
                    src={CoverFront}
                    alt="Couverture Mon Carnet de Recettes"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-black/15 via-black/5 to-transparent z-10 pointer-events-none" />
                  <div
                    className="absolute inset-0 opacity-[0.15] mix-blend-multiply pointer-events-none z-10"
                    style={{
                      backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-black/5 z-20 pointer-events-none" />
                </div>
              </div>

              <div className="absolute inset-0 bg-white rounded-l-md rounded-r-2xl backface-hidden rotate-y-180 border-r-[12px] border-neutral-200 shadow-inner flex items-center justify-center">
                <div className="p-8 text-center opacity-60"></div>
                <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-neutral-200/50 to-transparent pointer-events-none" />
              </div>
            </motion.div>

            <motion.div
              style={{ opacity: shadowOpacity }}
              className="absolute -bottom-12 left-4 right-4 h-6 bg-black/20 blur-xl rounded-[100%]"
            />
          </motion.div>
        </div>

        <motion.div
          style={{ opacity: ctaOpacity, y: ctaY }}
          className="mt-16 z-30"
        >
          <Link
            href="/book-preview"
            className="bg-neutral-900 text-white px-8 py-4 rounded-full font-bold hover:bg-neutral-800 transition-colors flex items-center gap-2"
          >
            <Printer size={18} />
            Créer mon carnet
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function Home() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [navHidden, setNavHidden] = useState(false);
  const { scrollY } = useScroll();
  const scrollUpOrigin = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const isScrollingDown = latest > previous;

    if (isScrollingDown && latest > 100) {
      scrollUpOrigin.current = latest;
      setNavHidden(true);
    } else if (!isScrollingDown) {
      if (scrollUpOrigin.current - latest > 50) {
        setNavHidden(false);
      }
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] font-sans selection:bg-orange-200 selection:text-orange-900 overflow-x-clip">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap");
        .perspective-1000 {
          perspective: 1000px;
        }
        .perspective-2000 {
          perspective: 2000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .origin-left {
          transform-origin: left;
        }
      `}</style>

      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -100, opacity: 0, scale: 0.85 }}
        animate={
          navHidden
            ? { scale: 0.85, y: -80, opacity: 0 }
            : { scale: 1, y: 0, opacity: 1 }
        }
        transition={
          navHidden
            ? {
                scale: { duration: 0.2, ease: "easeIn" },
                y: { duration: 0.2, delay: 0.12, ease: "easeIn" },
                opacity: { duration: 0.15, delay: 0.12 },
              }
            : {
                y: { duration: 0.2, ease: "easeOut" },
                scale: { duration: 0.2, delay: 0.12, ease: "easeOut" },
                opacity: { duration: 0.15 },
              }
        }
        className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
      >
        <div className="bg-white/80 backdrop-blur-md border border-white/20 shadow-lg shadow-neutral-200/20 rounded-full px-6 py-3 flex items-center justify-between gap-8 md:gap-12">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="bg-orange-600 text-white p-1.5 rounded-lg"
            >
              <BookOpen size={18} strokeWidth={2.5} />
            </motion.div>
            <span className="font-bold text-neutral-900 tracking-tight hidden sm:block">
              MonCarnetDeRecettes.
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-full transition-colors"
            >
              Commencer
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* HERO SECTION */}
      {/* Modification : z-40 pour être au dessus des cartes qui vont remonter, et pb-0 pour réduire l'espace */}
      <main className="relative z-40 pt-40 pb-0 md:pt-48 px-6 max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
        >
          <motion.div
            // @ts-ignore
            variants={itemVariants}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-700 text-xs font-bold uppercase tracking-widest hover:bg-orange-100 transition-colors cursor-default">
              <Sparkles size={12} /> La nouvelle référence culinaire
            </span>
          </motion.div>

          <motion.h1
            // @ts-ignore
            variants={itemVariants}
            className="text-5xl md:text-7xl font-black text-neutral-900 tracking-tighter leading-[0.95] mb-8"
          >
            Vos recettes ne sont pas <br className="hidden md:block" />
            <span className="relative inline-block">juste des notes.</span>
          </motion.h1>

          <motion.p
            // @ts-ignore
            variants={itemVariants}
            className="text-lg md:text-2xl text-neutral-500 font-medium max-w-2xl mb-10 leading-relaxed"
          >
            Transformez vos brouillons et captures d'écran en un patrimoine
            culinaire digital, esthétique et éternel.
          </motion.p>
        </motion.div>
      </main>

      {/* HERO CARDS → BOOK TRANSITION */}
      <HeroCardsToBook />

      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <h2 className="text-5xl md:text-7xl font-medium text-neutral-900 tracking-tighter leading-[0.9]">
            Vos recettes, <br />
            <span className="text-orange-600 italic font-secondary text-5xl lg:text-7xl font-light">
              enfin bien organisées.
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {interactiveFeatures.map((feature, idx) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.id}
                className={cn(
                  "group relative p-8 rounded-[2.5rem] bg-white border border-neutral-100 transition-all duration-500 overflow-hidden min-h-[350px] flex flex-col",
                  getColSpan(idx),
                )}
              >
                {/* Header */}
                <div className="relative z-10 flex justify-between items-start mb-12">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-500">
                    <Icon size={24} />
                  </div>
                  <span className="text-4xl font-black text-neutral-100 group-hover:text-orange-100 transition-colors duration-500">
                    0{idx + 1}
                  </span>
                </div>

                {/* Contenu */}
                <div className="relative z-10 mt-auto max-w-xl">
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-500 leading-relaxed group-hover:text-neutral-600 transition-colors">
                    {feature.desc}
                  </p>
                </div>

                {/* Décoration */}
                <div className="absolute -bottom-4 -right-4 font-mono text-[100px] leading-none text-neutral-50/50 select-none group-hover:text-orange-50/30 transition-colors duration-500 pointer-events-none">
                  {"{ }"}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
      {/* FOOTER */}
      <footer className="border-t border-neutral-200 bg-white pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-8">
          <span className="font-black text-xl tracking-tight">
            MonCarnetDeRecettes.
          </span>
          <p className="text-neutral-500 text-sm font-medium">
            © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
