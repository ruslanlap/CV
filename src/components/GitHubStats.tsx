export default function GitHubStats({ username }: { username: string }) {
  // Uses github-readme-stats images (no API key needed)
  const stats = `https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&hide_border=true&theme=catppuccin_mocha`;
  const langs = `https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&hide_border=true&theme=catppuccin_mocha`;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <img
        src={stats}
        alt={`${username} GitHub stats`}
        className="w-full rounded-2xl border border-border bg-mantle"
        loading="lazy"
      />
      <img
        src={langs}
        alt={`${username} top languages`}
        className="w-full rounded-2xl border border-border bg-mantle"
        loading="lazy"
      />
    </div>
  );
}
