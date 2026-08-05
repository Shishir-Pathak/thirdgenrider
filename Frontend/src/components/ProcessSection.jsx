import React from "react";
import { motion } from "framer-motion";
import { useSiteContent } from "../hooks/useSiteContent";

const ProcessSection = ({ data }) => {
  const { content } = useSiteContent("process");
  const process = data || content.process;
  const processSteps = process.steps.map((step, index) => ({
    ...step,
    number: step.number || String(index + 1).padStart(2, "0") + ".",
  }));
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 80,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      className="relative overflow-hidden bg-cover bg-center py-24 text-white"
      style={{ backgroundImage: `url(${process.backgroundImageUrl})` }}
    >
      <div className="absolute inset-0 bg-black/85"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Heading Animation */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-4xl font-bold leading-tight md:text-5xl">
            {process.heading}
            {process.subheading && (
              <span className="block">{process.subheading}</span>
            )}
          </h2>

          <p className="mt-6 text-base font-medium leading-relaxed">
            {process.description}
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-14 grid gap-12 md:grid-cols-3 md:gap-6"
        >
          {processSteps.map((step) => (
            <motion.div
              key={step.number}
              variants={cardVariants}
              whileHover={{
                y: -10,
                scale: 1.03,
              }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative"
            >
              <div className="rounded-lg bg-[var(--color-primary)] px-6 py-6 shadow-xl">
                <h3 className="text-2xl font-medium">{step.title}</h3>

                <p className="mt-3 text-base font-medium leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="absolute -bottom-8 right-10 flex h-16 w-16 items-center justify-center rounded-full border border-white bg-[var(--color-primary)] text-lg font-bold shadow-xl">
                {step.number}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessSection;
