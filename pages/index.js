
import React, { useEffect, useState } from 'react';
import Head from 'next/head';

const ANILIST_ENDPOINT = "https://graphql.anilist.co";

export default function Home() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const SEARCH_QUERY = `
    query ($search: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: TRENDING_DESC, search: $search) {
          id
          title { romaji english }
          coverImage { large }
          bannerImage
          description(asHtml: false)
          episodes
          genres
          trailer { id site }
        }
      }
    }
  `;

  useEffect(() => {
    if (!search) return;
    setLoading(true);
    fetch(ANILIST_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: SEARCH_QUERY, variables: { search, page: 1, perPage: 12 } }),
    })
      .then(res => res.json())
      .then(json => setResults(json?.data?.Page?.media || []))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Head>
        <title>AnimeWatch – Legal Anime Streaming</title>
        <meta name="description" content="Watch trending anime legally with AniList metadata and YouTube trailers." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://yourdomain.com" />
      </Head>
      <header className="p-4">
        <h1 className="text-2xl font-bold">AnimeWatch</h1>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search anime..." className="mt-2 rounded px-3 py-2 text-black w-full max-w-md" />
      </header>
      <main className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {loading ? <p>Loading...</p> : results.map(anime => (
          <div key={anime.id} className="rounded bg-gray-800 p-2">
            <img src={anime.coverImage.large} alt={anime.title.english || anime.title.romaji} className="w-full rounded" />
            <h2 className="mt-2 text-sm font-semibold truncate">{anime.title.english || anime.title.romaji}</h2>
            <p className="text-xs opacity-70 truncate">{anime.episodes} eps</p>
            <Head>
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "TVSeries",
                "name": anime.title.english || anime.title.romaji,
                "image": anime.coverImage.large,
                "description": anime.description || "",
                "genre": anime.genres || [],
                "numberOfEpisodes": anime.episodes || 0,
                "trailer": anime.trailer?.site === "youtube" ? {
                  "@type": "VideoObject",
                  "name": "Trailer",
                  "contentUrl": `https://www.youtube.com/watch?v=${anime.trailer.id}`,
                  "thumbnailUrl": anime.coverImage.large,
                  "uploadDate": new Date().toISOString()
                } : undefined
              }) }} />
            </Head>
          </div>
        ))}
      </main>
    </div>
  );
}
