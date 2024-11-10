import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa"
import logo from "../assets/Logo.png"
import { FaSquareXTwitter } from "react-icons/fa6"
const Navbar = () => {
  return (
    <nav className="flex items-center justify-between py-6">
        <div className="flex flex-shrink-0 items-center">
            <a href="/"aria-label="Home">
                <img src={logo} className="mx-2" width={70} height={50}
                alt="logo"/>
            </a>

        </div>
        <div className="mx-8 flex items-center justify-center gap-4 text-2xl">
            <a href="https://www.linkedin.com/in/tejashtarunofficial/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn">
                    <FaLinkedin />
            </a>
            <a href="https://github.com/tejash05"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub">
                    <FaGithub />
            </a>
            <a href="https://www.instagram.com/_yashdeol_?igsh=bWlsa3ByOHEzanVu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram">
                    <FaInstagram />
            </a>
            <a href="https://x.com/TejashTaru6167"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter">
                    <FaSquareXTwitter />
            </a>
        </div>
    </nav>
)
}

export default Navbar