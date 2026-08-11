import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-gray-300 mt-16">
      <div className="h-1 bg-gradient-to-r from-primary-500 via-primary-400 to-secondary-500" />
      <div className="container-page py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h4 className="font-bold mb-3 text-lg">
            <span className="text-primary-400">Khalid&apos;s</span> <span className="text-secondary-400">Dreams</span>
          </h4>
          <p>বাংলাদেশের বিশ্বস্ত অনলাইন শপিং ডেস্টিনেশন।</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">কাস্টমার সাপোর্ট</h4>
          <ul className="space-y-2">
            <li><Link href="/orders/track" className="hover:text-secondary-400">অর্ডার ট্র্যাক করুন</Link></li>
            <li><Link href="/orders/my-orders" className="hover:text-secondary-400">আমার অর্ডার</Link></li>
            <li><Link href="/contact" className="hover:text-secondary-400">যোগাযোগ করুন</Link></li>
            <li><Link href="/faq" className="hover:text-secondary-400">সচরাচর জিজ্ঞাসা</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">নীতিমালা</h4>
          <ul className="space-y-2">
            <li><Link href="/policy/privacy" className="hover:text-secondary-400">প্রাইভেসি পলিসি</Link></li>
            <li><Link href="/policy/return" className="hover:text-secondary-400">রিটার্ন ও রিফান্ড নীতি</Link></li>
            <li><Link href="/policy/terms" className="hover:text-secondary-400">শর্তাবলী</Link></li>
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
