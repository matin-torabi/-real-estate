// مدیریت احراز هویت ادمین
export class AuthService {
  private static readonly TOKEN_KEY = 'admin_auth';
  private static readonly PASSWORD = 'admin123'; // رمز عبور اصلی

  // بررسی آیا کاربر لاگین کرده یا نه
  static isAuthenticated(): boolean {
    // حتماً بررسی کنید که در مرورگر هستیم
    if (typeof window === 'undefined') return false;
    
    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      console.log('🔍 AuthService - بررسی توکن:', {
        tokenKey: this.TOKEN_KEY,
        tokenValue: token,
        isAuthenticated: token === 'true' // تغییر این خط
      });
      return token === 'true'; // این خط مهم است!
    } catch (error) {
      console.error('❌ خطا در بررسی احراز هویت:', error);
      return false;
    }
  }

  // لاگین کردن
  static login(password: string): boolean {
    console.log('🔑 تلاش برای ورود با رمز:', password);
    
    if (password === this.PASSWORD) {
      try {
        // ذخیره توکن در localStorage
        localStorage.setItem(this.TOKEN_KEY, 'true');
        
        // همچنین در کوکی هم ذخیره کنید برای middleware
        if (typeof document !== 'undefined') {
          document.cookie = `admin_auth=true; path=/; max-age=${24 * 60 * 60}`; // 24 ساعت
        }
        
        console.log('✅ ورود موفق - توکن ذخیره شد');
        return true;
      } catch (error) {
        console.error('❌ خطا در ذخیره توکن:', error);
        return false;
      }
    }
    
    console.log('❌ رمز عبور اشتباه');
    return false;
  }

  // لاگاوت کردن
  static logout(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      
      // حذف کوکی
      if (typeof document !== 'undefined') {
        document.cookie = 'admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
      
      console.log('✅ خروج موفق - توکن حذف شد');
    } catch (error) {
      console.error('❌ خطا در حذف توکن:', error);
    }
  }

  // گرفتن وضعیت فعلی (برای دیباگ)
  static getStatus(): any {
    if (typeof window === 'undefined') return { available: false };
    
    return {
      available: true,
      token: localStorage.getItem(this.TOKEN_KEY),
      password: this.PASSWORD,
      isAuthenticated: this.isAuthenticated()
    };
  }
}