import { Link } from "react-router-dom";
import { Instagram, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    support: [
      { name: "Contact Us", href: "/contact" },
      { name: "Shipping & Delivery", href: "/shipping" },
      { name: "Returns & Exchanges", href: "/returns" },
      { name: "Size Guide", href: "/size-guide" },
      { name: "Track Your Order", href: "/track" },
      { name: "FAQs", href: "/faqs" },
    ],
    about: [
      { name: "About THE ELEGANT", href: "/about" },
    ],
    more: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms & Conditions", href: "/terms" },
    ],
  };

  const socialLinks = [
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://www.instagram.com/the_elegant_for_mens?igsh=N2Vnd3RjZ3dkOHc3",
    },
  ];

  return (
    <footer className="bg-black text-white mt-auto no-print">
      {/* Newsletter Section */}
      <div className="bg-neutral-900 border-b border-neutral-800">
        <div className="container-custom py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white text-black rounded-full mb-6">
              <Mail size={28} />
            </div>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-black mb-4 tracking-tight">
              STAY UP TO DATE
            </h3>
            <p className="text-neutral-400 mb-8 text-sm md:text-base max-w-2xl mx-auto">
              Sign up for email updates on the latest THE ELEGANT products,
              stories and events
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 bg-black border-2 border-neutral-700 rounded-lg focus:outline-none focus:border-white text-white placeholder-neutral-500 transition-colors"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-neutral-200 transition-all transform hover:scale-105 active:scale-95 uppercase tracking-wider text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Support */}
          <div>
            <h4 className="font-black text-sm uppercase tracking-wider mb-6">
              SUPPORT
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-neutral-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-black text-sm uppercase tracking-wider mb-6">
              ABOUT
            </h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-neutral-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black text-sm uppercase tracking-wider mb-6">
              MORE
            </h4>
            <ul className="space-y-3">
              {footerLinks.more.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-neutral-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-black text-sm uppercase tracking-wider mb-6">
              CONTACT
            </h4>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li className="flex items-start gap-3">
                <Phone size={16} className="mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold mb-1">
                    Customer Service
                  </p>
                  <p>8125632327</p>
                  <p className="text-xs mt-1">Mon-Sat: 9AM-9PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold mb-1">
                    Email Us
                  </p>
                  <p>theelegant2327@gmail.com</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-neutral-500 mb-4 text-center md:text-left">
                FOLLOW US
              </p>
              <div className="flex items-center space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="w-10 h-10 bg-neutral-800 hover:bg-white text-white hover:text-black rounded-full flex items-center justify-center transition-all transform hover:scale-110"
                      aria-label={social.name}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
              <div className="flex items-center gap-2">
                <MapPin size={14} />
                <span>Tirupathi</span>
              </div>
              <div className="text-center md:text-right">
                <p>
                  &copy; {new Date().getFullYear()} THE ELEGANT. All Rights
                  Reserved.
                </p>
                <p className="mt-1">THE ELEGANT Tirupathi | Forever Faster</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
