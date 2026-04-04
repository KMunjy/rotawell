'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { OrbitalHeart } from '@/components/brand/orbital-heart';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  author_name: string | null;
  category: string | null;
  published_at: string | null;
  cover_image_url: string | null;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const supabase = createClient();
        const { data, error: dbError } = await supabase
          .from('nursly_blog_posts')
          .select('id, title, slug, summary, author_name, category, published_at, cover_image_url')
          .eq('published', true)
          .order('published_at', { ascending: false });

        if (dbError) {
          console.error('Blog fetch error:', dbError);
          setError('Failed to load posts');
        } else {
          setPosts((data as BlogPost[]) || []);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-brand-cream">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <Link href="/" className="flex items-center gap-2">
              <OrbitalHeart />
              <span className="text-2xl font-bold text-primary">Rotawell</span>
            </Link>
            <div className="flex gap-4">
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Sign in</Link>
              <Link href="/register" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
                Get started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="bg-white py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900">Rotawell Blog</h1>
            <p className="mt-4 text-lg text-gray-600">
              Insights, guidance, and news for care workers and providers across the UK.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-16">
                <p className="text-gray-500">Loading posts...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16 rounded-xl border border-red-200 bg-red-50">
                <p className="text-red-600">{error}</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16 rounded-xl border border-gray-200 bg-white">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto" />
                <h2 className="mt-4 text-xl font-semibold text-gray-900">No posts yet</h2>
                <p className="mt-2 text-gray-500">
                  We're working on our first posts. Check back soon for articles on care careers, staffing advice, and industry news.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {posts.map((post) => (
                  <article key={post.id} className="rounded-xl border border-gray-200 bg-white p-8 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      {post.category && (
                        <span className="rounded-full bg-primary/10 px-2 py-1 text-primary font-medium">
                          {post.category}
                        </span>
                      )}
                      {post.published_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.published_at).toLocaleDateString('en-GB', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      )}
                      {post.author_name && <span>By {post.author_name}</span>}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{post.title}</h2>
                    {post.summary && (
                      <p className="mt-2 text-gray-600 leading-relaxed">{post.summary}</p>
                    )}
                    <div className="mt-4">
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                        Read more
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-xs text-gray-400">
              <a href="/legal/privacy" className="hover:text-gray-600">Privacy Policy</a>
              <a href="/legal/gdpr" className="hover:text-gray-600">GDPR & Data</a>
              <a href="/contact" className="hover:text-gray-600">Contact</a>
              <a href="/careers" className="hover:text-gray-600">Careers</a>
            </div>
            <p className="text-xs text-gray-400">
              POPIA Information Officer: <a href="mailto:privacy@rotawell.co.uk" className="hover:text-gray-600">privacy@rotawell.co.uk</a>
            </p>
            <p className="text-sm text-gray-500">
              Copyright © {new Date().getFullYear()} Rotawell Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
