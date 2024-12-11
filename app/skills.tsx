'use client'

import { motion } from "framer-motion"
import { Cat, Code, Database, FileCode, Layers, Cpu, Zap } from 'lucide-react'

import { Card } from "@/components/ui/card"

export function Skills() {
 const skills = [
   {
     category: "frontend",
     icon: <Cat className="w-6 h-6" />,
     items: ["React", "Next.js", "Astro", "Vue.js", "Tailwind CSS", "TypeScript"],
   },
   {
     category: "backend",
     icon: <Database className="w-6 h-6" />,
     items: ["Node.js", "Express.js", "MongoDB", "PostgreSQL", "SQLite", "Drizzle", "Prisma"],
   },
   {
     category: "devops",
     icon: <Cpu className="w-6 h-6" />,
     items: ["Vercel", "Docker", "Kubernetes", "CI/CD"],
   },
   {
     category: "tools",
     icon: <Zap className="w-6 h-6" />,
     items: ["Git", "VSCode", "CLI", "Webpack"],
   },
 ]

 const floatingIcons = [
   { icon: <Code className="w-8 h-8" />, delay: 0 },
   { icon: <FileCode className="w-8 h-8" />, delay: 0.1 },
   { icon: <Database className="w-8 h-8" />, delay: 0.2 },
   { icon: <Layers className="w-8 h-8" />, delay: 0.3 },
   { icon: <Cpu className="w-8 h-8" />, delay: 0.4 },
   { icon: <Zap className="w-8 h-8" />, delay: 0.5 },
 ]

 return (
   <section id="skills" className="py-20 relative overflow-hidden">
     <div className="absolute inset-0 pointer-events-none">
       {floatingIcons.map((item, index) => (
         <motion.div
           key={index}
           initial={{ opacity: 0, y: 20 }}
           animate={{
             opacity: [0.1, 0.3, 0.1],
             y: [0, -20, 0],
           }}
           transition={{
             duration: 5,
             delay: item.delay,
             repeat: Infinity,
           }}
           className="absolute text-purple-800"
           style={{
             left: `${(index * 20) + 10}%`,
             top: `${(index * 15) + 20}%`,
           }}
         >
           {item.icon}
         </motion.div>
       ))}
     </div>
     <div className="container mx-auto px-4 max-w-5xl relative z-10">
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         whileInView={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
         viewport={{ once: true }}
         className="text-center mb-12"
       >
         <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-purple-400 bg-clip-text text-transparent mb-4">
           blablabla
         </h2>
         <p className="text-purple-300/60 max-w-xl mx-auto">
         more stuff to convince u to faster sen

         </p>
       </motion.div>
       <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
         {skills.map((skill, index) => (
           <motion.div
             key={index}
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: index * 0.1 }}
             viewport={{ once: true }}
           >
             <Card className="p-6 bg-black border border-purple-800/30 hover:border-purple-700/50 transition-all duration-300 group rounded-3xl shadow-lg shadow-purple-900/10 hover:shadow-purple-800/20">
               <div className="flex items-center gap-4 mb-4">
                 <div className="p-2 rounded-lg bg-purple-900/30 text-purple-400 group-hover:text-purple-300 transition-colors">
                   {skill.icon}
                 </div>
                 <h3 className="font-semibold text-purple-300 group-hover:text-purple-200 transition-colors">{skill.category}</h3>
               </div>
               <ul className="space-y-2">
                 {skill.items.map((item, itemIndex) => (
                   <li key={itemIndex} className="text-sm text-purple-400/70 group-hover:text-purple-300/90 transition-colors">
                     {item}
                   </li>
                 ))}
               </ul>
             </Card>
           </motion.div>
         ))}
       </div>
     </div>
   </section>
 )
}

