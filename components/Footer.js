import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-gray-300 mt-16">
      <div className="container-page py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h4 className="text-white font-bold mb-3">Khalid&apos;s Dreams</h4>
          <p>বাংলাদেশের বিশ্বস্ত অনলাইন শপিং ডেস্টিনেশন।</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">কাস্টমার সাপোর্ট</h4>
          <ul className="space-y-2">
            <li><Link href="/orders/track" className="hover:text-white">অর্ডার ট্র্যাক করুন</Link></li>
            <li><Link href="/contact" className="hover:text-white">যোগাযোগ করুন</Link></li>
            <li><Link href="/faq" className="hover:text-white">সচরাচর জিজ্ঞাসা</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">নীতিমালা</h4>
          <ul className="space-y-2">
            <li><Link href="/policy/privacy" className="hover:text-white">প্রাইভেসি পলিসি</Link></li>
            <li><Link href="/policy/return" className="hover:text-white">রিটার্ন ও রিফান্ড নীতি</Link></li>
            <li><Link href="/policy/terms" className="hover:text-white">শর্তাবলী</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">পেমেন্ট মেথড</h4>
          <p>💵 ক্যাশ অন ডেলিভারি &nbsp;|&nbsp; 📱 বিকাশ</p>
        </div>
      </div>
      <div className="border-t border-gray-700 py-4 text-center text-xs">
        © {new Date().getFullYear()} Khalid&apos;s Dreams. সর্বস্বত্ব সংরক্ষিত।
      </div>
    </footer>
  );
}
