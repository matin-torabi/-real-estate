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
      <div className="w-full my-10 h-[350px] mobile:px-5 laptop:px-0 flex items-center justify-center">
        <div className="mobile:w-full laptop:w-[70%] h-full">
          <Slider ads={ads}/>
        </div>
      </div>
    </div>
  );
}
