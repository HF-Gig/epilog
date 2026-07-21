import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

const Home = () => {
  const [activeTab, setActiveTab] = useState("Slack");
  const [searchParams, setSearchParams] = useSearchParams();
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    const success = searchParams.get("success");
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    // 1. If we just completed Slack authentication, save the token
    if (token) {
      localStorage.setItem("session_token", token);
    }

    if (success === "slack_signup" || success === "slack_login") {
      const displayName = name || "User";
      setShowToast(true);

      if (success === "slack_signup") {
        setToastMsg(`Welcome, ${displayName}! Slack signup completed successfully.`);
      } else {
        setToastMsg(`Welcome back, ${displayName}! Logged in successfully.`);
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: displayName,
          email: email || "slack@user.com",
        })
      );
      localStorage.setItem(
        "session",
        JSON.stringify({
          access_token: "slack-oauth-token",
          expires_in: 3600,
        })
      );

      const timer = setTimeout(() => {
        setShowToast(false);
        setSearchParams({});
        window.location.href = "/dashboard";
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="min-h-screen bg-base-100 font-sans text-base-content selection:bg-primary selection:text-primary-content antialiased">
      {showToast && (
        <div
          className="toast toast-top toast-center mt-4"
          style={{ zIndex: 9999 }}
        >
          <div className="alert alert-success shadow-lg border border-success/20 flex gap-3 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6 text-success-content"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-semibold text-success-content">
              {toastMsg}
            </span>
          </div>
        </div>
      )}

      <header className="navbar bg-base-100/80 backdrop-blur-md sticky top-0 z-50 border-b border-base-200 px-4 md:px-8">
        <div className="navbar-start">
          <div className="dropdown lg:hidden">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle"
              aria-label="Open Menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow-2xl border border-base-200"
            >
              <li>
                <a href="#how-it-works" className="py-2">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#integrations" className="py-2">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#pricing" className="py-2">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <a
            href="#"
            className="btn btn-ghost gap-2 px-2 text-xl font-extrabold tracking-wider uppercase bg-clip-text text-transparent bg-linear-to-r from-primary via-secondary to-accent"
          >
            Epilog
          </a>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2 font-medium">
            <li>
              <a
                href="#how-it-works"
                className="hover:text-primary transition-colors py-2 px-4 rounded-btn"
              >
                How It Works
              </a>
            </li>
            <li>
              <a
                href="#integrations"
                className="hover:text-primary transition-colors py-2 px-4 rounded-btn"
              >
                Integrations
              </a>
            </li>
            <li>
              <a
                href="#pricing"
                className="hover:text-primary transition-colors py-2 px-4 rounded-btn"
              >
                Pricing
              </a>
            </li>
          </ul>
        </div>

        <div className="navbar-end">
          <Link
            to="/signup"
            className="btn btn-primary btn-sm rounded-btn shadow-sm hover:scale-[1.02] transition-transform duration-200"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="hero bg-base-200 min-h-[80vh] py-16 md:py-24 px-4 md:px-8 overflow-hidden relative">
        {/* Crisp radial glows for light layout */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="hero-content flex-col lg:flex-row-reverse max-w-7xl mx-auto p-0 gap-12 lg:gap-20">
          {/* Left Side: Floating chaotic chat data transforming into clean document card */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <div className="w-full max-w-lg aspect-square relative flex flex-col justify-between p-6 md:p-8 rounded-3xl bg-base-100 border border-base-200 shadow-2xl overflow-hidden">
              {/* Grid Background Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-size-[14px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

              {/* Chaotic Chat Stream (Bottom Layer) */}
              <div className="space-y-3 z-10 opacity-80 hover:opacity-100 transition-opacity duration-300 mt-2">
                <div className="chat chat-start">
                  <div className="chat-image avatar">
                    <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img
                        src="https://picsum.photos/id/64/80/80"
                        alt="Sarah avatar"
                      />
                    </div>
                  </div>
                  <div className="chat-header text-xs opacity-60 mb-1">
                    sarah_eng{" "}
                    <time className="text-[10px] opacity-50">10:42 AM</time>
                  </div>
                  <div className="chat-bubble bg-base-200 text-base-content text-xs py-1.5 px-3 border border-base-300/30">
                    Hey, to deploy the staging server we have to run{" "}
                    <code className="bg-base-300 text-base-content px-1.5 py-0.5 rounded text-[11px]">
                      ./deploy.sh --env staging --force-refresh
                    </code>
                    . Don't forget that!
                  </div>
                </div>

                <div className="chat chat-end">
                  <div className="chat-image avatar">
                    <div className="w-8 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
                      <img
                        src="https://picsum.photos/id/91/80/80"
                        alt="Marcus avatar"
                      />
                    </div>
                  </div>
                  <div className="chat-header text-xs opacity-60 mb-1">
                    marcus_devops{" "}
                    <time className="text-[10px] opacity-50">10:44 AM</time>
                  </div>
                  <div className="chat-bubble bg-base-300 text-base-content text-xs py-1.5 px-3 border border-base-300/30">
                    Got it! Wait, we also need to configure{" "}
                    <code className="bg-base-200 text-base-content px-1.5 py-0.5 rounded text-[11px]">
                      PORT=8080
                    </code>{" "}
                    inside the environment setup config.
                  </div>
                </div>
              </div>

              {/* Transition Layer: Emoji floating upwards */}
              <div className="flex flex-col items-center justify-center my-6 z-10 relative">
                {/* Glowing vertical path */}
                <div className="absolute h-24 w-0.5 bg-linear-to-b from-primary/60 via-accent/20 to-transparent bottom-0" />

                {/* Trigger emoji container */}
                <div className="animate-float flex items-center justify-center p-3 bg-primary/10 border border-primary/20 rounded-full shadow-md z-20 backdrop-blur-md">
                  <span className="text-2xl">📝</span>
                </div>
                <div className="text-xs text-primary font-bold tracking-widest uppercase mt-3 animate-pulse">
                  Processing Thread...
                </div>
              </div>

              {/* Structured Wiki Page (Top Layer) */}
              <div className="animate-float-slow z-10 w-full">
                <div className="mockup-window border border-base-300 bg-base-100 shadow-2xl">
                  <div className="px-5 py-4 bg-base-100 border-t border-base-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-primary tracking-wider uppercase">
                        📄 epilog-wiki / deployment
                      </span>
                      <div className="badge badge-success badge-xs gap-1 py-1.5 px-2 rounded-full">
                        <svg
                          className="w-2.5 h-2.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Synced
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-base-content">
                      Staging Server Deployment Guide
                    </h4>
                    <p className="text-[11px] text-base-content/60">
                      Step-by-step instructions compiled from DevOps chat
                      thread.
                    </p>
                    <div className="divider my-1 opacity-20" />
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-accent">
                        Deployment Command:
                      </span>
                      <pre className="text-[10px] bg-base-200 p-2 rounded border border-base-200 font-mono text-secondary-content">
                        ./deploy.sh --env staging --force-refresh
                      </pre>
                    </div>
                    <div className="space-y-1 text-[10px] text-base-content/85">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-primary" />
                        <span>
                          Requires config value{" "}
                          <code className="bg-base-200 px-1 py-0.5 rounded text-accent">
                            PORT=8080
                          </code>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Headlines and CTAs */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-base-content">
              Stop Answering the Same
              <span className="block mt-2 bg-clip-text text-transparent bg-linear-to-r from-primary via-secondary to-accent">
                Question Twice.
              </span>
            </h1>
            <p className="py-6 text-base sm:text-lg text-base-content/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Epilog turns valuable, scattered Slack threads into structured,
              permanent company wikis instantly with a single{" "}
              <span className="inline-block hover:scale-125 transition-transform duration-200">
                📝
              </span>{" "}
              emoji reaction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-4">
              <Link
                to="/login"
                className="btn btn-primary btn-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 gap-2"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M5.042 15.165a2.528 2.528 0 0 1-1.52-2.31 2.528 2.528 0 0 1 1.52-2.309l12.062-5.46a2.53 2.53 0 0 1 3.438 2.31v10.92a2.528 2.528 0 0 1-3.438 2.31l-12.062-5.461zm1.258-2.31l10.8 4.887V6.262l-10.8 4.888v1.705z" />
                </svg>
                Start Free (Sign up with Slack)
              </Link>
              <a
                href="#how-it-works"
                className="btn btn-outline btn-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Book a Demo
              </a>
            </div>
            {/* Quick trust metrics */}
            <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-xs text-base-content/50">
              <div className="flex items-center gap-1">
                <span>⚡ Setup in 2 mins</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🔒 Enterprise Grade Encryption</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🧠 Self-cleaning Context</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section
        id="how-it-works"
        className="bg-base-100 py-20 px-4 md:px-8 border-t border-base-200 relative"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="badge badge-outline badge-primary font-bold tracking-wider py-3 px-4 rounded-full uppercase text-xs">
              Workflow Mechanics
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-base-content">
              Turn Conversations into Knowledge
            </h2>
            <p className="text-base-content/75 text-sm md:text-base max-w-xl mx-auto">
              From fleeting brainstorms to permanent documentation in seconds.
              Here's exactly how the gravity shift works.
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {/* Step 1: The Trigger */}
            <div className="card bg-base-100 border border-base-200 shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300">
              <div className="card-body gap-4">
                {/* Visual Representation */}
                <div className="w-full h-36 bg-base-200/50 rounded-box border border-base-200 flex items-center justify-center p-4 relative overflow-hidden">
                  <div className="w-full bg-base-100 rounded-lg p-3 border border-base-200 shadow-sm relative">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                        S
                      </div>
                      <span className="text-[10px] font-bold opacity-60">
                        sophie_dev
                      </span>
                    </div>
                    <p className="text-[11px] text-base-content/85">
                      "To spin up local Redis run{" "}
                      <code className="bg-base-200 px-1 py-0.5 rounded text-[10px]">
                        docker run -p 6379:6379 redis
                      </code>
                      "
                    </p>
                    {/* Reaction badge */}
                    <div className="absolute -bottom-2 -right-1 bg-primary border border-primary-content/20 text-primary-content text-[10px] font-bold py-1 px-2.5 rounded-full flex items-center gap-1 shadow-md scale-105">
                      <span>📝</span>
                      <span>1</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="card-title text-lg font-bold flex items-center gap-2 text-base-content">
                    <span className="badge badge-primary badge-sm rounded-full">
                      1
                    </span>
                    The Trigger
                  </h3>
                  <p className="text-xs text-base-content/70 leading-relaxed">
                    Teams add a{" "}
                    <span className="font-bold text-primary">📝 reaction</span>{" "}
                    to any Slack message or thread. Epilog captures the full
                    conversational context instantly.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: AI Processing */}
            <div className="card bg-base-100 border border-base-200 shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300">
              <div className="card-body gap-4">
                {/* Visual Representation */}
                <div className="w-full h-36 bg-base-200/50 rounded-box border border-base-200 flex items-center justify-center p-4 relative overflow-hidden">
                  <div className="w-full space-y-2 bg-base-100/90 rounded-lg p-3 border border-primary/20 shadow-sm relative">
                    <div className="flex items-center justify-between border-b border-base-200 pb-1">
                      <span className="text-[9px] font-mono text-primary font-bold">
                        🧠 AI TRANSFORMATION
                      </span>
                      <span className="loading loading-sparkles loading-xs text-accent"></span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 w-3/4 bg-base-content/20 rounded" />
                      <div className="h-1.5 w-1/2 bg-base-content/10 rounded" />
                    </div>
                    <div className="bg-base-200 p-1.5 rounded font-mono text-[9px] text-accent-content border border-base-300/35">
                      docker run -p 6379:6379 redis
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="card-title text-lg font-bold flex items-center gap-2 text-base-content">
                    <span className="badge badge-primary badge-sm rounded-full">
                      2
                    </span>
                    AI Processing
                  </h3>
                  <p className="text-xs text-base-content/70 leading-relaxed">
                    Epilog strips the noise, formats code block layouts, and
                    auto-generates a clear technical title.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3: Instant Wiki Sync */}
            <div className="card bg-base-100 border border-base-200 shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300">
              <div className="card-body gap-4">
                {/* Visual Representation */}
                <div className="w-full h-36 bg-base-200/50 rounded-box border border-base-200 flex items-center justify-center p-4 relative overflow-hidden">
                  <div className="grid grid-cols-3 gap-2 w-full">
                    {/* Notion mock */}
                    <div className="bg-base-100 p-2 rounded-lg border border-base-200 shadow-sm flex flex-col items-center justify-center gap-1.5">
                      <span className="text-lg font-bold">N</span>
                      <span className="text-[9px] font-semibold text-base-content/60">
                        Notion
                      </span>
                      <span className="badge badge-success badge-xs py-1 rounded">
                        Ok
                      </span>
                    </div>
                    {/* GitHub mock */}
                    <div className="bg-base-100 p-2 rounded-lg border border-base-200 shadow-sm flex flex-col items-center justify-center gap-1.5">
                      <svg
                        className="w-5 h-5 fill-current text-base-content"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
                      <span className="text-[9px] font-semibold text-base-content/60">
                        GitHub
                      </span>
                      <span className="badge badge-success badge-xs py-1 rounded">
                        Ok
                      </span>
                    </div>
                    {/* Confluence mock */}
                    <div className="bg-base-100 p-2 rounded-lg border border-base-200 shadow-sm flex flex-col items-center justify-center gap-1.5">
                      <span className="text-lg font-bold text-info">C</span>
                      <span className="text-[9px] font-semibold text-base-content/60">
                        Wiki
                      </span>
                      <span className="badge badge-success badge-xs py-1 rounded">
                        Ok
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="card-title text-lg font-bold flex items-center gap-2 text-base-content">
                    <span className="badge badge-primary badge-sm rounded-full">
                      3
                    </span>
                    Instant Wiki Sync
                  </h3>
                  <p className="text-xs text-base-content/70 leading-relaxed">
                    The polished page is pushed directly to your connected
                    Notion, Confluence, or GitHub workspace automatically. No
                    copy-pasting, zero friction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Integrations Showcase Tab Menu */}
      <section
        id="integrations"
        className="bg-base-200 py-16 px-4 md:px-8 border-y border-base-200"
      >
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-3">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-base-content">
              Pushes to Your Existing Knowledge Stack
            </h2>
            <p className="text-xs md:text-sm text-base-content/70 max-w-md mx-auto">
              Epilog sits quietly in the background and interfaces seamlessly
              with the tools your engineering and product teams already live in.
            </p>
          </div>

          {/* DaisyUI Tabs */}
          <div className="tabs tabs-box justify-center bg-base-300 p-1.5 rounded-xl max-w-sm mx-auto">
            {["Slack", "Notion", "GitHub", "Confluence"].map((tab) => (
              <button
                key={tab}
                className={`tab tab-sm md:tab-md transition-all duration-200 ${
                  activeTab === tab
                    ? "tab-active bg-primary text-primary-content font-bold"
                    : "text-base-content/70"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content Display */}
          <div className="bg-base-100 border border-base-200 rounded-2xl p-6 md:p-8 shadow-xl text-left min-h-40 flex items-center">
            {activeTab === "Slack" && (
              <div className="flex flex-col md:flex-row items-center gap-6 w-full">
                <div className="p-4 bg-primary/10 rounded-full border border-primary/20">
                  <span className="text-3xl">💬</span>
                </div>
                <div className="space-y-2 text-center md:text-left flex-1">
                  <h4 className="text-lg font-bold text-base-content">
                    Two-Way Slack App Integration
                  </h4>
                  <p className="text-xs text-base-content/70 leading-relaxed">
                    Simply install our verified Slack App, and you are ready.
                    Epilog monitors emoji reactions, maps active threads, parses
                    snippets, and communicates sync logs right back to the
                    original author via thread messages.
                  </p>
                </div>
              </div>
            )}
            {activeTab === "Notion" && (
              <div className="flex flex-col md:flex-row items-center gap-6 w-full">
                <div className="p-4 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                  <span className="text-3xl">📔</span>
                </div>
                <div className="space-y-2 text-center md:text-left flex-1">
                  <h4 className="text-lg font-bold text-base-content">
                    Rich Document Synced with Notion API
                  </h4>
                  <p className="text-xs text-base-content/70 leading-relaxed">
                    Choose a target database or a parent page in Notion. Epilog
                    dynamically creates new sub-pages complete with formatted
                    headings, callout boxes for warnings/notes, and clean block
                    dividers based on the conversation flow.
                  </p>
                </div>
              </div>
            )}
            {activeTab === "GitHub" && (
              <div className="flex flex-col md:flex-row items-center gap-6 w-full">
                <div className="p-4 bg-base-200 rounded-full border border-base-300">
                  <span className="text-3xl">🐙</span>
                </div>
                <div className="space-y-2 text-center md:text-left flex-1">
                  <h4 className="text-lg font-bold text-base-content">
                    Auto-Commits & Pull Requests on GitHub
                  </h4>
                  <p className="text-xs text-base-content/70 leading-relaxed">
                    Keep your documentation close to your code repository.
                    Epilog can auto-commit Markdown files to a specific
                    directory (like{" "}
                    <code className="bg-base-200 px-1 py-0.5 rounded text-[11px]">
                      docs/wiki
                    </code>
                    ) or open clean, reviewable PRs.
                  </p>
                </div>
              </div>
            )}
            {activeTab === "Confluence" && (
              <div className="flex flex-col md:flex-row items-center gap-6 w-full">
                <div className="p-4 bg-info/10 rounded-full border border-info/20">
                  <span className="text-3xl">📘</span>
                </div>
                <div className="space-y-2 text-center md:text-left flex-1">
                  <h4 className="text-lg font-bold text-base-content">
                    Confluence Cloud Sync & Organization
                  </h4>
                  <p className="text-xs text-base-content/70 leading-relaxed">
                    Integrate directly into Confluence Cloud spaces.
                    Automatically publishes structured content under custom
                    folders based on Slack channel topics, preserving historical
                    author details and references.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Pricing Tier Section */}
      <section
        id="pricing"
        className="bg-base-200 py-24 px-4 md:px-8 relative overflow-hidden"
      >
        {/* Decorative Grid Lines for clean structure */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-20%,rgba(120,119,198,0.08),transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Title */}
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <div className="badge badge-accent font-bold tracking-wider py-3 px-4 rounded-full uppercase text-xs">
              Simple Pricing
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-base-content">
              One Flat Plan. Effortless Scale.
            </h2>
            <p className="text-base-content/70 text-xs md:text-sm max-w-md mx-auto">
              Everything included. Start with a 14-day free trial. No credit
              card required. Up and running in 2 minutes.
            </p>
          </div>

          {/* Pricing Card */}
          <div className="card bg-primary text-primary-content max-w-md mx-auto shadow-2xl relative border border-primary-focus p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-primary/10">
            {/* Corner Badge */}
            <div className="absolute top-0 right-0">
              <span className="badge badge-accent font-extrabold tracking-widest uppercase text-[9px] px-3.5 py-2.5 rounded-bl-xl rounded-tr-none">
                POPULAR
              </span>
            </div>

            <div className="card-body p-0 gap-6">
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-widest opacity-80">
                  Standard Plan
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-5xl font-extrabold tracking-tight">
                    $12
                  </span>
                  <span className="text-sm font-semibold opacity-85">
                    / user / month
                  </span>
                </div>
                <p className="text-xs opacity-75">
                  Save hours of copy-pasting and manual writing every week.
                </p>
              </div>

              <div className="divider divider-neutral opacity-20 my-0" />

              {/* Features list */}
              <ul className="space-y-3.5 text-sm">
                {[
                  "Unlimited document syncs",
                  "AI-powered automatic formatting",
                  "Support for Notion & GitHub",
                  "Secure tenant isolation",
                  "Native Slack integration with notifications",
                  "Historical channel context parsing",
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-accent shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-xs font-medium opacity-90">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="card-actions mt-2">
                <Link
                  to="/login"
                  className="btn bg-base-100 text-primary border-none w-full font-bold shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 text-center flex items-center justify-center"
                >
                  Start Your 14-Day Free Trial
                </Link>
              </div>

              <p className="text-center text-[10px] opacity-75 mt-2">
                No credit card required. Cancel anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="footer bg-base-200 text-base-content border-t border-base-300 py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Company Info */}
          <div className="flex flex-col gap-3 md:col-span-1 text-left">
            <div className="flex items-center gap-2 text-lg font-black tracking-wider uppercase bg-clip-text text-transparent bg-linear-to-r from-primary via-secondary to-accent">
              Epilog
            </div>
            <p className="text-xs text-base-content/60 leading-relaxed max-w-xs">
              Epilog automates your engineering and operations wiki compilation,
              stripping the friction out of technical documentation.
            </p>
            <span className="text-[11px] text-base-content/40 mt-2">
              © {new Date().getFullYear()} Epilog Inc. All rights reserved.
            </span>
          </div>

          {/* Product links */}
          <div className="flex flex-col gap-2 text-left">
            <span className="footer-title text-xs font-bold text-base-content tracking-wider uppercase">
              Product
            </span>
            <a
              href="#how-it-works"
              className="link link-hover text-xs text-base-content/70"
            >
              How it Works
            </a>
            <a
              href="#integrations"
              className="link link-hover text-xs text-base-content/70"
            >
              Integrations
            </a>
            <a
              href="#pricing"
              className="link link-hover text-xs text-base-content/70"
            >
              Pricing
            </a>
            <a
              href="#"
              className="link link-hover text-xs text-base-content/70"
            >
              Changelog
            </a>
          </div>

          {/* Support links */}
          <div className="flex flex-col gap-2 text-left">
            <span className="footer-title text-xs font-bold text-base-content tracking-wider uppercase">
              Support
            </span>
            <a
              href="#"
              className="link link-hover text-xs text-base-content/70"
            >
              Help Center
            </a>
            <a
              href="#"
              className="link link-hover text-xs text-base-content/70"
            >
              Security Audits
            </a>
            <a
              href="#"
              className="link link-hover text-xs text-base-content/70"
            >
              Developer Docs
            </a>
            <a
              href="#"
              className="link link-hover text-xs text-base-content/70"
            >
              Contact Sales
            </a>
          </div>

          {/* Legal links */}
          <div className="flex flex-col gap-2 text-left">
            <span className="footer-title text-xs font-bold text-base-content tracking-wider uppercase">
              Legal
            </span>
            <a
              href="#"
              className="link link-hover text-xs text-base-content/70"
            >
              Terms of Use
            </a>
            <a
              href="#"
              className="link link-hover text-xs text-base-content/70"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="link link-hover text-xs text-base-content/70"
            >
              GDPR Compliance
            </a>
            <a
              href="#"
              className="link link-hover text-xs text-base-content/70"
            >
              Cookie Settings
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
