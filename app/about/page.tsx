import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <span className="text-white font-bold text-4xl">M</span>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white animate-pulse dark:border-gray-900"></div>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 dark:text-white">
            Melvin <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Peralta</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 dark:text-white">
            22 • East Coast raised • Solo developer building dope things with tech
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-white">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>AI-Powered Tools</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Full-Stack Development</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Solo Operator</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-20">
          {/* My Story */}
          <section>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 dark:text-white">My Story</h2>
                <div className="text-gray-700 leading-relaxed space-y-6 dark:text-white text-lg">
                  <p>
                    Yo, I'm Melvin Peralta — 22, East Coast raised, and fully immersed in the grind of building dope things with tech. 
                    I don't come from a big team or some VC-funded startup. It's just me, a laptop, and my mind constantly firing off new ideas. 
                    I work solo, but I move like a squad — because with the right tools, mindset, and vision, you don't need a crowd to make noise.
                  </p>
                  <p>
                    By day, I'm the brains behind multiple apps — think AI-powered social tools, caption generators, lead management systems, 
                    and platforms that actually do something for people. Most of my projects are built using tools like Supabase, Firebase, 
                    Stripe, and React. I'm deep into automating workflows, creating slick UI/UX, and making sure what I build actually works — 
                    no fluff, no fake promises.
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 lg:p-12 dark:from-gray-800 dark:to-gray-700">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center dark:bg-blue-900">
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Solo Developer</h3>
                      <p className="text-gray-600 dark:text-white">Building like a squad, moving like a team</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center dark:bg-green-900">
                      <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">AI-First Approach</h3>
                      <p className="text-gray-600 dark:text-white">Mastermind with AI as my teammate</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center dark:bg-purple-900">
                      <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Workflow Automation</h3>
                      <p className="text-gray-600 dark:text-white">If I can automate it, it's already done</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* My Approach */}
          <section>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center dark:text-white">My Approach</h2>
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8 lg:p-12 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
              <div className="text-gray-700 leading-relaxed space-y-6 dark:text-white text-lg">
                <p>
                  I rely heavily on AI not because I'm lazy, but because I know how to mastermind. AI is my teammate, and I use it to execute, 
                  scale, and stretch ideas from concept to live product faster than most teams can run a sprint. If I can automate it, I will. 
                  If I can optimize it, it's already done.
                </p>
                <p>
                  I don't play with things I'm not passionate about. If it's not tech, culture, or something that makes people's lives easier 
                  or more creative — I'm out. Real estate? Nah. Agriculture? Respectfully, no. But give me a social media challenge, a way to 
                  remix how people create or consume content, or a niche market that just needs a smarter tool — and I'll be on it.
                </p>
              </div>
            </div>
          </section>

          {/* My Philosophy */}
          <section>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 dark:text-white">My Philosophy</h2>
                <div className="text-gray-700 leading-relaxed space-y-6 dark:text-white text-lg">
                  <p>
                    Outside of the code, I'm just a real one. I've seen enough to value loyalty, cut off distractions, and move with purpose. 
                    I've dealt with my fair share of people who move shady — and I don't let that shake me. I block what doesn't serve me and keep building. 
                    Communication matters to me — in my life and in my apps. I believe in clarity, honesty, and keeping things solid.
                  </p>
                  <p>
                    If I'm not building something, I'm probably thinking about the next thing to build. I'm into design, UI, clever branding, 
                    and making ideas pop. I know how to vibe, I know how to execute, and I'm always learning something new — whether it's fixing 
                    an error in my .env file at 2 AM or plotting a caption generator that actually understands trends.
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 lg:p-12 text-white">
                <h3 className="text-2xl font-bold mb-6">The Mindset</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300">Value loyalty, cut off distractions, move with purpose</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300">Block what doesn't serve you and keep building</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300">Clarity, honesty, and keeping things solid</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300">Always learning, always executing</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* What I Build */}
          <section>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center dark:text-white">What I Build</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 dark:bg-blue-900">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 dark:text-white">AI-Powered Tools</h3>
                <p className="text-gray-600 mb-4 dark:text-white">Social tools, caption generators, and smart automation that actually understand what users need.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm dark:bg-blue-900 dark:text-blue-200">OpenAI API</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm dark:bg-blue-900 dark:text-blue-200">LangChain</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6 dark:bg-green-900">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 dark:text-white">Lead Management</h3>
                <p className="text-gray-600 mb-4 dark:text-white">Systems that actually work and scale, built for real businesses with real needs.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm dark:bg-green-900 dark:text-green-200">CRM</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm dark:bg-green-900 dark:text-green-200">Automation</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 dark:bg-purple-900">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 dark:text-white">Slick UI/UX</h3>
                <p className="text-gray-600 mb-4 dark:text-white">Design that pops and actually works. No fluff, just clean, functional interfaces.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm dark:bg-purple-900 dark:text-purple-200">React</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm dark:bg-purple-900 dark:text-purple-200">Tailwind</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6 dark:bg-orange-900">
                  <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 dark:text-white">Workflow Automation</h3>
                <p className="text-gray-600 mb-4 dark:text-white">Making things faster and smarter. If it can be automated, I'll find a way.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm dark:bg-orange-900 dark:text-orange-200">Zapier</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm dark:bg-orange-900 dark:text-orange-200">Webhooks</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6 dark:bg-red-900">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 dark:text-white">Mobile Apps</h3>
                <p className="text-gray-600 mb-4 dark:text-white">Native and cross-platform solutions that users actually want to use.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm dark:bg-red-900 dark:text-red-200">React Native</span>
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm dark:bg-red-900 dark:text-red-200">Expo</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 dark:bg-indigo-900">
                  <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 dark:text-white">Analytics & Growth</h3>
                <p className="text-gray-600 mb-4 dark:text-white">Data-driven insights that actually help businesses grow and scale.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm dark:bg-indigo-900 dark:text-indigo-200">Analytics</span>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm dark:bg-indigo-900 dark:text-indigo-200">Growth</span>
                </div>
              </div>
            </div>
          </section>

          {/* Tech Stack */}
          <section>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center dark:text-white">Tech Stack</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 dark:bg-blue-900">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">React</h3>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 dark:bg-green-900">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Supabase</h3>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4 dark:bg-orange-900">
                  <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Firebase</h3>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 dark:bg-purple-900">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Stripe</h3>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 dark:bg-blue-900">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">AI/ML</h3>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4 dark:bg-indigo-900">
                  <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">TypeScript</h3>
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 lg:p-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready to Build Something Dope?</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Let's connect and see how we can bring your ideas to life. Whether it's AI tools, automation, or just something that makes people's lives easier.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact" 
                  className="bg-white text-blue-600 font-semibold py-4 px-8 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  Get In Touch
                </a>
                <a 
                  href="/posts" 
                  className="border-2 border-white text-white font-semibold py-4 px-8 rounded-xl hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Check Out My Work
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
} 