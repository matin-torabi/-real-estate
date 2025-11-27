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
            <h3 className="text-xl font-bold mb-3">ساعات کاری</h3>
            <p className="text-sm leading-7">
              شنبه تا پنجشنبه: 9 صبح تا 6 عصر
              <br />
              جمعه‌ها: تعطیل
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
