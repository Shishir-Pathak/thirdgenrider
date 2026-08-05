import { CheckCircle, Eye, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useSiteContent } from "../hooks/useSiteContent";
import LoadingSpinner from "../components/LoadingSpinner";

function RichText({ html, className = "" }) {
  if (!html) return null;

  return (
    <div
      className={`rich-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

const About = () => {
  const { content, loading: contentLoading } = useSiteContent("about");
  const aboutContent = content.about;
  const companyName = aboutContent.heading || "About Us";
  const about = aboutContent.description || "";
  const loading = contentLoading;

  if (loading) {
    return (
      <section className="min-h-screen bg-background px-6 py-16 lg:px-16">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center">
          <LoadingSpinner label="Loading about page..." size="lg" />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background px-6 py-16 lg:px-16">
      <div className="mx-auto grid max-w-7xl items-stretch gap-12 lg:grid-cols-2">
        <motion.div
          className="flex h-full flex-col"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <div>
            <h1 className="text-4xl font-bold leading-tight text-[#07142f] md:text-6xl">
              {companyName}
            </h1>

            <div>
              <RichText
                html={about}
                className="mt-6 text-lg leading-10 text-gray-600 [&_a]:text-[#1d2c57] [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-[#1d2c57] [&_blockquote]:pl-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6"
              />
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2">
              <motion.div
                className="rounded-2xl border bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                variants={fadeUp}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="flex justify-center">
                  <Eye className="h-14 w-14 text-[#1d2c57]" />
                </div>

                <h3 className="mt-5 text-3xl font-semibold text-[#07142f]">
                  Our Vision
                </h3>

                <RichText
                  html={aboutContent.visionText}
                  className="mt-6 text-lg leading-9 text-gray-500 [&_a]:text-[#1d2c57] [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6"
                />
              </motion.div>

              <motion.div
                className="rounded-2xl border bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                variants={fadeUp}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="flex justify-center">
                  <Target className="h-14 w-14 text-[#1d2c57]" />
                </div>

                <h3 className="mt-5 text-3xl font-semibold text-[#07142f]">
                  Our Mission
                </h3>

                <RichText
                  html={aboutContent.missionText}
                  className="mt-6 text-lg leading-9 text-gray-500 [&_a]:text-[#1d2c57] [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6"
                />
              </motion.div>
            </div>

            <RichText
              html={aboutContent.closingText}
              className="mt-12 text-xl leading-10 text-gray-600 [&_a]:text-[#1d2c57] [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-[#1d2c57] [&_blockquote]:pl-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6"
            />
          </div>

          <motion.div
            className="mt-10 flex flex-col gap-8 md:flex-row"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex w-full flex-col items-center justify-center rounded-2xl bg-[#1d2c57] px-14 py-10 text-white md:w-[320px]">
              <h2 className="text-6xl font-bold">
                {aboutContent.experienceYears}
              </h2>

              <p className="mt-4 text-center text-2xl font-medium">
                {aboutContent.experienceLabel}
              </p>
            </div>

            <div className="flex flex-col justify-center gap-6">
              {aboutContent.features.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="flex items-center gap-3 text-xl text-gray-600"
                >
                  <CheckCircle className="h-6 w-6 text-[#1d2c57]" />
                  <RichText
                    html={item}
                    className="[&_a]:text-[#1d2c57] [&_a]:underline"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex h-full flex-col"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <div className="min-h-[360px] overflow-hidden rounded-3xl bg-slate-100 shadow-lg lg:min-h-[560px]">
          {aboutContent.primaryImageUrl ? (
  <img
    src={aboutContent.primaryImageUrl}
    alt="cars"
    className="h-full min-h-[360px] w-full object-cover lg:min-h-[560px]"
    decoding="async"
    fetchPriority="high"
    loading="eager"
  />
) : (
  <div className="flex h-full min-h-[360px] items-center justify-center bg-slate-200 text-gray-500 lg:min-h-[560px]">
    No Primary Image
  </div>
)}
          </div>

          <div className="-mt-16 min-h-[240px] w-[85%] self-end overflow-hidden rounded-3xl border-8 border-background bg-slate-100 shadow-xl lg:min-h-[320px]">
         {aboutContent.secondaryImageUrl ? (
  <img
    src={aboutContent.secondaryImageUrl}
    alt="travel"
    className="h-full min-h-[240px] w-full object-cover lg:min-h-[320px]"
    decoding="async"
    loading="lazy"
  />
) : (
  <div className="flex h-full min-h-[240px] items-center justify-center bg-slate-200 text-gray-500 lg:min-h-[320px]">
    No Secondary Image
  </div>
)}
          </div>
        </motion.div>
      </div>
      
    </section>
    
  );
};

export default About;
