import { ArrowLeft, Phone } from "lucide-react";
import { ArchMedia } from "@/components/media/ArchMedia";
import { OrganicMedia } from "@/components/media/OrganicMedia";
import { CircleFlowMedia } from "@/components/media/CircleFlowMedia";
import { CrestMedia } from "@/components/media/CrestMedia";
import { CollageMedia } from "@/components/media/CollageMedia";
import smile from "@/assets/demo/smile.jpg";
import chair from "@/assets/demo/chair.jpg";
import aligners from "@/assets/demo/aligners.jpg";
import clinicRoom from "@/assets/demo/clinic-room.jpg";
import dentistScanner from "@/assets/demo/dentist-scanner.jpg";

function Cta({ tone = "solid" }: { tone?: "solid" | "quiet" }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href="#request"
        className={
          tone === "solid"
            ? "inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-dark"
            : "inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
        }
      >
        درخواست نوبت
        <ArrowLeft className="h-4 w-4" />
      </a>
      <a
        href="tel:+981154611560"
        className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-medium tabular-nums transition-colors hover:bg-muted"
      >
        <Phone className="h-4 w-4" />
        ۰۱۱ ۵۴۶۱ ۱۵۶۰
      </a>
    </div>
  );
}

function Marker({ n, name, note }: { n: string; name: string; note: string }) {
  return (
    <div className="mx-auto mb-10 flex max-w-6xl flex-wrap items-baseline gap-x-5 gap-y-2 px-6 sm:px-10">
      <span className="text-[2.75rem] font-black leading-none tabular-nums text-primary">{n}</span>
      <h2 className="text-2xl font-black">{name}</h2>
      <p className="text-[0.8125rem] font-light text-muted-foreground">{note}</p>
    </div>
  );
}

export default function LayoutGallery() {
  return (
    <main dir="rtl" className="theme-dental min-h-screen bg-background font-vazir text-foreground">
      <header className="mx-auto max-w-6xl px-6 pb-20 pt-20 sm:px-10">
        <p className="text-xs font-medium tracking-[0.16em] text-primary">
          درمانگاه ساسان · پنج پیشنهاد
        </p>
        <h1 className="mt-5 max-w-[14ch] text-pretty text-5xl font-black leading-[1.15] sm:text-6xl">
          عکس، لازم نیست
          <span className="text-primary"> مستطیل </span>
          باشد
        </h1>
        <p className="mt-6 max-w-[46ch] text-base font-light leading-[2.1] text-muted-foreground">
          پنج فرم متفاوت برای کنارِ هم نشستنِ عکس و متن — از طاق و منحنی تا کلاژ. هر کدام
          با محتوای واقعی یکی از خدمات شما ساخته شده. شماره‌ی هر کدام را که پسندیدی بگو.
        </p>
      </header>

      {/* 01 */}
      <section className="pb-24">
        <Marker n="۰۱" name="طاق" note="آرام، باوقار · برای صفحه‌ی خدمات" />
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <ArchMedia
            eyebrow="خدمات · طراحی لبخند"
            title="لبخندی که اندازه‌ی صورت شماست"
            body="قبل از هر تراشی، طرح روی عکس و مدل دیجیتال بسته می‌شود. شکل و رنگ را با هم می‌بینید و تأیید می‌کنید؛ کار روی دندان بعد از آن شروع می‌شود."
            image={smile}
            imageAlt="لبخند بیمار پس از درمان طراحی لبخند"
          >
            <Cta />
          </ArchMedia>
        </div>
      </section>

      {/* 02 */}
      <section className="pb-24">
        <Marker n="۰۲" name="ارگانیک" note="نرم، صمیمی · برای بخش کودکان" />
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <OrganicMedia
            eyebrow="خدمات · دندان‌پزشکی کودکان"
            title="اولین جلسه، بدون درمان"
            body="جلسه‌ی اول فقط آشنایی است: بچه روی یونیت می‌نشیند، ابزارها را می‌بیند و بدون هیچ کاری بیرون می‌آید. درمان از جلسه‌ی دوم شروع می‌شود، وقتی دیگر جای ناشناخته‌ای نمانده."
            image={chair}
            imageAlt="یونیت دندان‌پزشکی در اتاق درمان روشن"
          >
            <Cta />
          </OrganicMedia>
        </div>
      </section>

      {/* 03 */}
      <section className="pb-24">
        <Marker n="۰۳" name="دایره و متن دورچین" note="ادیتوریال · برای مقاله و وبلاگ" />
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <CircleFlowMedia
            eyebrow="خدمات · ارتودنسی نامرئی"
            title="ارتودنسی بدون سیم"
            body="پلاک‌های شفاف را خودتان در می‌آورید؛ برای غذا خوردن و مسواک زدن هیچ محدودیتی ندارید. هر دو هفته یک پلاک تازه، و هر شش هفته یک ویزیت کوتاه برای بررسی مسیر. طول درمان بسته به فاصله‌ی دندان‌ها بین شش تا هجده ماه است و از جلسه‌ی اول می‌دانید کجای این مسیر ایستاده‌اید. اگر وسط کار پلاکی گم شد، همان شماره را بگیرید تا پلاک بعدی زودتر آماده شود."
            image={aligners}
            imageAlt="پلاک‌های شفاف ارتودنسی همراه با جعبه‌ی نگهداری"
          >
            <Cta />
          </CircleFlowMedia>
        </div>
      </section>

      {/* 04 */}
      <section className="pb-24">
        <Marker n="۰۴" name="تاج منحنی" note="پرحضور · برای هدر یا پایان صفحه" />
        <CrestMedia
          eyebrow="درمانگاه ساسان · سلمان‌شهر و متل قو"
          title="نُه خدمت، هر کدام صفحه‌ی خودش"
          body="از ترمیم یک دندان تا ایمپلنت. در هر صفحه نوشته‌ایم چند جلسه است، چقدر طول می‌کشد و بعدش چه مراقبتی لازم دارد — پیش از آنکه بپرسید."
          image={clinicRoom}
          imageAlt="اتاق درمان دندان‌پزشکی با پنجره‌ی رو به باغ"
        >
          <Cta tone="quiet" />
        </CrestMedia>
      </section>

      {/* 05 */}
      <section className="pb-28 pt-24">
        <Marker n="۰۵" name="کلاژ" note="پویا، نامتقارن · برای «درباره‌ی ما» و تماس" />
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <CollageMedia
            eyebrow="۰۱ / ۰۴"
            title="تماس یا فرم"
            body="زنگ می‌زنید یا فرم را پر می‌کنید. منشی تماس می‌گیرد و وقت را با هم می‌گذاریم — تقویم آنلاین نداریم، چون نمی‌خواهیم ساعتی به شما بدهیم که مطمئن نیستیم."
            image={dentistScanner}
            imageAlt="دندان‌پزشک در حال معاینه‌ی بیمار با اسکنر داخل‌دهانی"
            inset={aligners}
            insetAlt="پلاک‌های شفاف ارتودنسی"
          >
            <Cta />
          </CollageMedia>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:px-10">
          <p className="max-w-[52ch] text-[0.9375rem] font-light leading-[2.1] text-muted-foreground">
            هیچ‌کدام قرار نیست همه‌جای سایت تکرار شود. یکی را برای هدر انتخاب کن، یکی را
            برای صفحه‌ی خدمات، و بقیه را کنار بگذار. اگر شماره‌ای را پسندیدی ولی رنگ یا
            عکسش را نه، همان را بگو تا رویش کار کنیم.
          </p>
        </div>
      </footer>
    </main>
  );
}
