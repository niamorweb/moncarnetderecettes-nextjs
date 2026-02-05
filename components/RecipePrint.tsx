// ========================================================================
// ANCIEN CODE (commenté)
// ========================================================================
// "use client";

// import { Utensils, ChefHat, Timer, Users, Flame } from "lucide-react";
// import type { Recipe } from "@/types/models/recipe";

// interface RecipePrintProps {
//   recipe: Recipe | null;
//   startIndex: number; // Nouvelle prop
// }

// const colors = {
//   primary: "#f97316",
//   secondary: "#FFD600",
//   background: "#FFFBF0",
//   text: "#1A1A1A",
//   card: "#FFFFFF",
//   border: "#1A1A1A",
// };

// const PAGE_WIDTH = "559px";
// const PAGE_HEIGHT = "794px";

// export default function RecipePrint({ recipe, startIndex }: RecipePrintProps) {
//   if (!recipe) return null;

//   return (
//     <div className="book-spread flex shadow-2xl transition-all duration-200 ease-out">
//       {/* === PAGE GAUCHE : TEXTE === */}
//       <div
//         style={{
//           width: PAGE_WIDTH,
//           height: PAGE_HEIGHT,
//           padding: "40px",
//           backgroundColor: colors.background,
//           color: colors.text,
//           borderRight: "1px solid #e5e5e5",
//           position: "relative",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         <header className="mb-8 border-b-2 border-black pb-4">
//           <span className="inline-block bg-[#FFD600] px-3 py-1 text-xs font-black border-2 border-black shadow-[2px_2px_0px_black] uppercase mb-2">
//             {recipe.category?.name || "Recette"}
//           </span>
//           <h1
//             style={{
//               fontFamily: "Georgia, serif",
//               fontSize: "36px",
//               lineHeight: "1.1",
//               fontWeight: "900",
//               margin: "10px 0",
//             }}
//           >
//             {recipe.name}
//           </h1>

//           <div className="flex gap-3 mt-4">
//             <div className="badge">
//               <Timer size={14} /> {recipe.prep_time} min
//             </div>
//             <div className="badge">
//               <Users size={14} /> {recipe.servings} pers.
//             </div>
//           </div>
//         </header>

//         <div className="flex gap-6 h-full overflow-hidden">
//           <aside
//             style={{
//               width: "35%",
//               borderRight: "2px dashed #ccc",
//               paddingRight: "15px",
//             }}
//           >
//             <h3 className="flex items-center gap-2 font-black text-lg mb-4 uppercase">
//               <Utensils size={18} /> Ingrédients
//             </h3>
//             <ul className="space-y-3 text-sm font-serif leading-tight">
//               {recipe.ingredients.map((ing, i) => (
//                 <li key={i} className="flex items-start gap-2">
//                   <span className="mt-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0" />
//                   <span>{ing}</span>
//                 </li>
//               ))}
//             </ul>
//           </aside>

//           <main className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
//             <h3 className="flex items-center gap-2 font-black text-lg mb-4 uppercase">
//               <ChefHat size={18} /> Préparation
//             </h3>
//             <div className="space-y-4">
//               {recipe.steps.map((step, i) => (
//                 <div key={i} className="relative pl-6">
//                   <span className="absolute left-0 top-0 font-black text-orange-500 text-lg font-sans">
//                     {i + 1}.
//                   </span>
//                   <p className="text-sm font-serif leading-relaxed text-gray-800 text-justify">
//                     {step}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </main>
//         </div>

//         {/* Footer Page Gauche (Pagination) */}
//         <div className="absolute bottom-6 left-10 right-10 flex justify-between items-center pt-4 border-t border-gray-300">
//           <span className="text-xs text-gray-400 font-mono">
//             Mon Carnet de Recettes
//           </span>
//           <span className="text-sm font-bold font-mono text-gray-600">
//             {startIndex}
//           </span>
//         </div>

//         {/* Ombre pliure */}
//         <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-black/5 pointer-events-none" />
//       </div>

//       {/* === PAGE DROITE : IMAGE === */}
//       <div
//         style={{
//           width: PAGE_WIDTH,
//           height: PAGE_HEIGHT,
//           backgroundColor: colors.card,
//           position: "relative",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           overflow: "hidden",
//         }}
//       >
//         <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-l from-transparent to-black/10 z-10 pointer-events-none" />

//         {recipe.image_url ? (
//           <img
//             src={recipe.image_url}
//             alt={recipe.name}
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <div className="flex flex-col items-center justify-center text-gray-300">
//             <Utensils size={48} className="mb-4 opacity-20" />
//             <p className="font-serif italic opacity-50">Aucune illustration</p>
//           </div>
//         )}

//         {/* Footer Page Droite (Pagination) */}
//         <div className="absolute bottom-6 right-10 z-20 bg-white/80 px-2 py-1 rounded backdrop-blur-sm">
//           <span className="text-sm font-bold font-mono text-gray-800">
//             {startIndex + 1}
//           </span>
//         </div>
//       </div>

//       <style jsx global>{`
//         .badge {
//           display: flex;
//           align-items: center;
//           gap: 5px;
//           font-size: 11px;
//           font-weight: 700;
//           background: #fff;
//           border: 1.5px solid #1a1a1a;
//           padding: 4px 8px;
//           border-radius: 6px;
//         }
//         .book-spread::before {
//           content: "";
//           position: absolute;
//           inset: 0;
//           background-image: url("https://www.transparenttextures.com/patterns/natural-paper.png");
//           opacity: 0.3;
//           pointer-events: none;
//           z-index: 20;
//         }
//         /* Scrollbar fine pour le texte */
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 4px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: transparent;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #ddd;
//           border-radius: 4px;
//         }
//       `}</style>
//     </div>
//   );
// }

// ========================================================================
// NOUVEAU CODE
// ========================================================================
import type { Recipe } from "@/types/models/recipe";

interface RecipePrintProps {
  recipe: Recipe | null;
  startIndex: number;
}

const PAGE_WIDTH = 900;
const PAGE_HEIGHT = 1270;

export default function RecipePrint({ recipe, startIndex }: RecipePrintProps) {
  if (!recipe) return null;

  return (
    <div
      style={{
        width: `${PAGE_WIDTH}px`,
        maxWidth: `${PAGE_WIDTH}px`,
        backgroundColor: "#ffffff",
        padding: "48px",
        boxShadow:
          "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
        color: "#1a1a1a",
        fontFamily: '"Playfair Display", serif',
        position: "relative",
        minHeight: `${PAGE_HEIGHT}px`,
      }}
    >
      {/* --- HEADER --- */}
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
              />
            </svg>
            <span>
              {recipe.servings} {recipe.servings > 1 ? "personnes" : "personne"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <span>{recipe.prep_time} minutes</span>
          </div>
        </div>
      </header>

      {/* --- IMAGE + INGREDIENTS CARD --- */}
      <div className="relative w-full mb-8">
        <div
          className="w-full overflow-hidden"
          style={{ height: "450px", borderRadius: "50px" }}
        >
          {recipe.image_url ? (
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
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontStyle: "italic",
                  color: "#9ca3af",
                  fontSize: "18px",
                }}
              >
                Aucune illustration
              </span>
            </div>
          )}
        </div>

        {/* Ingredients card overlapping image */}
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

      {/* --- DIRECTIONS + NOTES --- */}
      <div className="flex" style={{ fontFamily: '"Playfair Display", serif' }}>
        {/* Directions - left column */}
        <div
          style={{ width: "58.33%", paddingRight: "32px", paddingTop: "16px" }}
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

        {/* Notes - right column */}
        {/* <div
          style={{
            width: "41.67%",
            paddingLeft: "16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              marginTop: "360px",
              border: "1px solid #9ca3af",
              padding: "24px",
            }}
          >
            <h3
              style={{
                fontWeight: 700,
                fontSize: "18px",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              NOTES
            </h3>
            <p
              style={{
                color: "#1f2937",
                fontSize: "17px",
                lineHeight: "1.625",
                fontStyle: "italic",
                opacity: 0.5,
              }}
            >
              Ajoutez vos notes ici...
            </p>
          </div>
        </div> */}
      </div>

      {/* --- FOOTER --- */}
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
