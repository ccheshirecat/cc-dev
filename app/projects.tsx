'use client'

import { motion } from "framer-motion"
import { ExternalLink } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Projects() {
  const projects = [
    {
      title: "FUSED.GG",
      description: 'Currently still a work in progress, fused.gg is a new player in the iGaming space focused on helping make affiliates more competitive, expand their reach and grow their brand as a service. By extension also to improve overall transparency in the sector to help players make better decisions.',
      image: 'https://cheshirecat.dev/cdn-cgi/image/width=300,height=200,format=webp,quality=85/fused-thumbnail.png',
      tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "GraphQL", "PostgreSQL", "Redis"],
      links: {
        live: "https://fused.gg",
      },
    },
    {
      title: "Porter Plays",
      description: 'A casino affiliate site with fully integrated leaderboards that support multiple casinos, user management system with a rewards system that comes with a points store, and a custom and original design and brand identity.',
      image: 'https://cheshirecat.dev/cdn-cgi/image/width=300,height=200,format=webp,quality=85/porterplays-thumbnail.png',
      tags: ["Next.js", "React", "TypeScript", "Drizzle ORM", "PostgreSQL", "Tailwind CSS"],
      links: {
        live: "https://porterplays.vercel.app",
      },
    },
    {
      title: "Portfolio for an Emcee",
      description: "Slightly different project for an IRL client, built in Astro to be blazingly fast, mixing my usual unprofessional style with the need for a professional theme, think it turnede out decent.",
      image: 'https://cheshirecat.dev/cdn-cgi/image/width=300,height=200,format=webp,quality=85/perrybrady-thumbnail.png',
      tags: ["Astro", "React", "Tailwind CSS", "Framer Motion"],
      links: {
        live: 'https://perry-brady.vercel.app',
      },
    }
  ]
  

 return (
   <section id="projects" className="py-20 relative z-10">
     <div className="container mx-auto px-4 max-w-5xl">
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         whileInView={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
         viewport={{ once: true }}
         className="text-center mb-12"
       >
         <h2 className="text-4xl font-bold text-purple-400 mb-4">
           projects
         </h2>
         <p className="text-purple-300 max-w-xl mx-auto">
           some examples of what i get up to when im bored and have no bullet
         </p>
       </motion.div>
       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
         {projects.map((project, index) => (
           <motion.div
             key={index}
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: index * 0.1 }}
             viewport={{ once: true }}
           >
             <Card className="overflow-hidden bg-black border border-purple-800/30 group rounded-3xl shadow-lg shadow-purple-900/10 hover:shadow-purple-800/20 hover:border-purple-700/50 transition-all duration-300">
               <div className="relative aspect-video overflow-hidden bg-black">
               <Image
  src={project.image}
  alt={project.title}
  fill
  className="object-cover transition-transform duration-300 group-hover:scale-110"
/>
               </div>
               <div className="p-6">
                 <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-300 to-white bg-clip-text text-transparent">{project.title}</h3>
                 <p className="text-purple-400/70 text-sm mb-4">{project.description}</p>
                 <div className="flex flex-wrap gap-2 mb-4">
                   {project.tags.map((tag, tagIndex) => (
                     <span
                       key={tagIndex}
                       className="text-xs px-3 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-700/50 shadow-[0_0_15px_rgba(168,85,247,0.15)] group-hover:shadow-[0_0_20px_rgba(168,85,247,0.25)] transition-all duration-300"
                     >
                       {tag}
                     </span>
                   ))}
                 </div>
                 <div className="flex items-center gap-3">
                   <Link href={project.links.live} passHref legacyBehavior>
                     <Button asChild size="sm" variant="ghost" className="text-purple-400/60 hover:text-purple-300 hover:bg-purple-900 transition-colors duration-300">
                       <a target="_blank" rel="noopener noreferrer">
                         <ExternalLink className="w-4 h-4 mr-2" />
                         Demo
                       </a>
                     </Button>
                   </Link>
                 </div>
               </div>
             </Card>
           </motion.div>
         ))}
       </div>
     </div>
   </section>
 )
}
