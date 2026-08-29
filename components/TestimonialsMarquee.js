import Image from "next/image";

// Demo testimonials — replace with real customer reviews later (or better,
// pull approved reviews from the Review collection and feature the best ones).
// Avatars use DiceBear's free illustrated-avatar API (generated art, not
// real people) so there's no privacy/copyright concern with placeholder data.
const TESTIMONIALS = [
  { name: "রাফি আহমেদ", location: "ঢাকা", rating: 5, text: "প্রোডাক্টের কোয়ালিটি অসাধারণ, ডেলিভারিও খুব দ্রুত পেয়েছি। আবার অর্ডার করব ইনশাআল্লাহ।", seed: "Rafi" },
  { name: "সুমাইয়া ইসলাম", location: "চট্টগ্রাম", rating: 5, text: "কাস্টমার সার্ভিস অনেক হেল্পফুল, হোয়াটসঅ্যাপে দ্রুত রিপ্লাই দিয়েছে সব প্রশ্নের।", seed: "Sumaiya" },
  { name: "তানভীর হাসান", location: "সিলেট", rating: 4, text: "দাম অনুযায়ী প্রোডাক্ট কোয়ালিটি ভালো। প্যাকেজিং আরেকটু মজবুত হলে ভালো হতো।", seed: "Tanvir" },
  { name: "নুসরাত জাহান", location: "রাজশাহী", rating: 5, text: "প্রথমবার অনলাইনে অর্ডার করে ভয় পাচ্ছিলাম, কিন্তু এক্সপেরিয়েন্স খুবই ভালো ছিল!", seed: "Nusrat" },
  { name: "ইমরান খান", location: "খুলনা", rating: 5, text: "কম্বো অফার প্যাকটা দারুণ ভ্যালু ফর মানি। বন্ধুদের রেকমেন্ড করেছি।", seed: "Imran" },
  { name: "ফারজানা আক্তার", location: "বরিশাল", rating: 4, text: "ক্যাশ অন ডেলিভারি অপশন থাকায় নিশ্চিন্তে অর্ডার করতে পেরেছি।", seed: "Farzana" },
];

function TestimonialCard({ t }) {
  return (
    <div className="w-72 flex-shrink-0 card p-4 mx-2">
      <div className="flex items-center gap-3 mb-2">
        <div className="relative w-11 h-11 rounded-full overflow-hidden bg-primary-50 flex-shrink-0">
          <Image
            src={`https://api.dicebear.com/7.x/notionists/png?seed=${t.seed}`}
            alt={t.name}
            fill
            unoptimized
            className="object-cover"
            sizes="44px"
          />
        </div>
        <div>
          <p className="text-sm font-semibold">{t.name}</p>
          <p className="text-xs text-gray-400">{t.location}</p>
        </div>
      </div>
      <div className="text-yellow-500 text-xs mb-1.5">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</div>
      <p className="text-sm text-gray-600 line-clamp-4">{t.text}</p>
    </div>
  );
}

export default function TestimonialsMarquee() {
  // Duplicate the list so the CSS animation can loop seamlessly (translateX -50%)
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section>
      <h2 className="text-lg font-bold mb-4">💬 আমাদের কাস্টমাররা যা বলছেন</h2>
      <div className="overflow-hidden">
        <div className="flex marquee-track w-max">
          {doubled.map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
