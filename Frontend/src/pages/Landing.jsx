import { motion } from "framer-motion"
import { Users, TrendingUp, Zap, Quote, ArrowRight } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/landing.css"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
}

const slideInVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
}

export default function Landing() {
  const [isNavOpen, setIsNavOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-blue-50/30 font-sans">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
            <div className="w-8 h-8 bg-linear-to-br from-blue-900 to-blue-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TF</span>
            </div>
            <span className="text-xl font-bold text-foreground">TaskFlow</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {["Home", "Features", "Testimonials"].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-foreground/70 hover:text-foreground transition-colors"
                whileHover={{ y: -2 }}
              >
                {item}
              </motion.a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <motion.button
              onClick={() => navigate("/login")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-foreground/70 hover:text-foreground transition-colors font-medium"
            >
              Login
            </motion.button>
            <motion.button
              onClick={() => navigate("/sign-up")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-linear-to-r from-blue-900 to-blue-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow"
            >
              Sign Up
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsNavOpen(!isNavOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isNavOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t border-border bg-background p-4 space-y-3"
          >
            {["Home", "Features", "Testimonials"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="block text-foreground/70 hover:text-foreground">
                {item}
              </a>
            ))}
            <div className="flex gap-3 pt-3">
              <button
                onClick={() => navigate("/login")}
                className="flex-1 text-foreground/70 hover:text-foreground font-medium"
              >
                Login
              </button>
              <button className="flex-1 px-4 py-2 bg-linear-to-r from-blue-900 to-blue-500 text-white rounded-lg font-medium">
                Sign Up
              </button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={slideInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight">
              Organize Tasks
              <span className="block bg-linear-to-r from-blue-900 to-blue-400 bg-clip-text text-transparent">
                Effortlessly
              </span>
            </h1>
            <p className="text-lg text-foreground/60 text-balance leading-relaxed">
              TaskFlow helps you stay organized, collaborate with teammates, and track progress in real-time. Get more
              done with less friction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                onClick={() => navigate("/login")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-linear-to-r from-blue-900 to-blue-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Get Started
              </motion.button>
              
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-linear-to-br from-blue-100 to-blue-50 rounded-2xl p-8 shadow-2xl border border-blue-100">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="h-3 bg-blue-200 rounded w-3/4"></div>
                  <div className="h-3 bg-blue-100 rounded w-1/2"></div>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                    <div className="w-3 h-3 rounded-full bg-blue-900"></div>
                    <div className="h-2 bg-gray-200 rounded flex-1"></div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <div className="h-2 bg-gray-200 rounded flex-1"></div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <div className="h-2 bg-gray-200 rounded flex-1"></div>
                  </div>
                </div>
              </div>
            </div>
            <motion.div
              className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-400/20 rounded-full blur-3xl"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-foreground/60 text-balance max-w-2xl mx-auto">
              Everything you need to manage tasks and collaborate with your team
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Zap,
                title: "Smart Reminders",
                description:
                  "Never miss a deadline. Get intelligent reminders tailored to your workflow and preferences.",
              },
              {
                icon: Users,
                title: "Collaboration",
                description: "Work together seamlessly. Share tasks, assign work, and communicate within the platform.",
              },
              {
                icon: TrendingUp,
                title: "Progress Tracking",
                description: "Visualize your progress with real-time analytics and detailed performance metrics.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-8 rounded-xl border border-blue-100 bg-linear-to-br from-blue-50 to-white hover:shadow-lg transition-shadow"
                whileHover={{ y: -8 }}
              >
                <feature.icon className="w-12 h-12 text-blue-900 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-foreground/60">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What Users Say</h2>
            <p className="text-lg text-foreground/60 text-balance max-w-2xl mx-auto">
              Join thousands of productive teams using TaskFlow
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                name: "Marina",
                role: "Data Science Student",
                text: "TaskFlow transformed how I manages projects. I'm 40% more efficient now.",
              },
              {
                name: "Sameh",
                role: "Backend Developer",
                text: "The collaboration features are amazing. Our team stays in sync without endless meetings.",
              },
              {
                name: "Hossam",
                role: "Team Lead",
                text: "Simple, powerful, and exactly what we needed. Best productivity tool we found.",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-8 rounded-xl border border-blue-100 bg-white hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>
                <Quote className="w-6 h-6 text-blue-900 mb-4 opacity-50" />
                <p className="text-foreground/70 mb-6 leading-relaxed">{testimonial.text}</p>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{testimonial.avatar}</div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-foreground/60">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-blue-900 to-blue-500">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-blue-100 text-lg mb-8 text-balance">
              Join thousands of teams organizing their work with TaskFlow today.
            </p>
            <motion.button
              onClick={() => navigate("/login")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-blue-900 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-linear-to-br from-blue-900 to-blue-300 rounded-lg"></div>
                <span className="font-bold">TaskFlow</span>
              </div>
              <p className="text-background/70 text-sm">Organize tasks effortlessly.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li>
                  <a href="#features" className="hover:text-background transition-colors">
                    Features
                  </a>
                </li>
                <li>
                    <a href="#testimonials" className="hover:text-background transition-colors">
                    Testimonials
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-background/70">
            <p>&copy; 2025 TaskFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
