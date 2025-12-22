import About from "../components/About";
import Hero from "../components/Hero";
import Slider from "../components/Slider";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function getLatestAds() {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("id", { ascending: false })
    .limit(10); // مثلا ۱۰ آگهی آخر

  if (error) {
    console.error("Supabase fetch error:", error.message);
    return [];
  }

  return data.map((ad) => ({
    ...ad,
    images: Array.isArray(ad.images) ? ad.images : [], // اطمینان از آرایه بودن تصاویر
  }));
}

export default async function Page() {
  const ads = await getLatestAds();

  return (
    <div>
      <Hero />
      <div className="w-full my-[150px] h-[350px] mobile:px-5 laptop:px-0 flex items-center justify-center">
        <div className="mobile:w-full laptop:w-[70%] h-full">
          <span className="text-2xl">آگهی های جدید</span>
          <Slider ads={ads} />
        </div>
      </div>
      <About />
    </div>
  );
}
