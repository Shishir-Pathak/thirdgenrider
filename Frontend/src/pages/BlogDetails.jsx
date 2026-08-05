import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MessageSquareText,
  User2,
} from "lucide-react";
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

function BlogBody({ html }) {
  if (!html) {
    return (
      <p className="text-slate-600">
        This story is still being prepared. Please check back soon for the full
        article.
      </p>
    );
  }

  return (
    <div
      className="rich-content prose prose-lg max-w-none leading-8 prose-slate prose-headings:text-slate-950 prose-p:my-4 prose-a:text-(--color-primary) prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-(--color-primary) prose-blockquote:pl-4 prose-img:rounded-2xl"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function BlogDetails() {
  const { blogSlug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadBlog() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(apiUrl("/api/blogs"));
        if (!res.ok) {
          throw new Error("Failed to load blog posts.");
        }
        const data = await res.json();
        if (!active) return;

        const items = Array.isArray(data) ? data : [];
        const found = items.find((item) => {
          const itemSlug = String(item?.slug || "");
          const itemId = String(item?.id || item?._id || "");
          return itemSlug === String(blogSlug) || itemId === String(blogSlug);
        });

        setBlog(found || null);
        setRelatedBlogs(
          items
            .filter(
              (item) =>
                String(item?.slug || item?.id || item?._id) !==
                String(blogSlug),
            )
            .sort((a, b) => {
              const aTime = new Date(a?.createdAt || 0).getTime();
              const bTime = new Date(b?.createdAt || 0).getTime();
              return bTime - aTime;
            })
            .slice(0, 3),
        );
      } catch (err) {
        if (active) {
          setError(err.message || "Failed to load blog details.");
          setBlog(null);
          setRelatedBlogs([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadBlog();
    return () => {
      active = false;
    };
  }, [blogSlug]);

  const commentsCount = useMemo(
    () =>
      Array.isArray(blog?.comments) ? blog.comments.filter(Boolean).length : 0,
    [blog],
  );

  if (loading) {
    return (
      <section className="min-h-[60vh] bg-background px-6 py-16">
        <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center">
          <LoadingSpinner label="Loading story..." size="lg" />
        </div>
      </section>
    );
  }

  if (error || !blog) {
    return (
      <section className="min-h-[60vh] bg-background px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold text-slate-950">Story not found</h1>
          <p className="mt-3 text-slate-600">
            {error || "We could not find the story you were looking for."}
          </p>
          <button
            type="button"
            onClick={() => navigate("/blog")}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-(--color-primary) px-5 py-3 font-semibold text-white transition hover:bg-(--color-primary-dark)"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to stories
          </button>
        </div>
      </section>
    );
  }

  const readTime = estimateReadTime(blog.description);
  const excerpt = stripHtml(blog.description);

  return (
    <main className="bg-background text-slate-900">
      <section className="border-b border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-16">
          <div>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-(--color-primary) transition hover:text-(--color-primary-dark)"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to stories
            </Link>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.24em] text-(--color-primary)">
              Travel story
            </p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-2 text-sm font-semibold text-(--color-primary) shadow-sm">
              <CalendarDays className="h-4 w-4" />
              {formatDate(blog.createdAt)}
            </p>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              {blog.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 font-medium shadow-sm">
                <User2 className="h-4 w-4" />
                {blog.author}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 font-medium shadow-sm">
                <Clock3 className="h-4 w-4" />
                {readTime} min read
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 font-medium shadow-sm">
                <MessageSquareText className="h-4 w-4" />
                {commentsCount} comments
              </span>
            </div>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              {excerpt.length > 240 ? `${excerpt.slice(0, 240)}...` : excerpt}
            </p>
          </div>

          <div className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
            <img
              src={
                getHighResImage(blog.image, 1400) ||
                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80"
              }
              alt={blog.title}
              className="h-80 w-full object-cover sm:h-130"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:py-20">
        <article className="self-start rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <BlogBody html={blog.description} />
        </article>

        <aside className="self-start space-y-6">
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Quick facts</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>
                <span className="font-semibold text-slate-900">Author:</span>{" "}
                {blog.author}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Published:</span>{" "}
                {formatDate(blog.createdAt)}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Read time:</span>{" "}
                {readTime} min
              </p>
            </div>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">
              More stories you may like
            </h2>
            <div className="mt-4 space-y-4">
              {relatedBlogs.length > 0 ? (
                relatedBlogs.map((item) => (
                  <Link
                    key={item.id || item._id || item.slug}
                    to={`/blog/${encodeURIComponent(item.slug || item.id)}`}
                    className="block rounded-2xl border border-slate-200 p-4 transition hover:border-primary/30 hover:bg-slate-50 hover:shadow-sm"
                  >
                    <p className="text-sm font-semibold text-(--color-primary)">
                      {formatDate(item.createdAt)}
                    </p>
                    <p className="mt-1 font-bold text-slate-950">
                      {item.title}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                      {stripHtml(item.description)}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-slate-600">
                  No related stories yet.
                </p>
              )}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
