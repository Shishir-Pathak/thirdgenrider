import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  Clock3,
  MessageSquareText,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { apiUrl } from "../lib/api";
import { getHighResImage } from "../lib/image";
import LoadingSpinner from "../components/LoadingSpinner";

function stripHtml(html) {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(value) {
  if (!value) return "Recently published";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently published";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function estimateReadTime(html) {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
}

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadBlogs() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(apiUrl("/api/blogs"));
        if (!res.ok) {
          throw new Error("Failed to load blog posts.");
        }
        const data = await res.json();
        if (active) {
          setBlogs(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (active) {
          setBlogs([]);
          setError(err.message || "Failed to load blog posts.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadBlogs();
    return () => {
      active = false;
    };
  }, []);

  const sortedBlogs = useMemo(() => {
    return [...blogs].sort((a, b) => {
      const aTime = new Date(a?.createdAt || 0).getTime();
      const bTime = new Date(b?.createdAt || 0).getTime();
      return bTime - aTime;
    });
  }, [blogs]);

  const featuredBlog = sortedBlogs[0] || null;
  const remainingBlogs = sortedBlogs.slice(1);
  const authorCount = useMemo(
    () => new Set(sortedBlogs.map((blog) => blog?.author).filter(Boolean)).size,
    [sortedBlogs],
  );

  return (
    <main className="bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_40%,#f8fafc_100%)] text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(15,118,110,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.12),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-2 text-sm font-semibold text-(--color-primary) shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Travel stories, route tips, and local insights
            </div>
            <h1 className="mt-6 max-w-2xl text-2xl  tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Blog page for riders who want better trips, not just bookings.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Read practical travel guides, road-trip ideas, and destination
              notes curated for bike and package travelers across Nepal.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#latest-stories"
                className="inline-flex items-center justify-center rounded-full bg-(--color-primary) px-6 py-3 font-semibold text-white transition hover:bg-(--color-primary-dark)"
              >
                Browse stories
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Plan a trip
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
                <div className="text-2xl font-black text-slate-950">
                  {sortedBlogs.length}
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  Published posts
                </div>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
                <div className="text-2xl font-black text-slate-950">
                  {authorCount || 0}
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  Contributing authors
                </div>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur col-span-2 sm:col-span-1">
                <div className="text-2xl font-black text-slate-950">
                  {featuredBlog ? 1 : 0}
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  Featured today
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -left-8 top-10 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
            <div className="absolute -bottom-10 right-6 h-28 w-28 rounded-full bg-orange-400/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
              <img
                src={
                  getHighResImage(featuredBlog?.image, 1200) ||
                  "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80"
                }
                alt={featuredBlog?.title || "Featured blog post"}
                className="h-105 w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-slate-950 via-slate-950/80 to-transparent p-6 text-white">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
                  Featured story
                </div>
                <h2 className="mt-4 text-2xl font-bold leading-tight sm:text-3xl">
                  {featuredBlog?.title ||
                    "Stories will appear here once posts are published."}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
                  {featuredBlog
                    ? stripHtml(featuredBlog.description).slice(0, 180) +
                      (stripHtml(featuredBlog.description).length > 180
                        ? "..."
                        : "")
                    : "Use the dashboard blog editor to publish route guides, travel notes, and destination highlights."}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="latest-stories"
        className="mx-auto max-w-7xl px-6 py-16 lg:py-20"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-(--color-primary)">
              Latest posts
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Recent stories from the road
            </h2>
          </div>
        </div>

        {loading && (
          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm">
            <LoadingSpinner label="Loading blog posts..." />
          </div>
        )}

        {!loading && error && (
          <div className="mt-10 flex items-start gap-3 rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && sortedBlogs.length === 0 && (
          <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-950">
              No blog posts yet.
            </p>
            <p className="mt-2 text-slate-600">
              Publish the first article from the dashboard to populate this
              page.
            </p>
          </div>
        )}

        {!loading && !error && sortedBlogs.length > 0 && (
          <>
            {featuredBlog && (
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45 }}
                className="mt-10 overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
                  <img
                    src={getHighResImage(featuredBlog.image, 1400)}
                    alt={featuredBlog.title}
                    className="h-72 w-full object-cover lg:h-full"
                  />
                  <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                        <CalendarDays className="h-4 w-4" />
                        {formatDate(featuredBlog.createdAt)}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                        <Clock3 className="h-4 w-4" />
                        {estimateReadTime(featuredBlog.description)} min read
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                        <MessageSquareText className="h-4 w-4" />
                        {
                          (featuredBlog.comments || []).filter(Boolean).length
                        }{" "}
                        comments
                      </span>
                    </div>

                    <h3 className="mt-5 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                      {featuredBlog.title}
                    </h3>

                    <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">
                      {stripHtml(featuredBlog.description).slice(0, 320)}
                      {stripHtml(featuredBlog.description).length > 320
                        ? "..."
                        : ""}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span className="font-semibold text-slate-800">
                        By {featuredBlog.author}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span>
                        {(featuredBlog.comments || []).filter(Boolean).length}{" "}
                        reader notes
                      </span>
                    </div>

                    <div className="mt-8">
                      <Link
                        to={`/blog/${encodeURIComponent(
                          featuredBlog.slug || featuredBlog.id,
                        )}`}
                        className="inline-flex items-center gap-2 rounded-full bg-(--color-primary) px-5 py-3 font-semibold text-white transition hover:bg-(--color-primary-dark)"
                      >
                        Read full story
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            )}

            <div
              id="all-posts"
              className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
            >
              {remainingBlogs.map((blog, index) => {
                const excerpt = stripHtml(blog.description);
                return (
                  <motion.article
                    key={blog.id || blog._id || blog.slug || index}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.4, delay: index * 0.04 }}
                    className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <Link
                      to={`/blog/${encodeURIComponent(blog.slug || blog.id)}`}
                      className="block h-full"
                    >
                      <div className="relative">
                        <img
                          src={
                            getHighResImage(blog.image, 900) ||
                            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"
                          }
                          alt={blog.title}
                          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                        <div className="absolute left-4 top-4 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
                          {formatDate(blog.createdAt)}
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                            {estimateReadTime(blog.description)} min read
                          </span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                            {(blog.comments || []).filter(Boolean).length}{" "}
                            comments
                          </span>
                        </div>

                        <h3 className="mt-4 text-xl font-black leading-tight text-slate-950">
                          {blog.title}
                        </h3>

                        <p className="mt-3 line-clamp-4 text-sm leading-7 text-slate-600">
                          {excerpt.length > 200
                            ? `${excerpt.slice(0, 200)}...`
                            : excerpt}
                        </p>

                        <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-200 pt-4 text-sm">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {blog.author}
                            </p>
                            <p className="text-slate-500">Author</p>
                          </div>
                          <span className="inline-flex items-center gap-2 font-semibold text-(--color-primary)">
                            Read more
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default Blog;
