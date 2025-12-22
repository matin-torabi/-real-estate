import { FaInstagram, FaTelegram, FaWhatsapp } from "react-icons/fa6";
import Location from "./Location";
import Link from "next/link";

function Footer() {
  return (
    <>
      <footer className="w-full flex justify-center p-10" dir="rtl">
        <div className="max-w-7xl mx-auto mobile:flex-col flex tablet:flex-row mobile:w-full laptop:w-[70%] justify-between mobile:gap-10 tablet:gap-0">
          <div>
            <h3 className="text-xl font-bold mb-3">آدرس</h3>
            <p className="text-sm leading-7">
              قرچک، کمربندی شمالی، باهنر بیست و پنجم، قرچک <br />
              طبقه دوم، واحد ۵
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-3">تماس با ما</h3>
            <p className="text-sm leading-7">
              تلفن: 021-12345678
              <br />
              موبایل: 0912-0000000
              <br />
              ایمیل: info@example.com
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-3">شبکه های مجازی</h3>
            <div className="flex items-center gap-5 mt-5">
              <Link href="">
                <FaTelegram className="text-3xl text-gray-600 hover:text-blue-400 duration-300" />
              </Link>
              <Link href="">
                <FaWhatsapp className="text-3xl text-gray-600 hover:text-green-400 duration-300" />
              </Link>
              <Link href="">
                <FaInstagram className="text-3xl text-gray-600 hover:text-red-500 duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
