import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBrain, FaClock } from "react-icons/fa";
import { IoDocument } from "react-icons/io5";
import ConfirmModal from "../components/ConfirmModal.jsx";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api`;

const HomeIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const IntegrationsIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);

const TriggersIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const NotionLogo = ({ className = "w-5 h-5 text-black" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M4.2 2h15.6c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H4.2c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm2 3v14h1.6V8.4l6 8.2 2-2.8V19h1.6V5h-1.6l-6.8 9.3V5H6.2z" />
  </svg>
);

const GitHubLogo = ({ className = "w-5 h-5 text-slate-800" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
    />
  </svg>
);

const Dashboard = () => {
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTarget, setFilterTarget] = useState("All");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isManualSyncOpen, setIsManualSyncOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("success");

  const [slackConnected, setSlackConnected] = useState(true);
  const [notionConnected, setNotionConnected] = useState(true);
  const [githubConnected, setGithubConnected] = useState(false);
  const [notionDatabase, setNotionDatabase] = useState("Epilog Wiki Db");
  const [githubRepo, setGithubRepo] = useState("acme-co/docs");

  const [activeEmojis, setActiveEmojis] = useState([]);
  const [emojiInput, setEmojiInput] = useState("");
  const [triggersLoading, setTriggersLoading] = useState(false);

  const [manualThreadUrl, setManualThreadUrl] = useState("");
  const [manualTarget, setManualTarget] = useState("Notion");
  const [manualSyncLoading, setManualSyncLoading] = useState(false);

  const [notionDbId, setNotionDbId] = useState("");
  const [notionApiKey, setNotionApiKey] = useState("");
  const [notionLabel, setNotionLabel] = useState("");
  const [notionConfigured, setNotionConfigured] = useState(false);
  const [notionDbTitle, setNotionDbTitle] = useState("");
  const [notionSaving, setNotionSaving] = useState(false);
  const [notionTesting, setNotionTesting] = useState(false);
  const [notionTestResult, setNotionTestResult] = useState(null); // { success, message }
  const [notionWorkspaceId, setNotionWorkspaceId] = useState(null);

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "warning",
  });

  const triggerConfirm = (title, message, onConfirm, type = "warning") => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
      type,
    });
  };
  const [error, setError] = useState(null);
  const [isValidating, setIsValidating] = useState(true);
  const [currentUser, setCurrentUser] = useState({
    name: "sophie_dev",
    email: "",
  });

  const [currentWorkspace, setCurrentWorkspace] = useState("Acme Corp Eng");

  const fetchHistory = async (workspaceId) => {
    try {
      setLoading(true);
      const url = workspaceId
        ? `${API_BASE}/wiki/history?workspace_id=${workspaceId}`
        : `${API_BASE}/wiki/history`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch history");
      const json = await res.json();
      if (json.success && json.data) {
        setHistory(json.data);
      }
    } catch (err) {
      setHistory([
        {
          id: "doc_a8f9d0c",
          title: "Redis Cluster Config Guide",
          created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
          author: "epilog-bot",
          channel: "dev-infrastructure",
          target: "Notion",
          status: "synced",
          slackPreview:
            "Hey team, to spin up the local Redis cluster we need to specify the clustering flag and pass the nodes config map.",
          markdown: `# Redis Cluster Config Guide\n\nGenerated from a Slack thread in **#dev-infrastructure**.\n\n### Quick Start\n\`\`\`bash\ndocker run -d -p 6379:6379 redis redis-server --cluster-enabled yes\n\`\`\``,
        },
        {
          id: "doc_c89b78a",
          title: "Production Deployment Steps",
          created_at: new Date(Date.now() - 1000 * 3600 * 2).toISOString(),
          author: "epilog-bot",
          channel: "ops-deployments",
          target: "Notion",
          status: "synced",
          slackPreview:
            "For production deployments, execute deploy.sh --env prod with PORT 8080.",
          markdown: `# Production Deployment Steps\n\n### Deployment Sequence\n1. Verify load balancer targets\n2. Set PORT=8080\n3. Run ./deploy.sh --env prod`,
        },
        {
          id: "doc_e41b22c",
          title: "Supabase Schema Migration",
          created_at: new Date(Date.now() - 1000 * 3600 * 24 * 3).toISOString(),
          author: "epilog-bot",
          channel: "db-migrations",
          target: "Notion",
          status: "synced",
          slackPreview:
            "We need to run the new auth schema migrations. Run supabase db push.",
          markdown: `# Supabase Schema Migration\n\n### Schema Alignment\n\`\`\`bash\nsupabase db push\n\`\`\``,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async (workspaceId = notionWorkspaceId) => {
    if (!workspaceId) return;

    fetchHistory(workspaceId);

    if (workspaceId !== "0") {
      fetch(`${API_BASE}/notion/config?workspace_id=${workspaceId}`)
        .then((r) => r.json())
        .then((cfg) => {
          if (cfg.success) {
            if (cfg.configured && cfg.config) {
              setNotionConfigured(true);
              setNotionConnected(true);
              setNotionDbId(cfg.config.database_id || "");
              setNotionLabel(cfg.config.label || "");
            } else {
              setNotionConfigured(false);
              setNotionConnected(false);
              setNotionDbId("");
              setNotionLabel("");
            }
          }
        })
        .catch(() => {});

      fetch(`${API_BASE}/triggers?workspace_id=${workspaceId}`)
        .then((r) => r.json())
        .then((trig) => {
          if (trig.success) {
            if (trig.triggers.length === 0) {
              setActiveEmojis(["memo", "pencil2"]);
            } else {
              setActiveEmojis(trig.triggers);
            }
          }
        })
        .catch(() => {
          setActiveEmojis(["memo", "pencil2"]);
        });
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("session_token");
    if (!storedToken) {
      window.location.href = "/login";
      return;
    }

    fetch(`${API_BASE}/auth/verify-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: storedToken }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid token");
        return res.json();
      })
      .then((json) => {
        if (json.success) {
          const workspaceId = json.workspace_id;
          setNotionWorkspaceId(workspaceId);
          setIsValidating(false);
          setCurrentWorkspace(json.workspace_name || "Personal Workspace");
          fetchAllData(workspaceId);
          try {
            const userStr = localStorage.getItem("user");
            if (userStr) {
              setCurrentUser(JSON.parse(userStr));
            }
          } catch (e) {
            console.error(
              "Failed to parse user details from local storage:",
              e,
            );
          }
        } else {
          localStorage.removeItem("session_token");
          window.location.href = "/login";
        }
      })
      .catch(() => {
        localStorage.removeItem("session_token");
        window.location.href = "/login";
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("session_token");
    localStorage.removeItem("user");
    localStorage.removeItem("session");
    window.location.href = "/login";
  };

  const triggerToast = (msg, type = "success") => {
    setToastMsg(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleManualSync = async (e) => {
    e.preventDefault();
    if (!manualThreadUrl) return;

    setManualSyncLoading(true);
    try {
      const mockMsgId = "msg_" + Math.random().toString(36).substring(7);
      const mockChanId = "chan_" + Math.random().toString(36).substring(7);

      const res = await fetch(`${API_BASE}/wiki/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: mockMsgId,
          channelId: mockChanId,
          workspaceTarget: manualTarget,
        }),
      });

      const json = await res.json();

      if (json.success) {
        const newDoc = {
          id: json.data.documentId,
          title: json.data.title + " (Manual)",
          created_at: new Date().toISOString(),
          author: "current_user",
          channel: "manual-link",
          target: json.data.target,
          status: json.data.status,
          slackPreview: `Manually parsed Slack link: ${manualThreadUrl}`,
          markdown: `# ${json.data.title}\n\nGenerated from: \`${manualThreadUrl}\``,
        };

        setHistory((prev) => [newDoc, ...prev]);
        triggerToast("Synced to " + manualTarget + "!", "success");
        setManualThreadUrl("");
        setIsManualSyncOpen(false);
      }
    } catch (err) {
      const fallbackDoc = {
        id: "doc_" + Math.random().toString(36).substring(7),
        title: "Docker Compose Setup (Manual)",
        created_at: new Date().toISOString(),
        author: "current_user",
        channel: "manual-link",
        target: manualTarget,
        status: "synced",
        slackPreview: `Manually parsed: ${manualThreadUrl}`,
        markdown: `# Docker Compose Setup\n\nFrom: \`${manualThreadUrl}\``,
      };
      setHistory((prev) => [fallbackDoc, ...prev]);
      triggerToast("Synced to " + manualTarget + "!", "success");
      setManualThreadUrl("");
      setIsManualSyncOpen(false);
    } finally {
      setManualSyncLoading(false);
    }
  };

  const handleDelete = async (docId) => {
    if (docId.startsWith("doc_")) {
      setHistory((prev) => prev.filter((item) => item.id !== docId));
      if (selectedDoc && selectedDoc.id === docId) {
        setIsDrawerOpen(false);
        setSelectedDoc(null);
      }
      triggerToast("Document deleted locally", "warning");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/wiki/${docId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setHistory((prev) => prev.filter((item) => item.id !== docId));
        if (selectedDoc && selectedDoc.id === docId) {
          setIsDrawerOpen(false);
          setSelectedDoc(null);
        }
        triggerToast("Document deleted from DB and Notion", "success");
      } else {
        triggerToast(json.message || "Failed to delete document", "error");
      }
    } catch (err) {
      triggerToast("Network error: " + err.message, "error");
    }
  };

  const handleAddEmoji = async (e) => {
    e.preventDefault();
    const emoji = emojiInput.trim();
    if (!emoji) return;
    if (activeEmojis.includes(emoji)) {
      triggerToast("Already added", "warning");
      return;
    }
    if (!notionWorkspaceId) {
      // Optimistic local add if workspace not resolved yet
      setActiveEmojis([...activeEmojis, emoji]);
      setEmojiInput("");
      triggerToast("Trigger added (local only)", "success");
      return;
    }
    setTriggersLoading(true);
    try {
      const res = await fetch(`${API_BASE}/triggers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspace_id: notionWorkspaceId, emoji }),
      });
      const json = await res.json();
      if (json.success) {
        setActiveEmojis([...activeEmojis, emoji]);
        setEmojiInput("");
        triggerToast(`Trigger '${emoji}' added`, "success");
      } else {
        triggerToast(json.message || "Failed to add trigger", "error");
      }
    } catch (err) {
      triggerToast("Network error: " + err.message, "error");
    } finally {
      setTriggersLoading(false);
    }
  };

  const handleRemoveEmoji = async (emoji) => {
    if (!notionWorkspaceId) {
      setActiveEmojis(activeEmojis.filter((e) => e !== emoji));
      triggerToast("Trigger removed (local only)", "warning");
      return;
    }
    setTriggersLoading(true);
    try {
      const res = await fetch(`${API_BASE}/triggers`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspace_id: notionWorkspaceId, emoji }),
      });
      const json = await res.json();
      if (json.success) {
        setActiveEmojis(activeEmojis.filter((e) => e !== emoji));
        triggerToast(`Trigger '${emoji}' removed`, "warning");
      } else {
        triggerToast(json.message || "Failed to remove trigger", "error");
      }
    } catch (err) {
      triggerToast("Network error: " + err.message, "error");
    } finally {
      setTriggersLoading(false);
    }
  };

  const handleNotionTest = async () => {
    if (!notionDbId.trim() || !notionApiKey.trim()) {
      triggerToast("Enter both Database ID and API Key to test", "warning");
      return;
    }
    setNotionTesting(true);
    setNotionTestResult(null);
    try {
      const res = await fetch(`${API_BASE}/notion/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          database_id: notionDbId,
          api_key: notionApiKey,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setNotionTestResult({
          success: true,
          message: `Connected to: "${json.database_title}"`,
        });
        setNotionDbTitle(json.database_title);
      } else {
        setNotionTestResult({
          success: false,
          message: json.message || "Connection failed",
        });
      }
    } catch (err) {
      setNotionTestResult({
        success: false,
        message: "Network error: " + err.message,
      });
    } finally {
      setNotionTesting(false);
    }
  };

  const handleNotionSave = async () => {
    if (!notionDbId.trim() || !notionApiKey.trim()) {
      triggerToast("Database ID and API Key are required", "warning");
      return;
    }
    if (!notionWorkspaceId) {
      triggerToast("No workspace found. Please log in again.", "error");
      return;
    }
    setNotionSaving(true);
    try {
      const res = await fetch(`${API_BASE}/notion/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspace_id: notionWorkspaceId,
          database_id: notionDbId,
          api_key: notionApiKey,
          label: notionLabel || "My Notion DB",
        }),
      });
      const json = await res.json();
      if (json.success) {
        setNotionConfigured(true);
        setNotionConnected(true);
        setNotionApiKey(""); // Clear after save for security
        triggerToast("Notion configuration saved!", "success");
      } else {
        triggerToast(json.message || "Save failed", "error");
      }
    } catch (err) {
      triggerToast("Network error: " + err.message, "error");
    } finally {
      setNotionSaving(false);
    }
  };

  const handleNotionDelete = async () => {
    if (!notionWorkspaceId) return;
    try {
      const res = await fetch(`${API_BASE}/notion/config`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspace_id: notionWorkspaceId }),
      });
      const json = await res.json();
      if (json.success) {
        setNotionConfigured(false);
        setNotionConnected(false);
        setNotionDbId("");
        setNotionApiKey("");
        setNotionLabel("");
        setNotionDbTitle("");
        setNotionTestResult(null);
        triggerToast("Notion configuration removed", "warning");
      }
    } catch (err) {
      triggerToast("Failed to remove config", "error");
    }
  };

  const isSlackConnected =
    notionWorkspaceId && notionWorkspaceId !== "0" && notionWorkspaceId !== 0;

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.channel &&
        item.channel.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTarget =
      filterTarget === "All" || item.target === filterTarget;

    return matchesSearch && matchesTarget;
  });

  const StatCard = ({ label, value, icon, trend }) => (
    <div className="bg-white rounded-lg p-6 border border-slate-200 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
          <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
          {trend && (
            <p className="text-green-600 text-xs font-medium mt-2">{trend}</p>
          )}
        </div>
        <div className="text-3xl opacity-60">{icon}</div>
      </div>
    </div>
  );

  if (isValidating) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500/80 animate-pulse">
            Verifying session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Toast */}
      {showToast && (
        <div
          className="toast toast-top toast-end mt-4 mr-4"
          style={{ zIndex: 9999 }}
        >
          <div
            className={`alert ${toastType === "success" ? "alert-success" : toastType === "warning" ? "alert-warning" : "alert-error"} text-sm`}
          >
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 transition-all duration-300 ${isSidebarCollapsed ? "w-20" : "w-64"}`}
      >
        <div className="p-6 space-y-8">
          {/* Header & Toggle */}
          <div className="flex items-center justify-between">
            {!isSidebarCollapsed && (
              <Link to="/" className="text-xl font-bold text-slate-900">
                Epilog
              </Link>
            )}
            {isSidebarCollapsed && (
              <Link to="/" className="text-xl font-bold text-slate-900 mx-auto">
                E
              </Link>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="text-slate-500 hover:text-slate-800 transition-colors"
              title="Toggle Sidebar"
            >
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${isSidebarCollapsed ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </button>
          </div>

          {/* Workspace */}
          {!isSidebarCollapsed && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                Workspace
              </label>
              <select
                className="select select-sm w-full bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500 appearance-none"
                value={currentWorkspace}
                onChange={() => {}}
                disabled
              >
                <option value={currentWorkspace}>{currentWorkspace}</option>
              </select>
            </div>
          )}

          {/* Menu */}
          <nav className="space-y-1">
            {[
              {
                id: "dashboard",
                icon: <HomeIcon className="w-4 h-4 shrink-0" />,
                label: "Dashboard",
              },
              {
                id: "wikis",
                icon: <IoDocument className="w-4 h-4 shrink-0" />,
                label: "Wiki History",
              },
              {
                id: "integrations",
                icon: <IntegrationsIcon className="w-4 h-4 shrink-0" />,
                label: "Integrations",
              },
              {
                id: "triggers",
                icon: <TriggersIcon className="w-4 h-4 shrink-0" />,
                label: "Triggers",
              },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  fetchAllData();
                }}
                title={isSidebarCollapsed ? item.label : ""}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${isSidebarCollapsed ? "justify-center px-0" : ""} ${
                  currentTab === item.id
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item.icon} {!isSidebarCollapsed && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* User Card */}
        <div
          className={`p-4 border-t border-slate-200 flex flex-col gap-3 ${isSidebarCollapsed ? "items-center" : ""}`}
        >
          <div
            className={`flex items-center gap-3 ${isSidebarCollapsed ? "justify-center" : ""}`}
          >
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || "User")}&background=random`}
              alt="avatar"
              className="w-8 h-8 rounded-full shrink-0"
              title={isSidebarCollapsed ? currentUser.name : ""}
            />
            {!isSidebarCollapsed && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {currentUser.name || "User"}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {currentUser.email || "Admin"}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            title={isSidebarCollapsed ? "Logout" : ""}
            className={`w-full btn btn-outline btn-error btn-sm rounded-lg flex items-center justify-center gap-2 hover:scale-[1.01] transition-all duration-200 mt-1 font-bold text-xs ${isSidebarCollapsed ? "px-0" : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
              />
            </svg>
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search docs..."
                className="input input-sm w-64 bg-slate-100 border-0 text-slate-900 placeholder-slate-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <button
              onClick={() => setIsManualSyncOpen(true)}
              className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-lg"
            >
              + Manual Sync
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                fetchAllData();
                triggerToast("Data refreshed!", "success");
              }}
              className="btn btn-sm btn-ghost border border-slate-200 rounded-lg flex items-center gap-1.5 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 transition-colors shadow-sm"
              title="Refresh Data"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {currentTab === "dashboard" && (
            <div className="p-8 space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <StatCard
                  label="Total Synced"
                  value={history.length}
                  icon={<IoDocument className="w-8 h-8 text-blue-600" />}
                  // trend="↑ 12% this week"
                />
                <StatCard
                  label="Time Saved"
                  value={`${(history.length * 0.25).toFixed(1)} hrs`}
                  icon={<FaClock className="w-8 h-8 text-yellow-500" />}
                  // trend="15m per page"
                />
                <StatCard
                  label="Active Triggers"
                  value={activeEmojis.length}
                  icon={<FaBrain className="w-8 h-8 text-purple-600" />}
                />
              </div>
            </div>
          )}

          {currentTab === "wikis" && (
            <div className="p-8">
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="font-bold text-lg text-slate-900">
                    Full Wiki Archive
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-3 text-left font-semibold text-slate-700">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-slate-700">
                          Source
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-slate-700">
                          Target
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-slate-700">
                          Author
                        </th>
                        <th className="px-6 py-3 text-right font-semibold text-slate-700">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item) => (
                        <tr
                          key={item.id}
                          className="border-t border-slate-200 hover:bg-slate-50 cursor-pointer"
                        >
                          <td
                            className="px-6 py-4 font-medium text-slate-900"
                            onClick={() => {
                              setSelectedDoc(item);
                              setIsDrawerOpen(true);
                            }}
                          >
                            {item.title}
                          </td>
                          <td
                            className="px-6 py-4 text-slate-600"
                            onClick={() => {
                              setSelectedDoc(item);
                              setIsDrawerOpen(true);
                            }}
                          >
                            #{item.channel}
                          </td>
                          <td
                            className="px-6 py-4"
                            onClick={() => {
                              setSelectedDoc(item);
                              setIsDrawerOpen(true);
                            }}
                          >
                            <span className="px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700">
                              {item.target}
                            </span>
                          </td>
                          <td
                            className="px-6 py-4 text-slate-600"
                            onClick={() => {
                              setSelectedDoc(item);
                              setIsDrawerOpen(true);
                            }}
                          >
                            @{item.author}
                          </td>
                          <td
                            className="px-6 py-4 text-right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex justify-end items-center gap-2">
                              <button
                                onClick={() => {
                                  triggerConfirm(
                                    "Delete Wiki Document",
                                    "Are you sure you want to delete this wiki from your database and Notion? This action cannot be undone.",
                                    () => handleDelete(item.id),
                                    "danger",
                                  );
                                }}
                                className="px-3 py-1 text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 rounded transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Integrations Tab */}
          {currentTab === "integrations" && (
            <div className="p-8 space-y-6">
              {/* Slack Card — read-only status */}
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="/slack.png"
                      alt="Slack"
                      className="w-8 h-8 object-contain"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">
                        Slack Workspace
                      </p>
                      <p className="text-sm text-slate-500">
                        {isSlackConnected
                          ? `Connected workspace: ${currentWorkspace}`
                          : "Connect your Slack workspace to listen to reaction triggers"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {isSlackConnected ? (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
                          Connected via OAuth
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mr-2">
                          <div className="w-2 h-2 rounded-full bg-slate-300" />
                          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                            Not connected
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            window.location.href = `${API_BASE}/auth/slack`;
                          }}
                          className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-lg animate-pulse"
                        >
                          Connect Slack
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Notion Config Card */}
              <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white font-bold text-sm">
                      N
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        Notion Integration
                      </p>
                      <p className="text-sm text-slate-500">
                        Push AI-generated wiki pages to your Notion database
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {notionConfigured ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
                          Configured
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                          Not configured
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* How-to note */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-xs text-blue-800 space-y-1">
                  <p className="font-semibold">How to get your credentials:</p>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>
                      Go to{" "}
                      <a
                        href="https://www.notion.so/my-integrations"
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        notion.so/my-integrations
                      </a>{" "}
                      → create a new integration → copy the{" "}
                      <strong>Internal Integration Secret</strong>
                    </li>
                    <li>
                      Open your Notion database → click{" "}
                      <strong>⋯ → Connections</strong> → add your integration
                    </li>
                    <li>
                      Copy the database ID from the URL:{" "}
                      <code className="bg-blue-100 px-1 rounded">
                        notion.so/YOUR_DB_ID?v=...
                      </code>
                    </li>
                  </ol>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Label (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Engineering Wiki"
                      className="input input-sm w-full bg-slate-50 border-slate-300 text-slate-900"
                      value={notionLabel}
                      onChange={(e) => setNotionLabel(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Notion Database ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. a1b2c3d4e5f6..."
                      className="input input-sm w-full bg-slate-50 border-slate-300 text-slate-900 font-mono"
                      value={notionDbId}
                      onChange={(e) => {
                        setNotionDbId(e.target.value);
                        setNotionTestResult(null);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Notion Integration Token{" "}
                      <span className="text-red-500">*</span>
                      {notionConfigured && !notionApiKey && (
                        <span className="ml-2 text-slate-400 font-normal">
                          (leave blank to keep existing)
                        </span>
                      )}
                    </label>
                    <input
                      type="password"
                      placeholder={
                        notionConfigured ? "••••••••••••••••" : "secret_..."
                      }
                      className="input input-sm w-full bg-slate-50 border-slate-300 text-slate-900 font-mono"
                      value={notionApiKey}
                      onChange={(e) => {
                        setNotionApiKey(e.target.value);
                        setNotionTestResult(null);
                      }}
                      autoComplete="off"
                    />
                  </div>
                </div>

                {/* Test result */}
                {notionTestResult && (
                  <div
                    className={`text-xs rounded-lg px-4 py-3 font-medium ${
                      notionTestResult.success
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {notionTestResult.success ? "✓ " : "✗ "}
                    {notionTestResult.message}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={handleNotionTest}
                    disabled={
                      notionTesting ||
                      !notionDbId.trim() ||
                      !notionApiKey.trim()
                    }
                    className="btn btn-sm btn-outline border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    {notionTesting ? (
                      <>
                        <span className="loading loading-spinner loading-xs" />{" "}
                        Testing...
                      </>
                    ) : (
                      "Test Connection"
                    )}
                  </button>

                  <button
                    onClick={handleNotionSave}
                    disabled={notionSaving || !notionDbId.trim()}
                    className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-0 disabled:opacity-50"
                  >
                    {notionSaving ? (
                      <>
                        <span className="loading loading-spinner loading-xs" />{" "}
                        Saving...
                      </>
                    ) : notionConfigured ? (
                      "Update Config"
                    ) : (
                      "Save Config"
                    )}
                  </button>

                  {notionConfigured && (
                    <button
                      onClick={handleNotionDelete}
                      className="btn btn-sm btn-outline border-red-200 text-red-600 hover:bg-red-50 ml-auto"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* GitHub — coming soon */}
              {/* <div className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GitHubLogo className="w-8 h-8 text-slate-800" />
                    <div>
                      <p className="font-semibold text-slate-900">
                        GitHub Repository
                      </p>
                      <p className="text-sm text-slate-500">
                        Store markdown docs directly in your repo
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">
                    Coming soon
                  </span>
                </div>
              </div> */}
            </div>
          )}

          {/* Triggers Tab */}
          {currentTab === "triggers" && (
            <div className="p-8">
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h3 className="font-bold text-lg text-slate-900 mb-2">
                  Reaction Triggers
                </h3>
                <p className="text-slate-600 text-sm mb-2">
                  Choose which emoji reactions trigger wiki compilation
                </p>
                <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-3 text-xs text-amber-800 mb-6">
                  <strong>Tip:</strong> Enter the{" "}
                  <strong>Slack reaction name</strong>, not the emoji character.
                  E.g. type{" "}
                  <code className="bg-amber-100 px-1 rounded">memo</code> for
                  📝, or{" "}
                  <code className="bg-amber-100 px-1 rounded">pencil2</code> for
                  ✏️. You can find the name by hovering over a reaction in
                  Slack.
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="font-semibold text-slate-900">
                        Active Triggers
                      </h4>
                      {triggersLoading && (
                        <span className="loading loading-spinner loading-xs text-blue-500" />
                      )}
                      <span className="ml-auto text-xs text-slate-400">
                        {activeEmojis.length} configured
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {activeEmojis.length === 0 && !triggersLoading && (
                        <p className="text-sm text-slate-400 italic">
                          No triggers configured yet.
                        </p>
                      )}
                      {activeEmojis.map((emoji) => (
                        <div
                          key={emoji}
                          className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg"
                        >
                          <span className="text-sm font-mono text-slate-700">
                            {emoji}
                          </span>
                          <button
                            onClick={() => handleRemoveEmoji(emoji)}
                            disabled={triggersLoading}
                            className="text-slate-400 hover:text-red-500 text-sm disabled:opacity-40"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    <form
                      onSubmit={handleAddEmoji}
                      className="flex gap-2 max-w-sm"
                    >
                      <input
                        type="text"
                        placeholder="Slack reaction name (e.g. memo)"
                        className="input input-sm flex-1 bg-slate-50 border-slate-300 font-mono"
                        value={emojiInput}
                        onChange={(e) => setEmojiInput(e.target.value)}
                        disabled={triggersLoading}
                      />
                      <button
                        type="submit"
                        disabled={triggersLoading || !emojiInput.trim()}
                        className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-0 disabled:opacity-50"
                      >
                        Add
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Drawer */}
      {isDrawerOpen && selectedDoc && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="fixed right-0 top-0 z-50 h-screen w-full max-w-2xl bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-slide-in-right">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  {selectedDoc.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(selectedDoc.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Source</p>
                  <p className="font-medium text-slate-900">
                    #{selectedDoc.channel}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Target</p>
                  <p className="font-medium text-slate-900">
                    {selectedDoc.target}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Slack Snippet
                </h4>
                <p className="text-sm text-slate-600 italic p-4 bg-slate-50 rounded-lg">
                  "{selectedDoc.slackPreview}"
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Compiled Document
                </h4>
                <pre className="text-xs text-slate-600 p-4 bg-slate-50 rounded-lg overflow-x-auto font-mono">
                  {selectedDoc.markdown}
                </pre>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex gap-3 justify-end">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedDoc.markdown);
                  triggerToast("Copied to clipboard", "success");
                }}
                className="px-4 py-2 text-sm font-medium bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Copy Markdown
              </button>
              {/* <button
                onClick={() => {
                  window.open(
                    `https://${selectedDoc.target.toLowerCase()}.com/workspace`,
                    "_blank",
                  );
                }}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Open in {selectedDoc.target}
              </button> */}
            </div>
          </div>
        </>
      )}

      {isManualSyncOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsManualSyncOpen(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg border border-slate-200 shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-900">
                Manual Thread Sync
              </h3>
              <button
                onClick={() => setIsManualSyncOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-slate-600 mb-6">
              Paste a Slack message link to compile it into a wiki
            </p>

            <form onSubmit={handleManualSync} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Slack Message URL
                </label>
                <input
                  type="url"
                  placeholder="https://workspace.slack.com/archives/..."
                  className="input input-sm w-full bg-slate-50 border-slate-300"
                  value={manualThreadUrl}
                  onChange={(e) => setManualThreadUrl(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Destination
                </label>
                <div className="flex gap-2">
                  {["Notion", "GitHub"].map((dest) => (
                    <button
                      key={dest}
                      type="button"
                      onClick={() => setManualTarget(dest)}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                        manualTarget === dest
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      <span className="flex items-center gap-1.5 justify-center">
                        {dest === "Notion" ? (
                          <NotionLogo className="w-4 h-4 text-current" />
                        ) : (
                          <GitHubLogo className="w-4 h-4 text-current" />
                        )}
                        <span>{dest}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsManualSyncOpen(false)}
                  className="flex-1 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={manualSyncLoading}
                  className="flex-1 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {manualSyncLoading ? "Syncing..." : "Sync"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        type={confirmModal.type}
      />
    </div>
  );
};

export default Dashboard;
