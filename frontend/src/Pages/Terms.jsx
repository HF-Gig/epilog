import React from "react";
import { Link } from "react-router-dom";

const Terms = () => {
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
            Terms & Conditions
          </h1>
          <p className="text-sm md:text-base text-base-content/70 mt-3 max-w-xl mx-auto leading-relaxed">
            Please read these terms carefully before using our services.
          </p>
        </div>
      </section>

      {/* 3. Content Layout (The Document) */}
      <main className="max-w-3xl mx-auto py-12 px-6">
        <div className="space-y-10">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-base-content tracking-tight">
              1. Acceptance of Terms
            </h2>
            <p className="text-sm text-base-content/85 leading-relaxed">
              By creating an Epilog account, utilizing our applications, or connecting our Slack app integration, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, you must immediately discontinue use of all Epilog services.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-base-content tracking-tight">
              2. Description of Service
            </h2>
            <p className="text-sm text-base-content/85 leading-relaxed">
              Epilog provides AI-assisted chat-to-wiki synchronization workflows. Our application listens to specified emoji reactions in your Slack channels, parses the related threads, and outputs formatted markdown articles directly to your connected Notion, Confluence, or GitHub workspaces. Services are provided on an "as-is" and "as-available" basis.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-base-content tracking-tight">
              3. User Responsibilities
            </h2>
            <p className="text-sm text-base-content/85 leading-relaxed">
              You are responsible for maintaining the confidentiality and security of your Slack credentials and Notion API workspace keys. You must not use the tool to process unauthorized, sensitive, or illegal data, or violate any third-party privacy rights or service terms.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-base-content tracking-tight">
              4. Fees & Billing
            </h2>
            <p className="text-sm text-base-content/85 leading-relaxed">
              We offer a flat subscription model priced at $12 / user / month. We provide a 14-day free trial requiring no credit card upfront. If you do not cancel before the trial period expires, your workspace will be restricted until billing details are provided. Cancellations take effect at the end of the current billing cycle.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-base-content tracking-tight">
              5. Limitation of Liability
            </h2>
            <p className="text-sm text-base-content/85 leading-relaxed">
              Epilog is not responsible for data loss, service interruptions from integrated third parties (such as Slack, Notion, or Google Gemini), or accidental deletion of documents. We make no warranty that the service will meet your expectations or operate without interruption.
            </p>
          </section>

          {/* 4. Help Alert Banner */}
          <div className="alert alert-info shadow-md bg-info/10 text-info-content border-info/25 my-8 flex items-start sm:items-center gap-3.5 p-4 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-5 h-5 text-info shrink-0 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-xs font-semibold leading-relaxed">
              Need clarification on our terms? Reach out to{" "}
              <a href="mailto:support@epilog.com" className="underline hover:text-info-hover">
                support@epilog.com
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

export default Terms;
