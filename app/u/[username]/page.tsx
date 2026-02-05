"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Timer,
  Search,
  XCircle,
  ChevronRight,
  ChefHat,
  MapPin,
  Link as LinkIcon,
} from "lucide-react";

import {
  IconInstagram,
  IconTikTok,
  IconYouTube,
  IconPinterest,
  IconThreads,
  IconFacebook,
  IconX,
  IconTwitch,
} from "@/components/icons/SocialIcons";


interface Category {
  id: string;
  name: string;
}

interface Recipe {
  id: string;
  name?: string;
  title?: string;
  image_url?: string | null;
  prep_time?: number;
  cook_time?: number;
  category?: Category | null;
}

interface PageData {
  profile: {
    name?: string;
    bio?: string;
    avatar_url?: string | null;
    location?: string | null;
    website?: string | null;
    instagram?: string | null;
    tiktok?: string | null;
    youtube?: string | null;
    pinterest?: string | null;
    threads?: string | null;
    facebook?: string | null;
    twitter?: string | null;
    twitch?: string | null;
  };
  recipes: Recipe[];
  categories: Category[];
}

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();

  const [pageData, setPageData] = useState<PageData | null>(null);
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("pending");

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  /* -------------------------------------------------------------------------- */
  /*                                   FETCH                                    */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setStatus("pending");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/profiles/public/${username}`,
          { cache: "no-store" },
        );

        if (!res.ok) throw new Error("404");

        const data = await res.json();
        if (!data) throw new Error("404");

        setPageData(data);
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };

    fetchProfile();
  }, [username]);

  if (status === "error") {
    notFound();
  }

  /* -------------------------------------------------------------------------- */
  /*                                  COMPUTED                                  */
  /* -------------------------------------------------------------------------- */

  const displayName = pageData?.profile?.name || username;

  const avatarUrl =
    pageData?.profile?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName,
    )}&background=fff7ed&color=ea580c&size=128`;

  const filteredRecipes = useMemo(() => {
    if (!pageData?.recipes) return [];

    let result = pageData.recipes;

    if (selectedCategory) {
      result = result.filter(
        (r) => r.category && r.category.id === selectedCategory,
      );
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((r) =>
        (r.title || r.name || "").toLowerCase().includes(q),
      );
    }

    return result;
  }, [pageData, selectedCategory, searchQuery]);

  function SocialIcon({
    href,
    icon,
    hoverClass,
  }: {
    href: string;
    icon: React.ReactNode;
    hoverClass: string;
  }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`p-2.5 rounded-full bg-slate-50 text-slate-400 border border-slate-100 transition-all duration-300 ${hoverClass} `}
      >
        {icon}
      </a>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12 selection:bg-orange-100 selection:text-orange-900">
      <main className="w-full mx-auto md:max-w-7xl md:px-8">
        {/* LOADING */}
        {status === "pending" && (
          <div className="p-6 animate-pulse flex flex-col md:flex-row gap-12 pt-20 max-w-md md:max-w-none mx-auto">
            <div className="md:w-1/3 flex flex-col items-center md:items-start">
              <div className="w-32 h-32 bg-slate-200 rounded-full mb-6" />
              <div className="h-8 w-48 bg-slate-200 rounded mb-4" />
              <div className="h-4 w-full bg-slate-200 rounded mb-2" />
            </div>
            <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-40 bg-slate-200 rounded-2xl" />
              ))}
            </div>
          </div>
        )}

        {/* CONTENT */}
        {status === "success" && pageData && (
          <div className="flex flex-col md:grid md:grid-cols-12 md:gap-12 lg:gap-20 pt-6 md:pt-16">
            {/* ASIDE */}
            <aside className="md:col-span-5 lg:col-span-4 px-6 md:px-0 max-w-md mx-auto md:mx-0 text-left">
              <div className="md:sticky flex flex-col md:top-10">
                <div className="relative mb-6 inline-block">
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-sm"
                  />
                </div>

                <h1 className="text-3xl md:text-5xl font-black mb-2">
                  {displayName}
                </h1>

                <p className="text-orange-600 font-medium mb-6">@{username}</p>

                <p className="text-slate-600 leading-relaxed mb-6">
                  {pageData.profile?.bio ||
                    "Bienvenue dans mon carnet de recettes personnel."}
                </p>

                <div className="flex flex-col gap-2 text-sm text-slate-500 items-start">
                  {pageData.profile.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4" />
                      {pageData.profile.location}
                    </div>
                  )}
                  {pageData.profile.website && (
                    <Link
                      href={pageData.profile.website!}
                      className="flex items-center gap-2 hover:text-orange-600 transition"
                    >
                      <LinkIcon className="size-4" />
                      {pageData.profile.website}
                    </Link>
                  )}
                  <div className="mt-4 flex flex-wrap gap-3 justify-start">
                    {pageData.profile.instagram && (
                      <SocialIcon
                        href={`https://instagram.com/${pageData.profile.instagram.replace("@", "")}`}
                        icon={<IconInstagram className="size-5" />}
                        hoverClass="hover:bg-pink-50 hover:text-pink-600"
                      />
                    )}
                    {pageData.profile.tiktok && (
                      <SocialIcon
                        href={`https://tiktok.com/@${pageData.profile.tiktok.replace("@", "")}`}
                        icon={<IconTikTok className="size-5" />}
                        hoverClass="hover:bg-zinc-100 hover:text-black"
                      />
                    )}
                    {pageData.profile.youtube && (
                      <SocialIcon
                        href={
                          pageData.profile.youtube.startsWith("http")
                            ? pageData.profile.youtube
                            : `https://youtube.com/${pageData.profile.youtube}`
                        }
                        icon={<IconYouTube className="size-5" />}
                        hoverClass="hover:bg-red-50 hover:text-red-600"
                      />
                    )}
                    {pageData.profile.pinterest && (
                      <SocialIcon
                        href={`https://pinterest.com/${pageData.profile.pinterest}`}
                        icon={<IconPinterest className="size-5" />}
                        hoverClass="hover:bg-red-50 hover:text-red-500"
                      />
                    )}
                    {pageData.profile.threads && (
                      <SocialIcon
                        href={`https://threads.net/@${pageData.profile.threads.replace("@", "")}`}
                        icon={<IconThreads className="size-5" />}
                        hoverClass="hover:bg-zinc-100 hover:text-black"
                      />
                    )}
                    {pageData.profile.facebook && (
                      <SocialIcon
                        href={
                          pageData.profile.facebook.startsWith("http")
                            ? pageData.profile.facebook
                            : `https://facebook.com/${pageData.profile.facebook}`
                        }
                        icon={<IconFacebook className="size-5" />}
                        hoverClass="hover:bg-blue-50 hover:text-blue-700"
                      />
                    )}
                    {pageData.profile.twitter && (
                      <SocialIcon
                        href={
                          pageData.profile.twitter.startsWith("http")
                            ? pageData.profile.twitter
                            : `https://x.com/${pageData.profile.twitter}`
                        }
                        icon={<IconX className="size-5" />}
                        hoverClass="hover:bg-zinc-100 hover:text-black"
                      />
                    )}
                    {pageData.profile.twitch && (
                      <SocialIcon
                        href={
                          pageData.profile.twitch.startsWith("http")
                            ? pageData.profile.twitch
                            : `https://twitch.tv/${pageData.profile.twitch}`
                        }
                        icon={<IconTwitch className="size-5" />}
                        hoverClass="hover:bg-purple-50 hover:text-purple-600"
                      />
                    )}
                  </div>
                </div>
              </div>
            </aside>

            {/* RECIPES */}
            <div className="md:col-span-7 lg:col-span-8 px-4 md:px-0 mt-8 md:mt-0">
              {/* SEARCH */}
              <div className="sticky top-0 bg-slate-50/95 backdrop-blur py-4 mb-6 z-30">
                <div className="bg-white border border-neutral-200 rounded-2xl p-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher une recette..."
                      className="w-full pl-9 pr-9 py-2.5 text-sm font-bold bg-transparent focus:outline-none"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"
                      >
                        <XCircle className="size-4" />
                      </button>
                    )}
                  </div>

                  {pageData.categories?.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pt-2 mt-2 border-t border-neutral-200">
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-3 rounded-full py-1.5 text-xs font-bold border border-neutral-200 ${
                          !selectedCategory
                            ? "bg-slate-900 text-white"
                            : "bg-slate-50 text-slate-500"
                        }`}
                      >
                        Tout
                      </button>

                      {pageData.categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() =>
                            setSelectedCategory(
                              selectedCategory === cat.id ? null : cat.id,
                            )
                          }
                          className={`px-3 py-1.5 text-xs font-bold rounded-full border border-neutral-200 whitespace-nowrap ${
                            selectedCategory === cat.id
                              ? "bg-slate-900 text-white"
                              : " text-slate-500"
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* COUNT */}
              <p className="text-xs font-bold text-slate-400 uppercase mb-4">
                {filteredRecipes.length} recette
                {filteredRecipes.length > 1 ? "s" : ""}
              </p>

              {/* LIST */}
              <div className="grid gap-4">
                {filteredRecipes.map((recipe) => (
                  <Link
                    key={recipe.id}
                    href={`/u/${username}/recipe/${recipe.id}`}
                    className="group flex gap-3 p-3 bg-white border border-neutral-200 rounded-[1.5rem] hover:border-orange-200 transition"
                  >
                    <div className="w-24 h-24 rounded-xl bg-slate-100 overflow-hidden">
                      {recipe.image_url ? (
                        <Image
                          src={recipe.image_url}
                          alt=""
                          width={96}
                          height={96}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-300">
                          <ChefHat className="size-8" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {recipe.category && (
                        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-md">
                          {recipe.category.name}
                        </span>
                      )}

                      <h3 className="font-bold text-sm md:text-lg line-clamp-2 mt-1">
                        {recipe.title || recipe.name}
                      </h3>

                      <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                        <Timer className="size-3.5" />
                        {(recipe.prep_time || 0) + (recipe.cook_time || 0)} min
                      </div>
                    </div>

                    <ChevronRight className="md:hidden self-center text-slate-300" />
                  </Link>
                ))}
              </div>

              {/* EMPTY */}
              {filteredRecipes.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-neutral-300 mt-12">
                  <Search className="size-6 mx-auto text-slate-400 mb-3" />
                  <p className="font-medium">Aucune recette trouvée</p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory(null);
                    }}
                    className="mt-4 text-sm bg-orange-50 text-orange-600 px-4 py-2 rounded-full font-bold"
                  >
                    Réinitialiser
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
