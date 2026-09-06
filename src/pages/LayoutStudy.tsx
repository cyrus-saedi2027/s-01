import { Phone, Clock, ArrowLeft } from "lucide-react";
import { FramedMediaSection } from "@/components/sections/FramedMediaSection";
import { BleedMediaSection } from "@/components/sections/BleedMediaSection";
import clinicRoom from "@/assets/demo/clinic-room.jpg";
import dentistScanner from "@/assets/demo/dentist-scanner.jpg";

const RULES = [
  {
    title: "لبه‌ها باید هم‌تراز تمام شوند",
    body: "در بخش «تماس یا فرم»، عکس حدود ۱۳۰ پیکسل پایین‌تر از متن تمام می‌شود و زیر متن یک حفره‌ی خالی می‌ماند. یا هر دو ستون تا ته ردیف کشیده شوند، یا ارتفاع عکس را متن تعیین کند.",
  },
  {
    title: "قاب عکس نسبت ثابت داشته باشد، نه ابعاد فایل",
    body: "ارتفاع کادر را با aspect-ratio بده و عکس را با object-fit: cover داخلش بنشان. اگر ابعاد فایل تصمیم بگیرد، با هر عکس جدید چیدمان به‌هم می‌ریزد.",
  },
  {
    title: "عرض خط متن را ببند",
    body: "پاراگرافِ هر دو بخش تمام عرض ستون را می‌گیرد. چشم برای برگشتن به ابتدای خط بعدی سطر را گم می‌کند. ۶۰ تا ۷۰ حرف در هر خط، یعنی max-width حدود ۴۸ کاراکتر برای فارسی.",
  },
  {
    title: "عکس و متن یک لنگر مشترک بخواهند",
    body: "دو شیء شناور با فاصله‌های مستقل، همیشه آماتور به نظر می‌رسند. یا در یک قاب مشترک بنشینند، یا روی یک خط هم‌ترازی مشترک قفل شوند. دو حالت پایین دقیقاً همین دو راه‌حل‌اند.",
  },
];

export default function LayoutStudy() {
  return (
    <main dir="rtl" className="theme-dental min-h-screen bg-background font-vazir text-foreground">
      <header className="mx-auto max-w-6xl px-6 pb-10 pt-16 sm:px-10">
        <p className="text-xs font-medium tracking-[0.16em] text-primary">چیدمان عکس کنار متن</p>
        <h1 className="mt-4 text-pretty text-4xl font-black leading-tight sm:text-5xl">
          دو حالت، برای دو کار متفاوت
        </h1>
        <p className="mt-5 max-w-[52ch] text-[0.9375rem] leading-[2.1] text-muted-foreground">
          مشکل هر دو بخشی که فرستادی یکی است: عکس و متن دو شیء جدا هستند که کنار هم رها
          شده‌اند. راه‌حل، بزرگ‌تر کردن عکس یا کم‌کردن متن نیست — دادنِ یک هندسه‌ی مشترک
          به آن دو است.
        </p>
      </header>

      {/* Diagnosis */}
      <section className="mx-auto max-w-6xl px-6 pb-16 sm:px-10">
        <div className="grid gap-10 rounded-3xl border border-border bg-card p-6 sm:p-10 lg:grid-cols-[1fr_20rem]">
          <ol className="grid gap-7 sm:grid-cols-2">
            {RULES.map((rule, i) => (
              <li key={rule.title}>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-xs font-bold tabular-nums text-primary">
                    {["۰۱", "۰۲", "۰۳", "۰۴"][i]}
                  </span>
                  <h3 className="text-[0.9375rem] font-bold leading-snug">{rule.title}</h3>
                </div>
                <p className="mt-2.5 text-[0.8125rem] leading-[2] text-muted-foreground">
                  {rule.body}
                </p>
              </li>
            ))}
          </ol>

          {/* The ragged-edge problem, drawn rather than described */}
          <figure className="flex flex-col gap-4 rounded-2xl bg-muted p-5">
            <figcaption className="text-[0.8125rem] font-bold">
              همان قانون ۰۱، به‌صورت تصویری
            </figcaption>

            <div className="space-y-1.5">
              <p className="text-[0.6875rem] font-medium text-primary">الان</p>
              <div className="flex h-24 items-start gap-2">
                <div className="h-full w-1/2 rounded-md bg-foreground/25" />
                <div className="flex w-1/2 flex-col gap-1.5 pt-1">
                  <span className="h-1.5 w-full rounded-full bg-foreground/20" />
                  <span className="h-1.5 w-11/12 rounded-full bg-foreground/20" />
                  <span className="h-1.5 w-8/12 rounded-full bg-foreground/20" />
                </div>
              </div>
              <p className="text-[0.6875rem] leading-relaxed text-muted-foreground">
                نصف سمت راست زودتر تمام می‌شود و پایینش خالی می‌ماند.
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-[0.6875rem] font-medium text-primary">درست</p>
              <div className="flex h-24 items-stretch gap-2">
                <div className="w-1/2 rounded-md bg-primary/25" />
                <div className="flex w-1/2 flex-col justify-center gap-1.5">
                  <span className="h-1.5 w-full rounded-full bg-foreground/20" />
                  <span className="h-1.5 w-11/12 rounded-full bg-foreground/20" />
                  <span className="h-1.5 w-8/12 rounded-full bg-foreground/20" />
                </div>
              </div>
              <p className="text-[0.6875rem] leading-relaxed text-muted-foreground">
                عکس تا ته ردیف کشیده می‌شود و متن در همان ارتفاع وسط می‌نشیند.
              </p>
            </div>
          </figure>
        </div>
      </section>

      {/* Treatment 1 */}
      <section className="mx-auto max-w-6xl px-6 pb-20 sm:px-10">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-4">
          <h2 className="text-xl font-bold">
            <span className="text-primary">حالت ۱ —</span> قاب مشترک
          </h2>
          <p className="text-[0.8125rem] text-muted-foreground">
            برای بخش‌های میانی صفحه · آرام و جمع‌وجور
          </p>
        </div>

        <FramedMediaSection
          eyebrow="۰۱ / ۰۴"
          title="تماس یا فرم"
          body="زنگ می‌زنید یا فرم را پر می‌کنید. منشی تماس می‌گیرد و وقت را با هم می‌گذاریم — تقویم آنلاین نداریم، چون نمی‌خواهیم ساعتی به شما بدهیم که مطمئن نیستیم."
          image={dentistScanner}
          imageAlt="دندان‌پزشک در حال معاینه‌ی بیمار با اسکنر داخل‌دهانی"
        >
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#request"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-dark"
            >
              درخواست نوبت
              <ArrowLeft className="h-4 w-4" />
            </a>
            <a
              href="tel:+981154611560"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-medium tabular-nums transition-colors hover:bg-muted"
            >
              <Phone className="h-4 w-4 text-primary" />
              ۰۱۱ ۵۴۶۱ ۱۵۶۰
            </a>
          </div>
        </FramedMediaSection>

        <p className="mt-5 max-w-[62ch] text-[0.8125rem] leading-[2] text-muted-foreground">
          <span className="font-bold text-foreground">چه چیزی را حل می‌کند:</span> قاب،
          ارتفاع را تعیین می‌کند، پس عکس هرچقدر هم بلند باشد دقیقاً همان‌جا تمام می‌شود که
          متن. فاصله‌ی عکس تا لبه‌ی قاب یک عدد واحد است و در هر چهار طرف یکسان می‌ماند.
        </p>
      </section>

      {/* Treatment 2 */}
      <section className="pb-20">
        <div className="mx-auto mb-6 flex max-w-6xl flex-wrap items-baseline justify-between gap-3 border-b border-border px-6 pb-4 sm:px-10">
          <h2 className="text-xl font-bold">
            <span className="text-primary">حالت ۲ —</span> تقسیم تا لبه
          </h2>
          <p className="text-[0.8125rem] text-muted-foreground">
            برای هدر یا شروع صفحه · پرحضور و ادیتوریال
          </p>
        </div>

        <BleedMediaSection
          eyebrow="درمانگاه ساسان · دندان‌پزشکی"
          title={
            <>
              دندان‌پزشکی در
              <br />
              سلمان‌شهر و متل قو
            </>
          }
          body="نُه خدمت فعال، از ترمیم یک دندان تا ایمپلنت و طراحی لبخند. هر کدام صفحه‌ی کامل خودش را دارد: چند جلسه است، چقدر طول می‌کشد و بعدش چه مراقبتی لازم دارد."
          image={clinicRoom}
          imageAlt="اتاق درمان دندان‌پزشکی با یونیت و پنجره‌ی رو به باغ"
          caption="تصویر موقت"
        >
          <div className="flex flex-col gap-5">
            <p className="flex items-center gap-2.5 text-sm font-medium">
              <Clock className="h-4 w-4 shrink-0 text-white/70" />
              شنبه، یک‌شنبه، دوشنبه و پنج‌شنبه — ۱۰ صبح تا ۸ شب
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#request"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-dark"
              >
                درخواست نوبت
                <ArrowLeft className="h-4 w-4" />
              </a>
              <a
                href="tel:+981154611560"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-border px-6 text-sm font-medium tabular-nums transition-colors hover:bg-white/10"
              >
                <Phone className="h-4 w-4" />
                ۰۱۱ ۵۴۶۱ ۱۵۶۰
              </a>
            </div>
          </div>
        </BleedMediaSection>

        <div className="mx-auto mt-5 max-w-6xl px-6 sm:px-10">
          <p className="max-w-[62ch] text-[0.8125rem] leading-[2] text-muted-foreground">
            <span className="font-bold text-foreground">چه چیزی را حل می‌کند:</span> اینجا
            اصلاً قابی وجود ندارد — خودِ مرزِ سکشن نقش قاب را بازی می‌کند. عکس تا بالا،
            پایین و لبه‌ی بیرونی می‌رود، پس هیچ فاصله‌ی نامساوی‌ای باقی نمی‌ماند که چشم را
            اذیت کند. در مقایسه با هدر فعلی‌ات، عکس دیگر یک مستطیل شناور وسط صفحه نیست.
          </p>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 pb-20 sm:px-10">
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
          <h2 className="text-lg font-bold">کدام را کجا</h2>
          <p className="mt-3 max-w-[58ch] text-[0.875rem] leading-[2.1] text-muted-foreground">
            <span className="font-bold text-foreground">تقسیم تا لبه</span> را فقط یک بار در
            هر صفحه استفاده کن، آنجا که می‌خواهی بیشترین حضور را داشته باشی — یعنی هدر.
            بقیه‌ی بخش‌ها را با <span className="font-bold text-foreground">قاب مشترک</span>{" "}
            بساز. اگر هر دو بخش پرحضور باشند، هیچ‌کدام پرحضور نیست و صفحه شلوغ می‌شود.
          </p>
        </div>
      </footer>
    </main>
  );
}
