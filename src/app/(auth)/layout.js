export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-amber-50/30 relative overflow-hidden">
      {/* Geometric pattern background */}
      <div className="absolute inset-0 pattern-geometric opacity-60" />
      
      {/* Decorative elements - Dubai-inspired geometric shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-400/20 to-amber-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-900/10 to-blue-800/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      
      {/* Subtle gold line accents */}
      <div className="absolute top-20 left-10 w-32 h-0.5 bg-gradient-to-r from-amber-400/40 to-transparent transform -rotate-45" />
      <div className="absolute top-40 left-20 w-24 h-0.5 bg-gradient-to-r from-amber-400/30 to-transparent transform -rotate-45" />
      <div className="absolute bottom-20 right-10 w-32 h-0.5 bg-gradient-to-l from-amber-400/40 to-transparent transform rotate-45" />
      <div className="absolute bottom-40 right-20 w-24 h-0.5 bg-gradient-to-l from-amber-400/30 to-transparent transform rotate-45" />
      
      {/* Main content */}
      <div className="relative w-full max-w-md px-4 py-8">
        {children}
      </div>
      
      {/* Bottom decorative bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-30" />
    </div>
  )
}
