import { Opacity } from "@mui/icons-material"
import profilePic from "../assets/pic1.png"
import { HERO_CONTENT } from "../constants"
import { motion, stagger } from "framer-motion"
import { duration } from "@mui/material"

const containerVariants = {
    hidden: { 
      opacity: 0, 
      x: -100 
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.5
      }
    }
  };

const childVariants ={
    hidden: {opacity:0, x: -100},
    visible: {opacity:1, x:0, transition: {duration:0.5} }
}


const Hero = () => {
    return (
        <div className="pb-4 lg:mb-36">
            <div className="flex flex-wrap lg:flex-row-reverse">
                <div className="w-full lg:w-1/2">
                    <div className="flex justify-center lg:p-8">
                        <motion.img
                         src={profilePic}
                          alt="Tejash Tarun" 
                          className="border border-stone-900 rounded-3xl"
                          width={650}
                          height={650}
                          initial={{ x: 100, opacity: 0}}
                          animate={{x:0, opacity:1}}
                          transition={{duration:1, delay:1.3}}/>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="flex flex-col items-center lg:items-start mt-10">
                    <motion.h2 className="mb-2 text-4xl lg:text-8xl tracking-tighter">
          Tejash Tarun
        </motion.h2>
        <motion.span 
        variants={childVariants}
        className="bg-gradient-to-r from-stone-300 to-stone-600 
        bg-clip-text text-3xl tracking-tight text-transparent">
        Artificial Intelligence Engineer
        </motion.span>
        <motion.p 
        variants={childVariants}
        className="my-2 max-w-lg py-6 text-xl leading-relaxed tracking-tighter">
          I am a passionate AI Engineer with a strong foundation in developing efficient and scalable AI-driven applications. With 2 years of hands-on experience, I have honed my skills in back-end technologies like Flask and REST APIs, alongside proficiency in SQL for data management. My background in front-end development with HTML, CSS, JavaScript, and React allows me to create seamless and intuitive user interfaces. My goal is to leverage my expertise to build innovative, data-powered solutions that enhance business capabilities and deliver meaningful user experiences.
        </motion.p>
        <motion.a
          variants={childVariants}
          href="/Tejash-Tarun-Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          download
          className="bg-white rounded-full p-4 text-sm text-stone-800 mb-10"
        >
          Download Resume
        </motion.a>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Hero
