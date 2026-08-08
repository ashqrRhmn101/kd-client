const FAQS = [
  { q: "ডেলিভারি কতদিনে হয়?", a: "ঢাকার ভেতরে ১-২ কার্যদিবস এবং ঢাকার বাইরে ৩-৫ কার্যদিবস সময় লাগে।" },
  { q: "পেমেন্ট কীভাবে করব?", a: "ক্যাশ অন ডেলিভারি অথবা বিকাশের মাধ্যমে পেমেন্ট করতে পারবেন।" },
  { q: "প্রোডাক্ট রিটার্ন করা যাবে কি?", a: "হ্যাঁ, ডেলিভারির ৩ দিনের মধ্যে অক্ষত প্রোডাক্ট রিটার্ন করা যাবে। বিস্তারিত রিটার্ন পলিসি পেজে দেখুন।" },
  { q: "অর্ডার ট্র্যাক কীভাবে করব?", a: "ফুটার/হেডারে থাকা 'অর্ডার ট্র্যাক' লিংকে গিয়ে আপনার অর্ডার নাম্বার দিন।" },
];

export default function FaqPage() {
  return (
    <div className="container-page py-10 max-w-2xl">
      <h1 className="text-xl font-bold mb-6">সচরাচর জিজ্ঞাসা</h1>
      <div className="space-y-4">
        {FAQS.map((f, i) => (
          <div key={i} className="card p-4">
            <h3 className="font-semibold mb-1">{f.q}</h3>
            <p className="text-sm text-gray-600">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
