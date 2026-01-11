import { SiGithub, SiLinkedin, SiGmail } from 'react-icons/si'


export function Footer() {
  const socials = [
    { icon: SiGithub, href: 'https://github.com/jaTorio20/' },
    { icon: SiLinkedin, href: 'https://www.linkedin.com/in/johntorio/' },
    {
      icon: SiGmail,
      href: 'mailto:johnashley132002@gmail.com'
    }
  ];

  return (
    <footer className="relative mt-32 -mb-6">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0b0f1a]" />

      <div className="relative max-w-7xl mx-auto px-6 py-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          
          {/* Identity */}
          <div>
            <h3 className="text-xl font-semibold tracking-wide text-white">
              John Ashley Torio
            </h3>
            <p className="mt-2 text-sm text-gray-400 max-w-sm">
              Personal project focused on learning, building, and pushing ideas forward.
            </p>
          </div>

          {/* Center line */}
          <div className="hidden md:flex justify-center">
            <div className="h-20 w-px bg-linear-to-b from-transparent via-gray-600/40 to-transparent" />
          </div>

          {/* Social */}
          <div className="flex gap-6 md:justify-end">
            {socials.map(({ icon: Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-12 h-12 flex items-center justify-center rounded-xl
                           bg-white/5 border border-white/10
                           hover:border-indigo-500/50
                           hover:bg-white/10
                           transition-all duration-300"
              >
                {/* Directly render the icon component */}
                <Icon className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 transition" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 flex flex-col md:flex-row justify-between items-center
                        text-xs text-gray-500 gap-4">
          <span>© {new Date().getFullYear()} John Ashley Torio</span>
          <span>Designed & built as a personal project</span>
        </div>
      </div>
    </footer>
  );
}
