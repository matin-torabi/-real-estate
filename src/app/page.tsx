import Hero from "../components/Hero";
import Slider from "../components/Slider";

async function getLatestAds() {
  const res = await fetch("http://localhost:3000/api/ads", {
    cache: "no-store", 
  });
  return res.json();
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
    </div>
  );
}
