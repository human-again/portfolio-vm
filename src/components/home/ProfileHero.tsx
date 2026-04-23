"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { portfolio } from "@/data/portfolio";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function ProfileHero() {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className="flex flex-col items-center text-center"
      initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={prefersReduced ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
    >
      <p className="text-2xl md:text-3xl font-bold text-foreground mb-1">
        {portfolio.profile.tagline}
      </p>
      <h1 className="text-xl md:text-2xl font-normal text-muted-foreground tracking-tight mb-8">
        {portfolio.profile.headline}
      </h1>
      <motion.div
        className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden relative"
        initial={prefersReduced ? {} : { scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={prefersReduced ? { duration: 0 } : { duration: 0.5, delay: 0.2, ease: "easeOut" }}
      >
        <Image
          src={portfolio.profile.avatar}
          alt={portfolio.profile.name}
          fill
          className="object-cover"
          priority
        />
      </motion.div>
    </motion.div>
  );
}
