import React from "react";
import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-base-100 font-sans text-base-content selection:bg-primary selection:text-primary-content antialiased">
      
      {/* 1. Header / Navbar */}
      <header className="navbar bg-base-100/80 backdrop-blur-md sticky top-0 z-50 border-b border-base-200 px-4 md:px-8">
        <div className="navbar-start">
          <Link to="/" className="btn btn-ghost gap-2 px-2 text-xl font-extrabold tracking-wider uppercase">
            📝 Epilog
          </Link>
        </div>
        <div className="navbar-end">
          <Link to="/" className="btn btn-ghost btn-sm rounded-btn">
            Back to Home
          </Link>
        </div>
      </header>

      {/* 2. Hero Header Section */}
      <section className="bg-base-200 py-16 px-4 text-center border-b border-base-300/30">
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] uppercase tracking-widest text-base-content/50 font-bold">
            Last Updated: July 2026
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-base-content tracking-tight leading-none">
            Privacy Policy
          </h1>
          <p className="text-sm md:text-base text-base-content/70 mt-3 max-w-xl mx-auto leading-relaxed">
            We take your data security and workspace isolation seriously. Here is how we manage and protect your company knowledge.
          </p>
        </div>
      </section>

      {/* 3. Content Layout (The Document) */}
      <main className="max-w-3xl mx-auto py-12 px-6">
        <div className="space-y-10">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-base-content tracking-tight">
              1. Information We Collect
            </h2>
            <p className="text-sm text-base-content/85 leading-relaxed">
              We temporarily process Slack messages triggered by the <span className="font-bold">📝 emoji reaction</span> solely to generate documentation via Gemini. We do not permanently store your message history on our servers. The context of the discussion is cached briefly in memory and discarded immediately after document compilation is complete.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-base-content tracking-tight">
              2. How We Use Your Data
            </h2>
            <p className="text-sm text-base-content/85 leading-relaxed">
              Processed discussion data is strictly passed to Gemini to summarize technical threads and push them straight to your connected Notion workspace. We do not sell, rent, or utilize your conversation text for training third-party public AI models. All generated insights remain your exclusive intellectual property.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-base-content tracking-tight">
              3. Data Security & Isolation
            </h2>
            <p className="text-sm text-base-content/85 leading-relaxed">
              We utilize strict multi-tenant database isolation to keep Slack OAuth tokens and Notion API credentials highly secure. All keys, credentials, and configuration files are encrypted at rest (AES-256) and in transit (TLS 1.3). Credentials are never shared between workspaces or accessed by unauthorized processes.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-base-content tracking-tight">
              4. Third-Party Services
            </h2>
            <p className="text-sm text-base-content/85 leading-relaxed">
              Epilog integrates with Slack, Notion, and Google Gemini as integrated platform partners to perform authentication, secure storage, and processing tasks. Each partner complies with strict enterprise security standards (SOC 2, ISO 27001) to safeguard your data.
            </p>
          </section>

          {/* 4. Help Alert Banner */}
          <div className="alert alert-info shadow-md bg-info/10 text-info-content border-info/25 my-8 flex items-start sm:items-center gap-3.5 p-4 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-5 h-5 text-info shrink-0 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-xs font-semibold leading-relaxed">
              Have privacy or security questions? Contact our team at{" "}
              <a href="mailto:privacy@epilog.com" className="underline hover:text-info-hover">
                privacy@epilog.com
              </a>
              .
            </div>
          </div>

        </div>
      </main>

      {/* 5. Footer */}
      <footer className="footer footer-center p-6 bg-base-100 text-base-content/50 border-t border-base-200 text-xs">
        <div>
          <p>© {new Date().getFullYear()} Epilog Inc. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default Privacy;
