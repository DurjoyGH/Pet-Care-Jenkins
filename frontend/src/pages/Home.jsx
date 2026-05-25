import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Shield, PenTool, Heart } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 text-center md:text-left"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-6">
                Love Your Pet,{" "}
                <span className="text-primary">Share Your Story</span>
              </h1>
              <p className="text-gray-500 text-lg mb-8 max-w-lg">
                Pet Care is a community where pet lovers share tips, stories, and
                heartfelt moments about their furry companions.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Link
                  to="/blogs"
                  className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-full font-semibold transition-colors text-lg"
                >
                  Read Blogs
                </Link>
                <Link
                  to="/register"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-full font-semibold transition-colors text-lg"
                >
                  Join Us
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1 flex justify-center"
            >
              <img
                src="/logo.png"
                alt="PetCare"
                className="w-72 md:w-96 drop-shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
          Why <span className="text-primary">PetCare</span>?
        </h2>
        <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
          Everything you need to share and discover pet stories
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: PenTool, title: "Write Freely", desc: "Create and publish beautiful blog posts about your pets" },
            { icon: BookOpen, title: "Discover", desc: "Read stories from pet lovers all around Bangladesh" },
            { icon: Shield, title: "Moderated", desc: "Every post is reviewed to ensure quality content" },
            { icon: Heart, title: "Community", desc: "Connect with fellow pet enthusiasts" },
          ].map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-card rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon size={24} className="text-primary" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
