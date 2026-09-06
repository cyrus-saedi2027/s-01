import { ArrowLeft, Phone } from "lucide-react";
import { ArchSeated } from "@/components/arch/ArchSeated";
import { ArchBreakout } from "@/components/arch/ArchBreakout";
import { ArchNested } from "@/components/arch/ArchNested";
import { ArchWindow } from "@/components/arch/ArchWindow";
import { ArchPair } from "@/components/arch/ArchPair";
import smile from "@/assets/demo/smile.jpg";
import chair from "@/assets/demo/chair.jpg";
import aligners from "@/assets/demo/aligners.jpg";
import clinicRoom from "@/assets/demo/clinic-room.jpg";
import dentistScanner from "@/assets/demo/dentist-scanner.jpg";

function Cta({ onDark = false }: { onDark?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href="#request"
        className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
      >
        درخواست نوبت
        <ArrowLeft className="h-4 w-4" />
      </a>
      <a
        href="tel:+981154611560"
        className={`inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-medium tabular-nums transition-colors ${
          onDark ? "border-border hover:bg-white/10" : "border-border hover:bg-muted"
        }`}
      >
        <Phone className="h-4 w-4" />
        ۰۱۱ ۵۴۶۱ ۱۵۶۰
      </a>
    </div>
  );
}

function Marker({ n, name, note }: { n: string; name: string; note: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-baseline gap-x-5 gap-y-2">
      <span className="text-[2.75rem] font-black leading-none tabular-nums text-primary">{n}</span>
      <h2 className="text-2xl font-black">{name}</h2>
      <p className="text-[0.8125rem] font-light text-muted-foreground">{note}</p>
    </div>
  );
}

export default function ArchVariants() {
  return (
    <main dir="rtl" className="theme-dental min-h-screen bg-background font-vazir text-foreground">
      <header className="mx-auto max-w-6xl px-6 pb-16 pt-20 sm:px-10">
        <p className="text-xs font-medium tracking-[0.16em] text-primary">
          درمانگاه ساسان · پنج نسخه از طاق
        </p>
        <h1 className="mt-5 max-w-[15ch] text-pretty text-5xl font-black leading-[1.15] sm:text-6xl">
          کادر مستطیل،
          <span className="text-primary"> طاق </span>
          منحنی
        </h1>
        <p className="mt-6 max-w-[48ch] text-base font-light leading-[2.1] text-muted-foreground">
          هر پنج حالت داخل یک کادر مستطیلی با گوشه‌های تیز نشسته‌اند. تنها منحنیِ
          ترکیب‌بندی خودِ طاق است — همین تضاد است که شکل را دیده می‌کند. فرق‌شان در
          نسبتِ طاق با کادر است: نشسته روی کف آن، بیرون‌زده از آن، یا بریده در دلِ آن.
        </p>
      </header>

      <div className="mx-auto max-w-6xl space-y-24 px-6 pb-28 sm:px-10">
        <section>
          <Marker n="۰۱" name="طاق نشسته" note="آرام و پایدار · صفحه‌ی خدمات" />
          <ArchSeated
            eyebrow="خدمات · طراحی لبخند"
            title="لبخندی که اندازه‌ی صورت شماست"
            body="قبل از هر تراشی، طرح روی عکس و مدل دیجیتال بسته می‌شود. شکل و رنگ را با هم می‌بینید و تأیید می‌کنید؛ کار روی دندان بعد از آن شروع می‌شود."
            image={smile}
            imageAlt="لبخند بیمار پس از درمان طراحی لبخند"
          >
            <Cta />
          </ArchSeated>
          <p className="mt-4 max-w-[58ch] text-[0.8125rem] font-light leading-[2] text-muted-foreground">
            طاق از کفِ خودِ کادر بلند می‌شود و متن هم روی همان خط می‌نشیند. هیچ‌چیز شناور
            نیست — پایدارترین حالت از این پنج تا.
          </p>
        </section>

        <section>
          <Marker n="۰۲" name="طاق بیرون‌زده" note="پرانرژی · هدر یا معرفی" />
          <div className="pt-24">
            <ArchBreakout
              eyebrow="درمانگاه ساسان · سلمان‌شهر و متل قو"
              title="نُه خدمت، هر کدام صفحه‌ی خودش"
              body="از ترمیم یک دندان تا ایمپلنت. در هر صفحه نوشته‌ایم چند جلسه است، چقدر طول می‌کشد و بعدش چه مراقبتی لازم دارد — پیش از آنکه بپرسید."
              image={dentistScanner}
              imageAlt="دندان‌پزشک در حال معاینه‌ی بیمار با اسکنر داخل‌دهانی"
            >
              <Cta onDark />
            </ArchBreakout>
          </div>
          <p className="mt-4 max-w-[58ch] text-[0.8125rem] font-light leading-[2] text-muted-foreground">
            طاق از لبه‌ی بالای کادر بیرون می‌زند و نیمی از آن روی کاغذ می‌ماند. همین
            عبور از مرز، بدون هیچ سایه‌ای عمق می‌سازد.
          </p>
        </section>

        <section>
          <Marker n="۰۳" name="طاق‌نمای تودرتو" note="پرجزئیات · صفحه‌ی درباره‌ی ما" />
          <ArchNested
            eyebrow="خدمات · ایمپلنت"
            title="ایمپلنت، جلسه به جلسه"
            body="کاشت پایه در یک جلسه انجام می‌شود؛ بعد سه تا شش ماه فرصت می‌دهیم استخوان با پایه یکی شود. تاج نهایی جلسه‌ی آخر بسته می‌شود و از همان روز مثل دندان خودتان کار می‌کند."
            image={clinicRoom}
            imageAlt="اتاق درمان دندان‌پزشکی با پنجره‌ی رو به باغ"
          >
            <Cta onDark />
          </ArchNested>
          <p className="mt-4 max-w-[58ch] text-[0.8125rem] font-light leading-[2] text-muted-foreground">
            سه طاقِ خط‌نازک پشت عکس تکرار می‌شوند و کادر، بیرونی‌ترین‌ها را می‌بُرد — همین
            بریدگی است که آن‌ها را به یک سری ادامه‌دار تبدیل می‌کند، نه سه حلقه‌ی تزئینی.
          </p>
        </section>

        <section>
          <Marker n="۰۴" name="پنجره در دیوار" note="آرام و مصالح‌محور · معرفی مطب" />
          <ArchWindow
            eyebrow="خدمات · ارتودنسی نامرئی"
            title="ارتودنسی بدون سیم"
            body="پلاک‌های شفاف را خودتان در می‌آورید؛ برای غذا خوردن و مسواک زدن محدودیتی ندارید. هر دو هفته یک پلاک تازه و هر شش هفته یک ویزیت کوتاه."
            image={aligners}
            imageAlt="پلاک‌های شفاف ارتودنسی همراه با جعبه‌ی نگهداری"
          >
            <Cta />
          </ArchWindow>
          <p className="mt-4 max-w-[58ch] text-[0.8125rem] font-light leading-[2] text-muted-foreground">
            اینجا کادر یک دیوار است و طاق، سوراخی که در آن بریده شده. سایه‌ی داخلی و خطِ
            زیر طاق به بریدگی ضخامت می‌دهند، انگار عکس را از پشت دیوار می‌بینید.
          </p>
        </section>

        <section>
          <Marker n="۰۵" name="دو طاق" note="ریتم‌دار · گالری و تماس" />
          <ArchPair
            eyebrow="۰۱ / ۰۴"
            title="تماس یا فرم"
            body="زنگ می‌زنید یا فرم را پر می‌کنید. منشی تماس می‌گیرد و وقت را با هم می‌گذاریم — تقویم آنلاین نداریم، چون نمی‌خواهیم ساعتی به شما بدهیم که مطمئن نیستیم."
            images={[
              { src: chair, alt: "یونیت دندان‌پزشکی در اتاق درمان روشن" },
              { src: smile, alt: "لبخند بیمار پس از درمان" },
            ]}
          >
            <Cta />
          </ArchPair>
          <p className="mt-4 max-w-[58ch] text-[0.8125rem] font-light leading-[2] text-muted-foreground">
            دو طاق با عرض نابرابر روی یک کف مشترک. نابرابری عمدی است — دو طاقِ هم‌اندازه
            قرینه می‌شوند و قرینه، ریتم ندارد.
          </p>
        </section>
      </div>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:px-10">
          <p className="max-w-[52ch] text-[0.9375rem] font-light leading-[2.1] text-muted-foreground">
            شماره‌ی هر کدام را که پسندیدی بگو. اگر فرمش درست است ولی جزئیاتش نه — ضخامت
            خط، عمق طاق، رنگ کادر — همان را بگو تا رویش کار کنیم.
          </p>
        </div>
      </footer>
    </main>
  );
}
