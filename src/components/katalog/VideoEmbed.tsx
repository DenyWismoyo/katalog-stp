import { Play, Video } from 'lucide-react'

interface VideoEmbedProps {
  videoUrl?: string
  title?: string
}

function getEmbedUrl(url: string): string | null {
  try {
    if (url.includes('youtube.com/watch')) {
      const parsed = new URL(url)
      const v = parsed.searchParams.get('v')
      return v ? `https://www.youtube-nocookie.com/embed/${v}` : null
    }
    if (url.includes('youtu.be/')) {
      const parts = url.split('youtu.be/')
      const id = parts[1]?.split('?')[0]
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
    }
    if (url.includes('youtube.com/embed/')) {
      return url
    }
    return null
  } catch {
    return null
  }
}

export function VideoEmbed({ videoUrl, title = 'Demonstrasi Produk' }: VideoEmbedProps) {
  if (!videoUrl) return null

  const youtubeEmbed = getEmbedUrl(videoUrl)

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
          <Video className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-bold text-white tracking-tight">
          Video Uji Coba & Demonstrasi Lapangan
        </h3>
      </div>

      <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
        {youtubeEmbed ? (
          <iframe
            src={youtubeEmbed}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : (
          <video
            src={videoUrl}
            controls
            className="w-full h-full object-cover"
            title={title}
          />
        )}
      </div>
    </div>
  )
}
