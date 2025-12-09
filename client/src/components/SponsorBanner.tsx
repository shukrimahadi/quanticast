import { ExternalLink, Megaphone } from 'lucide-react';
import { SponsorConfig } from '@/lib/types';

interface Props {
  config: SponsorConfig;
}

export function SponsorBanner({ config }: Props) {
  if (!config.enabled) return null;

  return (
    <div className="w-full mb-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-500" data-testid="banner-sponsor">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
          <Megaphone className="w-3 h-3" />
          Sponsored Partner
        </span>
        <div className="h-px bg-border flex-grow" />
      </div>
      
      <a 
        href={config.targetUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="block relative group overflow-hidden rounded-md border border-border hover:border-fin-accent transition-all duration-300"
        data-testid="link-sponsor"
      >
        <div className="absolute inset-0 bg-fin-accent/0 group-hover:bg-fin-accent/10 transition-colors z-10 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-background/90 backdrop-blur-sm px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 border border-border transform translate-y-4 group-hover:translate-y-0 transition-transform">
            Visit Partner <ExternalLink className="w-4 h-4" />
          </div>
        </div>
        <img 
          src={config.imageUrl} 
          alt={config.altText} 
          className="w-full h-28 md:h-36 object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          onError={(e) => {
            // Avoid external placeholders to prevent console errors / CORS issues
            e.currentTarget.onerror = null;
            e.currentTarget.src = "data:image/gif;base64,R0lGODlhAQABAAAAACw="; // 1x1 transparent
            e.currentTarget.style.background = "linear-gradient(135deg, #0f172a, #0b1222)";
          }}
        />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-3 pt-10">
          <span className="text-white font-semibold text-sm">{config.altText}</span>
        </div>
      </a>
    </div>
  );
}
