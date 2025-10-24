import React from 'react';
import { UploadCloud, Bot, PlaySquare, CheckSquare, ShieldCheck, UserCheck, Clock, BookOpen, BrainCircuit, Users, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Renamed to 'Home' to match the component in your prompt
const Section = ({ children, className, ...props }) => (
  // Removed default horizontal padding, will apply within max-w container
  <section className={`relative w-full py-16 md:py-24 overflow-hidden ${className || ''}`} {...props}>
    {/* Added padding here */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  </section>
);

// --- Reusable Title Component ---
// MODIFIED: Wrapped title in motion.div to animate all titles
const SectionTitle = ({ children }) => (
  <motion.div
    className="mb-12 md:mb-16 text-center"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
  >
    <h2 className="inline-block text-3xl md:text-4xl font-bold text-[#178a2d] border-2 border-dashed border-[#178a2d] rounded-full px-6 py-3">
      {children}
    </h2>
  </motion.div>
);

export default function Home() {

  // --- MODIFIED: Added Animation Variants ---
  // Simple fade-in from bottom
  const fadeInFromBottom = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeInOut' },
    viewport: { once: true },
  };

  // Stagger container for grids
  const staggerContainer = {
    whileInView: {
      transition: {
        staggerChildren: 0.1, // Each child animates 0.1s after the previous
      },
    },
    viewport: { once: true },
  };

  // Stagger item
  const itemFadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
    // viewport will be inherited from parent
  };
  // --- End of Animation Variants ---


  return (
    <>
      {/* Font definitions remain the same */}
      <style>{`
        /* devanagari */
        @font-face {
          font-family: 'Poppins';
          font-style: normal;
          font-weight: 400;
          font-display: block;
          src: url(https://design.penpot.app/internal/gfonts/font/poppins/v24/pxiEyp8kv8JHgFVrJJbecmNE.woff2)
            format('woff2');
          unicode-range: U+0900-097F, U+1CD0-1CF9, U+200C-200D, U+20A8, U+20B9,
            U+20F0, U+25CC, U+A830-A839, U+A8E0-A8FF, U+11B00-11B09;
        }
        /* latin-ext */
        @font-face {
          font-family: 'Poppins';
          font-style: normal;
          font-weight: 400;
          font-display: block;
          src: url(https://design.penpot.app/internal/gfonts/font/poppins/v24/pxiEyp8kv8JHgFVrJJnecmNE.woff2)
            format('woff2');
          unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7,
            U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F,
            U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F,
            U+A720-A7FF;
        }
        /* latin */
        @font-face {
          font-family: 'Poppins';
          font-style: normal;
          font-weight: 400;
          font-display: block;
          src: url(https://design.penpot.app/internal/gfonts/font/poppins/v24/pxiEyp8kv8JHgFVrJJfecg.woff2)
            format('woff2');
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
            U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122,
            U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
        }

        /* latin-ext */
        @font-face {
          font-family: 'Bebas Neue';
          font-style: normal;
          font-weight: 400;
          font-display: block;
          src: url(https://design.penpot.app/internal/gfonts/font/bebasneue/v16/JTUSjIg69CK48gW7PXoo9Wdhyzbi.woff2)
            format('woff2');
          unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7,
            U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F,
            U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F,
            U+A720-A7FF;
        }
        /* latin */
        @font-face {
          font-family: 'Bebas Neue';
          font-style: normal;
          font-weight: 400;
          font-display: block;
          src: url(https://design.penpot.app/internal/gfonts/font/bebasneue/v16/JTUSjIg69CK48gW7PXoo9Wlhyw.woff2)
            format('woff2');
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
            U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122,
            U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
        }
      `}</style>

      <div className="relative min-h-screen w-full font-['Poppins'] overflow-hidden bg-gray-50">
        {/* Decorative Blurred Blobs (positioned relative to the main container) */}
        <div className="absolute -left-32 -top-32 w-96 h-96 md:w-[473px] md:h-[453px] bg-[#7bb486b4] rounded-full blur-[83px] opacity-70 z-0"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 md:w-[473px] md:h-[453px] bg-[#7bb48691] rounded-full blur-[83px] opacity-70 z-0"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 md:w-[473px] md:h-[453px] bg-[#7bb48691] rounded-full blur-[83px] opacity-70 z-0"></div>

        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Navigation Bar */}
          <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
              {/* Simplified the 3-line logo for responsiveness */}
              <div className="flex flex-col gap-1">
                <span className="w-6 h-0.5 bg-[#2d9a42] rounded-full"></span>
                <span className="w-6 h-0.5 bg-[#2d9a42] rounded-full"></span>
                <span className="w-6 h-0.5 bg-[#2d9a42] rounded-full"></span>
              </div>
              <span className="text-2xl font-bold text-[#2d9a42] font-['Poppins']">
                KU-Connect
              </span>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <Link
                to="/signup"
                className="px-4 py-1.5 md:px-6 md:py-2 text-[14px] md:text-lg text-white font-medium bg-gradient-to-b from-[#2d9a42] to-[#39bd53] rounded-full shadow-md hover:opacity-90 transition-opacity"
              >
                SignUp
              </Link>
              <Link
                to="/login"
                className="px-4 py-1.5 md:px-6 md:py-2 text-[14px] md:text-lg text-[#2d9a42] font-medium rounded-full hover:bg-gray-100 transition-colors"
              >
                Login
              </Link>
            </div>
          </nav>

          {/* Hero Content */}
          <main className="flex-grow flex items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

              {/* MODIFIED: Wrapped Hero Column 1 in motion.div */}
              <motion.div
                className="w-full max-w-120 lg:ml-12 mx-auto lg:mx-0"
                {...fadeInFromBottom} // Apply animation
              >
                <img
                  src="/assets/Group.png"
                  alt="KU Connect Banner"
                  className="w-full h-auto "
                />
              </motion.div>

              {/* MODIFIED: Wrapped Hero Column 2 in motion.div with a delay */}
              <motion.div
                className="w-full"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeInOut' }} // Added delay
                viewport={{ once: true }}
              >
                <div
                  className="w-full h-[460px]  xl:h-[640px] bg-cover bg-center rounded-2xl"
                  style={{
                    backgroundImage:
                      "url('/assets/connect-hero-img.png')",
                  }}
                >
                  {/* Image is applied via background, no content needed here */}
                </div>
              </motion.div>
            </div>
          </main>
        </div>

        {/* --- REVISED AGAIN: About Us Section --- */}
        <section className="relative z-10 w-full pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
          {/* Decorative dashed lines - Adjusted positioning */}
          <svg
            className="absolute top-[5%] left-[10%] w-24 h-auto text-[#178a2d] opacity-50 hidden lg:block" /* Adjusted position */
            fill="none" viewBox="0 0 79 613" xmlns="http://www.w3.org/2000/svg">
            <path d="M43.785 8C43.785 8 -48.2749 131.62 --3.72083 238.672C50.8331 345.724 105.387 529.241 -10.54 621" stroke="currentColor" strokeWidth="7" strokeDasharray="17 17" />
          </svg>
          <svg
            className="absolute bottom-[5%] right-[10%] w-72 h-auto text-[#178a2d] opacity-50 hidden lg:block" /* Adjusted position */
            fill="none" viewBox="0 0 673 395" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 378C17 378 75 226 334 205C435.172 196.797 511.625 161.128 567.232 120.703C653.98 57.6389 690 -18 690 -18" stroke="currentColor" strokeWidth="7" strokeDasharray="17 17" />
          </svg>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 lg:items-stretch">

            {/* MODIFIED: Wrapped About Us Column 1 (Text) in motion.div */}
            <motion.div
              className="bg-[#178a2d] rounded-tl-[0px] rounded-bl-[0px] rounded-tr-[30px] rounded-br-[30px] p-8 md:p-12 lg:p-14 shadow-xl order-last lg:order-first h-full flex flex-col justify-center"
              {...fadeInFromBottom}
            >
              <p className="text-white  text-lg lg:text-2xl leading-relaxed text-left font-['Poppins']"> {/* Slightly smaller text */}
                KU Connect is a student-driven platform designed to simplify your university journey. Access shared study resources, explore past quizzes, stay updated on deadlines, and collaborate with peers – all in one place. Whether you're preparing for exams or sharing your own notes, KU Connect makes academic life easier, more organized, and more connected.
              </p>
            </motion.div>

            {/* MODIFIED: Wrapped About Us Column 2 (Image) in motion.div */}
            <motion.div
              className="relative w-full h-56 sm:h-72 md:h-80 lg:h-[450px] flex items-center justify-center order-first lg:order-last"
              {...fadeInFromBottom}
            >
              {/* Main image */}
              <img
                src="/assets/question-mark.png"
                alt="Question Mark"
                className="relative z-10 w-40 h-44 sm:w-48 sm:h-52 md:w-56 md:h-60 lg:w-[280px] lg:h-[300px] object-contain" /* Adjusted size */
              />
              {/* Blurred image 1 (Top Left) */}
              <img
                src="/assets/question-mark.png"
                alt="Blurred Question Mark"
                className="absolute z-0 w-32 h-36 sm:w-40 sm:h-44 md:w-48 md:h-52 lg:w-56 lg:h-60 object-contain blur-md opacity-60 top-[5%] left-[20%] transform -rotate-[15deg]" /* Adjusted position/rotation */

              />
              {/* Blurred image 2 (Bottom Right) */}
              <img
                src="/assets/question-mark.png"
                alt="Blurred Question Mark"
                className="absolute z-0 w-32 h-36 sm:w-40 sm:h-44 md:w-48 md:h-52 lg:w-56 lg:h-60 object-contain blur-lg opacity-50 bottom-[5%] right-[20%] transform rotate-[15deg]" /* Adjusted position/rotation */
              />
            </motion.div>
          </div>
        </section>
        {/* --- End of About Us Section --- */}

        {/* --- Features Overview Section --- */}
        <Section>
          <SectionTitle>Features Overview</SectionTitle>
          {/* MODIFIED: Added stagger container to the grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            {...staggerContainer} // Apply stagger
          >
            {/* MODIFIED: Wrapped each card in motion.div */}
            <motion.div
              className="bg-gradient-to-br from-[#25a83e] to-[#1a8a2e] p-6 rounded-2xl text-white text-center flex flex-col items-center shadow-lg hover:shadow-emerald-300/50 transition-shadow duration-300"
              variants={itemFadeIn} // Use item variant
            >
              <UploadCloud size={48} className="mb-3" />
              <h3 className="text-xl font-semibold mb-2">Upload And Share</h3>
              <p className="text-sm opacity-90">Easily upload notes, past papers, and other study materials.</p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-[#25a83e] to-[#1a8a2e] p-6 rounded-2xl text-white text-center flex flex-col items-center shadow-lg hover:shadow-emerald-300/50 transition-shadow duration-300"
              variants={itemFadeIn}
            >
              <Bot size={48} className="mb-3" />
              <h3 className="text-xl font-semibold mb-2">AI Chatbot For Study</h3>
              <p className="text-sm opacity-90">Get instant help and explanations on various topics.</p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-[#25a83e] to-[#1a8a2e] p-6 rounded-2xl text-white text-center flex flex-col items-center shadow-lg hover:shadow-emerald-300/50 transition-shadow duration-300"
              variants={itemFadeIn}
            >
              <PlaySquare size={48} className="mb-3" />
              <h3 className="text-xl font-semibold mb-2">Video Lectures</h3>
              <p className="text-sm opacity-90">Access recorded lectures and supplementary videos.</p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-[#25a83e] to-[#1a8a2e] p-6 rounded-2xl text-white text-center flex flex-col items-center shadow-lg hover:shadow-emerald-300/50 transition-shadow duration-300"
              variants={itemFadeIn}
            >
              <CheckSquare size={48} className="mb-3" />
              <h3 className="text-xl font-semibold mb-2">Test Yourself (Quiz)</h3>
              <p className="text-sm opacity-90">Practice with quizzes covering various course materials.</p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-[#25a83e] to-[#1a8a2e] p-6 rounded-2xl text-white text-center flex flex-col items-center shadow-lg hover:shadow-emerald-300/50 transition-shadow duration-300"
              variants={itemFadeIn}
            >
              <ShieldCheck size={48} className="mb-3" />
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-sm opacity-90">Your data and contributions are kept secure.</p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-[#25a83e] to-[#1a8a2e] p-6 rounded-2xl text-white text-center flex flex-col items-center shadow-lg hover:shadow-emerald-300/50 transition-shadow duration-300"
              variants={itemFadeIn}
            >
              <UserCheck size={48} className="mb-3" />
              <h3 className="text-xl font-semibold mb-2">Admin Approved</h3>
              <p className="text-sm opacity-90">Content is verified for quality and relevance.</p>
            </motion.div>
          </motion.div>
        </Section>
        {/* --- End of Features Section --- */}

        {/* --- How It Works Section --- */}
        <Section className="bg-emerald-50/50">
          <SectionTitle>How It Works</SectionTitle>
          {/* MODIFIED: Added stagger container to the grid */}
          <motion.div
            className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 lg:gap-y-0"
            {...staggerContainer}
          >
            {/* MODIFIED: Wrapped each step in motion.div */}
            <motion.div className="text-center relative px-4" variants={itemFadeIn}>
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-[#178a2d] text-white rounded-full font-bold text-xl">1</div>
              <h3 className="text-xl font-semibold mb-2 text-[#178a2d]">Signup</h3>
              <p className="text-gray-600">Create your secure account in minutes.</p>
              <div className="connector-line mt-4 lg:hidden"></div>
              <div className="connector-curve curve-1-2 hidden lg:block"></div>
            </motion.div>

            <motion.div className="text-center relative px-4" variants={itemFadeIn}>
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-[#178a2d] text-white rounded-full font-bold text-xl">2</div>
              <h3 className="text-xl font-semibold mb-2 text-[#178a2d]">Explore</h3>
              <p className="text-gray-600">Access notes, videos, quizzes, and past papers.</p>
              <div className="connector-line-horizontal mt-6 md:hidden"></div>
              <div className="connector-line mt-4 lg:hidden"></div>
            </motion.div>

            <motion.div className="text-center relative px-4" variants={itemFadeIn}>
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-[#178a2d] text-white rounded-full font-bold text-xl">3</div>
              <h3 className="text-xl font-semibold mb-2 text-[#178a2d]">Contribute</h3>
              <p className="text-gray-600">Share your own valuable study material.</p>
              <div className="connector-line mt-4 lg:hidden"></div>
              <div className="connector-curve curve-3-4 hidden lg:block"></div>
            </motion.div>

            <motion.div className="text-center relative px-4" variants={itemFadeIn}>
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-[#178a2d] text-white rounded-full font-bold text-xl">4</div>
              <h3 className="text-xl font-semibold mb-2 text-[#178a2d]">Connect</h3>
              <p className="text-gray-600">Engage with peers on the chatbot or forums.</p>
            </motion.div>
          </motion.div>
        </Section>
        {/* --- End of How It Works Section --- */}

        {/* --- Why Choose Section --- */}
        <Section>
          <SectionTitle>Why Choose KU Connect?</SectionTitle>

          {/* MODIFIED: Added stagger container to the 5-column grid */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center"
            {...staggerContainer}
          >

            {/* MODIFIED: Wrapped column 1 in motion.div */}
            <motion.div
              className="flex flex-row lg:flex-col items-center justify-around gap-12 md:gap-12 lg:col-span-1"
              variants={itemFadeIn}
            >
              <Clock size={128} className="text-[#178a2d]" />
              <BrainCircuit size={128} className="text-[#178a2d]" />
            </motion.div>

            {/* MODIFIED: Wrapped column 2 (grid) in motion.div */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:col-span-3"
              variants={itemFadeIn} // This 2x2 grid will fade in as one block
            >
              <div className="bg-emerald-100 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-[#178a2d] mb-2">Time Saving</h3>
                <p className="text-gray-700">Find what you need quickly, all in one place.</p>
              </div>
              <div className="bg-emerald-100 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-[#178a2d] mb-2">Organized Content</h3>
                <p className="text-gray-700">Semester-wise structure keeps study material tidy.</p>
              </div>
              <div className="bg-emerald-100 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-[#178a2d] mb-2">Smart Study Support</h3>
                <p className="text-gray-700">AI chatbot to assist with queries instantly.</p>
              </div>
              <div className="bg-emerald-100 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-[#178a2d] mb-2">By Students, For Students</h3>
                <p className="text-gray-700">A platform built around actual student needs.</p>
              </div>
            </motion.div>

            {/* MODIFIED: Wrapped column 3 in motion.div */}
            <motion.div
              className="flex flex-row lg:flex-col items-center justify-around gap-4 lg:col-span-1"
              variants={itemFadeIn}
            >
              <BookOpen size={128} className="text-[#178a2d]" />
              <Users size={128} className="text-[#178a2d]" />
            </motion.div>
          </motion.div>
        </Section>
        {/* --- End of Why Choose Section --- */}

        {/* --- Call to Action Section --- */}
        <Section className="bg-gradient-to-r from-emerald-50 to-green-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* MODIFIED: Wrapped CTA Column 1 (Text) in motion.div */}
            <motion.div
              className="text-center lg:text-left "
              {...fadeInFromBottom}
            >
              <h2 className="text-3xl xl:text-6xl text-[#178a2d] mb-4 ">
                Ready to simplify your <span className="font-bold underline">academic life?</span>
              </h2>
              <p className=" text-lg  xl:text-3xl text-gray-700 mb-6 xl:mt-15 xl:mb-10 ">
                Sign up now ! <br></br>
                it's free, fast, and made <br></br>
                for KU students.
              </p>

              <Link
                to='/signup'
                className="px-8 py-3 text-lg text-white font-semibold bg-gradient-to-b from-[#25a83e] to-[#1a8a2e] rounded-full shadow-lg hover:opacity-90 transition-opacity transform hover:scale-105 duration-300"
              >
                Get Started
              </Link>
            </motion.div>

            {/* MODIFIED: Wrapped CTA Column 2 (Image) in motion.div */}
            <motion.div
              className="w-full xl:ml-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeInOut' }} // Added delay
              viewport={{ once: true }}
            >
              <div
                className="w-full h-[460px]  xl:h-[640px] bg-cover bg-center rounded-2xl"
                style={{
                  backgroundImage:
                    "url('/assets/connect-hero-img.png')",
                }}
              >
                  {/* Image is applied via background, no content needed here */}
                </div>
            </motion.div>
          </div>
        </Section>
        {/* --- End of Call to Action Section --- */}

      </div>
    </>
  );
}