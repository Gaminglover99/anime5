import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-[#1E1E1E] mt-12 pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="text-red-500">Anime</span><span className="text-white">Kingdom</span>
            </h3>
            <p className="text-[#BBBBBB] mb-4">
              Your gateway to the world of anime. Stream thousands of episodes from your favorite series, all in one place.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[#BBBBBB] hover:text-[#6C5CE7]">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-[#BBBBBB] hover:text-[#6C5CE7]">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-[#BBBBBB] hover:text-[#6C5CE7]">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-[#BBBBBB] hover:text-[#6C5CE7]">
                <i className="fab fa-discord text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-[#BBBBBB] hover:text-[#6C5CE7] transition">Home</Link>
              </li>
              <li>
                <Link href="/anime" className="text-[#BBBBBB] hover:text-[#6C5CE7] transition">Browse Anime</Link>
              </li>
              <li>
                <Link href="/movies" className="text-[#BBBBBB] hover:text-[#6C5CE7] transition">Movies</Link>
              </li>
              <li>
                <Link href="/new-releases" className="text-[#BBBBBB] hover:text-[#6C5CE7] transition">New Releases</Link>
              </li>
              <li>
                <Link href="/my-list" className="text-[#BBBBBB] hover:text-[#6C5CE7] transition">My List</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Help & Info</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-[#BBBBBB] hover:text-[#6C5CE7] transition">About Us</Link>
              </li>
              <li>
                <Link href="/pricing" className="text-[#BBBBBB] hover:text-[#6C5CE7] transition">Pricing Plans</Link>
              </li>
              <li>
                <Link href="/faq" className="text-[#BBBBBB] hover:text-[#6C5CE7] transition">FAQ</Link>
              </li>
              <li>
                <Link href="/terms" className="text-[#BBBBBB] hover:text-[#6C5CE7] transition">Terms of Service</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-[#BBBBBB] hover:text-[#6C5CE7] transition">Privacy Policy</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <i className="fas fa-envelope mt-1 mr-3 text-[#BBBBBB]"></i>
                <span className="text-[#BBBBBB]">support@animekingdom.com</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-phone mt-1 mr-3 text-[#BBBBBB]"></i>
                <span className="text-[#BBBBBB]">+1 (800) 123-4567</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-[#BBBBBB]"></i>
                <span className="text-[#BBBBBB]">123 Anime Street, Tokyo, Japan</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#BBBBBB] text-sm">&copy; 2025 Anime Kingdom. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/terms" className="text-[#BBBBBB] hover:text-[#6C5CE7] transition text-sm">Terms</Link>
            <Link href="/privacy" className="text-[#BBBBBB] hover:text-[#6C5CE7] transition text-sm">Privacy</Link>
            <Link href="/cookies" className="text-[#BBBBBB] hover:text-[#6C5CE7] transition text-sm">Cookies</Link>
            <Link href="/licenses" className="text-[#BBBBBB] hover:text-[#6C5CE7] transition text-sm">Licenses</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
