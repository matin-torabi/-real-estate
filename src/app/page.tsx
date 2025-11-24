import Hero from "../components/Hero";
import Slider from "../components/Slider";

async function getLatestAds() {
  const res = await fetch("http://localhost:3000/api/ads", {
    cache: "no-store", // همیشه آخرین دیتا
  });
  return res.json();
}
export default async function Page() {
  const ads = await getLatestAds();

  // جدا کردن آگهی‌ها بر اساس نوع
  // const buyList = list.filter((p) => p.type === "buy");
  // const rentList = list.filter((p) => p.type === "rent");

  return (
    <div>
      <Hero />
      <div className="w-full my-10 h-[300px] flex items-center justify-center">
        <div className="w-[70%] h-full">
          <Slider/>
        </div>
      </div>
    </div>
  );
}
