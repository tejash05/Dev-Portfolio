import { useState } from "react";
import { FaGithub, FaInstagram, FaLinkedin, FaBars, FaTimes } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import logo from "../assets/Logo.png";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Tech", href: "#technologies" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Research", href: "#research" },
  { label: "Achievements", href: "#achievements" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-20 -mx-8 mb-4 border-b border-white/5 bg-black/60 px-8 backdrop-blur-md">
      <div className="flex items-center justify-between py-4">
        <div className="flex flex-shrink-0 items-center">
          <a href="#home" aria-label="Home">
            <img src={logo} className="mx-2" width={60} height={45} alt="logo" />
          </a>
        </div>

        <div className="hidden items-center gap-6 text-sm font-medium text-stone-300 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center justify-center gap-4 text-2xl lg:flex">
          <a
            href="https://www.linkedin.com/in/tejashtarunofficial/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://github.com/tejash05"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.instagram.com/_yashdeol_?igsh=bWlsa3ByOHEzanVu"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="https://x.com/TejashTaru6167"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <FaSquareXTwitter />
          </a>
        </div>

        <button
          type="button"
          className="text-2xl text-stone-300 lg:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-4 border-t border-white/5 py-4 lg:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-stone-300 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center gap-4 pt-2 text-2xl text-stone-300">
            <a
              href="https://www.linkedin.com/in/tejashtarunofficial/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://github.com/tejash05"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.instagram.com/_yashdeol_?igsh=bWlsa3ByOHEzanVu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://x.com/TejashTaru6167"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaSquareXTwitter />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
