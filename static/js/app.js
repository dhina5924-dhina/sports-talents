const { useState, useEffect, useRef } = React;

// API Helper
const apiCall = async (url, options = {}) => {
    const token = localStorage.getItem('jwt_token');
    const headers = { ...options.headers };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, { ...options, headers });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.message || 'API request failed');
    }
    return data;
};

// Main App Component
function App() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [logs, setLogs] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [notification, setNotification] = useState(null);

    // Initial Auth Check
    useEffect(() => {
        const storedUser = localStorage.getItem('user_data');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {}
        }
        if (localStorage.getItem('jwt_token')) {
            fetchUserData();
        }
    }, []);

    const fetchUserData = async () => {
        try {
            const res = await apiCall('/api/auth/me');
            setUser(res.user);
            localStorage.setItem('user_data', JSON.stringify(res.user));
        } catch (e) {
            handleLogout();
        }
    };

    const handleLogin = (userData, token) => {
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('user_data', JSON.stringify(userData));
        setUser(userData);
        showToast('Login successful! Welcome to SOC Command Center.', 'success');
    };

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_data');
        setUser(null);
        setActiveTab('login');
        showToast('Logged out successfully.', 'info');
    };

    const showToast = (msg, type = 'info') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 4000);
    };

    // Load Dashboard Data
    const loadDashboardData = async () => {
        try {
            const data = await apiCall('/api/dashboard/stats');
            setStats(data);
            const recData = await apiCall('/api/recommendations');
            setRecommendations(recData.recommendations || []);
        } catch (e) {
            console.error("Dashboard error:", e);
        }
    };

    useEffect(() => {
        if (user) {
            loadDashboardData();
            let interval = null;
            if (autoRefresh) {
                interval = setInterval(() => {
                    loadDashboardData();
                }, 10000);
            }
            return () => clearInterval(interval);
        }
    }, [user, autoRefresh]);

    if (!user) {
        return <LoginPage onLogin={handleLogin} notification={notification} />;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[#090D16]">
            {/* Sidebar Navigation */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header Navbar */}
                <Header 
                    user={user} 
                    autoRefresh={autoRefresh} 
                    setAutoRefresh={setAutoRefresh}
                    onRefresh={loadDashboardData}
                    notification={notification}
                />

                {/* Main View Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                    {activeTab === 'dashboard' && (
                        <DashboardView 
                            stats={stats} 
                            recommendations={recommendations} 
                            setActiveTab={setActiveTab} 
                        />
                    )}
                    {activeTab === 'upload' && (
                        <UploadLogsView 
                            onAnalysisComplete={(data) => {
                                showToast(data.message, 'success');
                                loadDashboardData();
                                setActiveTab('analysis');
                            }}
                            showToast={showToast}
                        />
                    )}
                    {activeTab === 'analysis' && (
                        <ThreatAnalysisView 
                            recommendations={recommendations}
                            showToast={showToast}
                        />
                    )}
                    {activeTab === 'alerts' && (
                        <AlertsView showToast={showToast} />
                    )}
                    {activeTab === 'search' && (
                        <SearchFilterView />
                    )}
                    {activeTab === 'reports' && (
                        <ReportsView stats={stats} showToast={showToast} />
                    )}
                    {activeTab === 'users' && user.role === 'admin' && (
                        <UserManagementView showToast={showToast} />
                    )}
                    {activeTab === 'settings' && (
                        <SettingsView showToast={showToast} />
                    )}
                </main>
            </div>
        </div>
    );
}

// 1. Sidebar Component
function Sidebar({ activeTab, setActiveTab, user, onLogout }) {
    const navItems = [
        { id: 'dashboard', label: 'SOC Dashboard', icon: 'layout-dashboard' },
        { id: 'upload', label: 'Upload Logs', icon: 'file-up' },
        { id: 'analysis', label: 'Threat Analysis', icon: 'shield-alert' },
        { id: 'alerts', label: 'Real-time Alerts', icon: 'bell' },
        { id: 'search', label: 'Search & Filter', icon: 'search' },
        { id: 'reports', label: 'Reports & Bundles', icon: 'file-text' },
        ...(user.role === 'admin' ? [{ id: 'users', label: 'User Management', icon: 'users' }] : []),
        { id: 'settings', label: 'Settings', icon: 'sliders' },
    ];

    useEffect(() => {
        if (window.lucide) window.lucide.createIcons();
    }, [activeTab]);

    return (
        <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between hidden md:flex">
            <div>
                {/* Brand Logo Header */}
                <div className="h-16 flex items-center px-6 border-b border-slate-800/80 space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                        <i data-lucide="shield" className="w-5 h-5"></i>
                    </div>
                    <div>
                        <h1 className="font-bold text-sm text-slate-100 tracking-wider">AI LOG ANALYZER</h1>
                        <p className="text-[10px] text-cyan-400 font-mono">SOC CYBER-INTEL v2.6</p>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="p-4 space-y-1.5">
                    {navItems.map(item => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/5'
                                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                                }`}
                            >
                                <i data-lucide={item.icon} className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`}></i>
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* User Info & Logout footer */}
            <div className="p-4 border-t border-slate-800/80">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-cyan-400">
                            {user.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-200">{user.username}</p>
                            <p className="text-[10px] text-slate-400 capitalize">{user.role} Access</p>
                        </div>
                    </div>
                    <button 
                        onClick={onLogout}
                        title="Logout"
                        className="text-slate-400 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-slate-800"
                    >
                        <i data-lucide="log-out" className="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        </aside>
    );
}

// 2. Header Component
function Header({ user, autoRefresh, setAutoRefresh, onRefresh, notification }) {
    const [timeStr, setTimeStr] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeStr(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <header className="h-16 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between px-6 z-10">
            {/* Left Status Indicator */}
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-mono text-slate-300">LIVE SYSTEM ACTIVE</span>
                </div>
                <div className="hidden sm:block text-xs font-mono text-slate-500">|</div>
                <div className="hidden sm:block text-xs font-mono text-cyan-400/80">
                    CLOCK: {timeStr}
                </div>
            </div>

            {/* Notification Toast */}
            {notification && (
                <div className={`px-4 py-1.5 rounded-lg text-xs font-medium border animate-bounce ${
                    notification.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                }`}>
                    {notification.msg}
                </div>
            )}

            {/* Right Controls */}
            <div className="flex items-center space-x-3">
                <button
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={`flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                        autoRefresh ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300' : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                >
                    <i data-lucide="refresh-cw" className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-spin' : ''}`}></i>
                    <span>{autoRefresh ? 'Auto 10s' : 'Paused'}</span>
                </button>
                <button
                    onClick={onRefresh}
                    className="p-1.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg text-slate-300 transition-all"
                    title="Manual Refresh"
                >
                    <i data-lucide="rotate-cw" className="w-4 h-4"></i>
                </button>
            </div>
        </header>
    );
}

// 3. Login Page Component
function LoginPage({ onLogin, notification }) {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('admin123');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = await apiCall('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });
            onLogin(data.user, data.token);
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (window.lucide) window.lucide.createIcons();
    }, []);

    return (
        <div className="min-h-screen w-full bg-[#070A11] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Cybersecurity Grid Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full"></div>

            <div className="w-full max-w-md glass-panel p-8 rounded-2xl relative z-10 border border-slate-800 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-cyan-500/20 border border-cyan-400/30">
                        <i data-lucide="shield-check" className="w-8 h-8 text-white"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-wide">SOC Log Analyzer</h2>
                    <p className="text-xs text-slate-400 mt-1">AI-Powered Cyber Threat Monitoring Platform</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
                        <i data-lucide="alert-circle" className="w-4 h-4 shrink-0"></i>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Username</label>
                        <div className="relative">
                            <i data-lucide="user" className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500"></i>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Password</label>
                        <div className="relative">
                            <i data-lucide="lock" className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500"></i>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                        <p className="font-semibold text-slate-300 flex items-center space-x-1">
                            <i data-lucide="key" className="w-3 h-3 text-cyan-400"></i>
                            <span>Test Credentials:</span>
                        </p>
                        <p>• Admin: <code className="text-cyan-400 code-font">admin</code> / <code className="text-cyan-400 code-font">admin123</code></p>
                        <p>• Analyst: <code className="text-cyan-400 code-font">analyst</code> / <code className="text-cyan-400 code-font">analyst123</code></p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2"
                    >
                        {loading ? (
                            <i data-lucide="loader-2" className="w-5 h-5 animate-spin"></i>
                        ) : (
                            <>
                                <span>Authenticate & Access SOC</span>
                                <i data-lucide="arrow-right" className="w-4 h-4"></i>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

// 4. Dashboard View
function DashboardView({ stats, recommendations, setActiveTab }) {
    const pieChartRef = useRef(null);
    const barChartRef = useRef(null);
    const lineChartRef = useRef(null);
    const pieInstance = useRef(null);
    const barInstance = useRef(null);
    const lineInstance = useRef(null);

    useEffect(() => {
        if (!stats || typeof Chart === 'undefined') return;

        const dist = (stats && stats.threat_distribution) || {};

        // 1. Threat Distribution Pie Chart
        if (pieChartRef.current) {
            if (pieInstance.current) pieInstance.current.destroy();
            const ctx = pieChartRef.current.getContext('2d');
            pieInstance.current = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Normal', 'Low Risk', 'Medium Risk', 'High Risk', 'Critical'],
                    datasets: [{
                        data: [
                            dist.Normal || 0,
                            dist['Low Risk'] || 0,
                            dist['Medium Risk'] || 0,
                            dist['High Risk'] || 0,
                            dist.Critical || 0
                        ],
                        backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#F97316', '#EF4444'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom', labels: { color: '#CBD5E1', font: { family: 'Outfit' } } } }
                }
            });
        }

        // 2. Top Attacking IPs Bar Chart
        if (barChartRef.current) {
            if (barInstance.current) barInstance.current.destroy();
            const ctx = barChartRef.current.getContext('2d');
            const topIps = (stats && stats.top_attacking_ips) ? stats.top_attacking_ips : [];
            const ips = topIps.map(i => i.ip);
            const counts = topIps.map(i => i.count);
            barInstance.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ips.length > 0 ? ips : ['No Attacks'],
                    datasets: [{
                        label: 'Attack Vector Count',
                        data: counts.length > 0 ? counts : [0],
                        backgroundColor: '#EF4444',
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { ticks: { color: '#94A3B8' }, grid: { display: false } },
                        y: { ticks: { color: '#94A3B8' }, grid: { color: '#1E293B' } }
                    },
                    plugins: { legend: { display: false } }
                }
            });
        }

        // 3. Daily Attacks Line Chart
        if (lineChartRef.current) {
            if (lineInstance.current) lineInstance.current.destroy();
            const ctx = lineChartRef.current.getContext('2d');
            const dailyList = (stats && stats.daily_attacks) ? stats.daily_attacks : [];
            const dates = dailyList.map(d => d.date);
            const attackCounts = dailyList.map(d => d.attacks);
            lineInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates.length > 0 ? dates : ['Today'],
                    datasets: [{
                        label: 'Daily Threat Events',
                        data: attackCounts.length > 0 ? attackCounts : [0],
                        borderColor: '#06B6D4',
                        backgroundColor: 'rgba(6, 182, 212, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { ticks: { color: '#94A3B8' }, grid: { color: '#1E293B' } },
                        y: { ticks: { color: '#94A3B8' }, grid: { color: '#1E293B' } }
                    },
                    plugins: { legend: { display: false } }
                }
            });
        }
    }, [stats]);

    if (!stats) {
        return (
            <div className="flex items-center justify-center h-64 text-slate-400 space-x-2">
                <i data-lucide="loader-2" className="w-6 h-6 animate-spin text-cyan-400"></i>
                <span>Loading SOC Analytics...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <MetricCard title="Total Logs" value={stats.total_logs} icon="database" color="cyan" />
                <MetricCard title="Suspicious Logs" value={stats.suspicious_logs} icon="shield-alert" color="amber" />
                <MetricCard title="Critical Threats" value={stats.critical_threats} icon="flame" color="red" />
                <MetricCard title="Normal Logs" value={stats.normal_logs} icon="check-circle" color="emerald" />
                <MetricCard title="Threat Rate" value={`${stats.threat_percentage}%`} icon="activity" color="purple" />
                <MetricCard title="AI Anomalies" value={stats.anomalies_count} icon="cpu" color="blue" />
            </div>

            {/* Quick Upload Banner */}
            <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                        <i data-lucide="file-up" className="w-6 h-6"></i>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-100 text-base">Analyze Security Logs with AI</h3>
                        <p className="text-xs text-slate-400">Upload .log, .txt, or .csv files for instant Isolation Forest anomaly detection & threat classification.</p>
                    </div>
                </div>
                <button
                    onClick={() => setActiveTab('upload')}
                    className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/20 transition-all shrink-0 flex items-center space-x-2"
                >
                    <span>Upload & Analyze</span>
                    <i data-lucide="arrow-right" className="w-4 h-4"></i>
                </button>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass-panel p-5 rounded-2xl border border-slate-800">
                    <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center space-x-2">
                        <i data-lucide="pie-chart" className="w-4 h-4 text-cyan-400"></i>
                        <span>Threat Severity Distribution</span>
                    </h3>
                    <div className="h-64 relative">
                        <canvas ref={pieChartRef}></canvas>
                    </div>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-slate-800">
                    <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center space-x-2">
                        <i data-lucide="bar-chart-2" className="w-4 h-4 text-rose-400"></i>
                        <span>Top Attacking Origin IPs</span>
                    </h3>
                    <div className="h-64 relative">
                        <canvas ref={barChartRef}></canvas>
                    </div>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-slate-800">
                    <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center space-x-2">
                        <i data-lucide="trending-up" className="w-4 h-4 text-emerald-400"></i>
                        <span>Daily Threat Event Trends</span>
                    </h3>
                    <div className="h-64 relative">
                        <canvas ref={lineChartRef}></canvas>
                    </div>
                </div>
            </div>

            {/* AI Security Recommendations */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center space-x-2">
                    <i data-lucide="bot" className="w-5 h-5 text-cyan-400"></i>
                    <span>AI Security Action Countermeasures</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(Array.isArray(recommendations) ? recommendations : []).map((rec, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start space-x-3">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase shrink-0 ${
                                rec.severity === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                                rec.severity === 'High Risk' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}>
                                {rec.severity}
                            </span>
                            <div>
                                <h4 className="text-xs font-bold text-slate-200">{rec.title}</h4>
                                <p className="text-xs text-slate-400 mt-1">{rec.action}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon, color }) {
    const colorMap = {
        cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
        amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        red: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    };

    return (
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-400">{title}</span>
                <div className={`p-2 rounded-xl border ${colorMap[color]}`}>
                    <i data-lucide={icon} className="w-4 h-4"></i>
                </div>
            </div>
            <div className="text-2xl font-bold text-slate-100 tracking-tight">{value}</div>
        </div>
    );
}

// 5. Upload Logs View
function UploadLogsView({ onAnalysisComplete, showToast }) {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleFileUpload = async (file) => {
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const data = await apiCall('/api/logs/upload', {
                method: 'POST',
                body: formData
            });
            onAnalysisComplete(data);
        } catch (err) {
            showToast(err.message || 'File upload failed', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleGenerateSample = async (type) => {
        setUploading(true);
        try {
            const data = await apiCall(`/api/logs/sample?type=${type}`, { method: 'POST' });
            onAnalysisComplete(data);
        } catch (err) {
            showToast('Sample generation failed', 'error');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 py-4">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-slate-100">Upload & Parse Security Logs</h2>
                <p className="text-xs text-slate-400">Supports standard server logs (.log, .txt, .csv), Apache/Nginx combined format, Linux Syslog, and custom CSV datasets.</p>
            </div>

            {/* Drag and Drop Zone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleFileUpload(e.dataTransfer.files[0]);
                    }
                }}
                className={`glass-panel border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
                    dragActive ? 'border-cyan-400 bg-cyan-500/10' : 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
                }`}
            >
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4 text-cyan-400">
                    <i data-lucide="cloud-upload" className="w-8 h-8"></i>
                </div>
                <h3 className="text-lg font-semibold text-slate-200 mb-2">Drag and drop log file here</h3>
                <p className="text-xs text-slate-400 mb-6">Accepted file extensions: <code className="text-cyan-400 code-font">.log</code>, <code className="text-cyan-400 code-font">.txt</code>, <code className="text-cyan-400 code-font">.csv</code></p>

                <input
                    type="file"
                    id="fileInput"
                    accept=".log,.txt,.csv"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                />

                <label
                    htmlFor="fileInput"
                    className="cursor-pointer px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/20 inline-flex items-center space-x-2 transition-all"
                >
                    {uploading ? <i data-lucide="loader-2" className="w-4 h-4 animate-spin"></i> : <i data-lucide="folder-open" className="w-4 h-4"></i>}
                    <span>{uploading ? 'Analyzing Logs...' : 'Browse Local Log File'}</span>
                </label>
            </div>

            {/* Quick Sample Log Generators */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                    <i data-lucide="sparkles" className="w-4 h-4 text-amber-400"></i>
                    <span>Or Generate Real-time Realistic Sample Logs (1-Click Test Data)</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => handleGenerateSample('log')}
                        disabled={uploading}
                        className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 text-left transition-all group"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-xs font-bold text-cyan-400">.LOG Format</span>
                            <i data-lucide="file-code" className="w-4 h-4 text-slate-500 group-hover:text-cyan-400"></i>
                        </div>
                        <p className="text-xs text-slate-400">Apache/Nginx Combined Web & SSH Auth Logs with SQLi & Brute Force vectors.</p>
                    </button>

                    <button
                        onClick={() => handleGenerateSample('csv')}
                        disabled={uploading}
                        className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-xs font-bold text-emerald-400">.CSV Dataset</span>
                            <i data-lucide="table" className="w-4 h-4 text-slate-500 group-hover:text-emerald-400"></i>
                        </div>
                        <p className="text-xs text-slate-400">Structured CSV file containing timestamps, origin IPs, malware events & DDoS traffic.</p>
                    </button>

                    <button
                        onClick={() => handleGenerateSample('txt')}
                        disabled={uploading}
                        className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-purple-500/50 text-left transition-all group"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-xs font-bold text-purple-400">.TXT Raw Stream</span>
                            <i data-lucide="file-text" className="w-4 h-4 text-slate-500 group-hover:text-purple-400"></i>
                        </div>
                        <p className="text-xs text-slate-400">Plain text syslog stream containing sudo privilege escalation & auth failures.</p>
                    </button>
                </div>
            </div>
        </div>
    );
}

// 6. Threat Analysis View
function ThreatAnalysisView({ recommendations, showToast }) {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterLevel, setFilterLevel] = useState('All');

    useEffect(() => {
        fetchLogs();
    }, [filterLevel]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const data = await apiCall(`/api/logs?threat_level=${filterLevel}`);
            setLogs(data.logs || []);
        } catch (e) {
            showToast('Error loading logs', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-100">AI Threat Analysis & Keywords</h2>
                    <p className="text-xs text-slate-400">Classified log events with highlighted attack vectors and Scikit-Learn Isolation Forest anomaly scores.</p>
                </div>

                {/* Level Filter Tabs */}
                <div className="flex items-center space-x-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 overflow-x-auto">
                    {['All', 'Critical', 'High Risk', 'Medium Risk', 'Low Risk', 'Normal'].map(lvl => (
                        <button
                            key={lvl}
                            onClick={() => setFilterLevel(lvl)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                filterLevel === lvl ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            {lvl}
                        </button>
                    ))}
                </div>
            </div>

            {/* Log Records Table */}
            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/90 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-800">
                                <th className="p-4">Timestamp</th>
                                <th className="p-4">Origin IP</th>
                                <th className="p-4">Event Type</th>
                                <th className="p-4">Threat Level</th>
                                <th className="p-4">Risk Score</th>
                                <th className="p-4">AI Vectors / Matched Keywords</th>
                                <th className="p-4">Raw Log Snippet</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-xs">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-slate-400">
                                        <i data-lucide="loader-2" className="w-5 h-5 animate-spin inline mr-2 text-cyan-400"></i>
                                        Loading log analysis...
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-slate-400">
                                        No security logs match the selected filter.
                                    </td>
                                </tr>
                            ) : (
                                logs.map(log => (
                                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                                        <td className="p-4 code-font text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                                        <td className="p-4 code-font font-bold text-cyan-400 whitespace-nowrap">{log.ip_address}</td>
                                        <td className="p-4 font-semibold text-slate-200">{log.event_type}</td>
                                        <td className="p-4">
                                            <ThreatBadge level={log.threat_level} />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                    <div
                                                        className={`h-full ${
                                                            log.risk_score >= 80 ? 'bg-rose-500' :
                                                            log.risk_score >= 60 ? 'bg-amber-500' :
                                                            log.risk_score >= 40 ? 'bg-yellow-400' : 'bg-emerald-500'
                                                        }`}
                                                        style={{ width: `${log.risk_score}%` }}
                                                    ></div>
                                                </div>
                                                <span className="code-font font-bold text-[11px] text-slate-300">{log.risk_score}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-1">
                                                {log.is_anomaly && (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                                        AI Anomaly
                                                    </span>
                                                )}
                                                {(() => {
                                                    const kwList = Array.isArray(log.matched_keywords) 
                                                        ? log.matched_keywords 
                                                        : (typeof log.matched_keywords === 'string' && log.matched_keywords.trim() ? log.matched_keywords.split(',').map(s => s.trim()) : []);
                                                    return kwList.length > 0 ? (
                                                        kwList.map((kw, i) => (
                                                            <span key={i} className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                                                {kw}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-slate-500 text-[11px]">Normal</span>
                                                    );
                                                })()}
                                            </div>
                                        </td>
                                        <td className="p-4 code-font text-[11px] text-slate-400 max-w-xs truncate" title={log.raw_log}>
                                            {log.raw_log}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function ThreatBadge({ level }) {
    const badgeStyle = {
        'Critical': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
        'High Risk': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        'Medium Risk': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        'Low Risk': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        'Normal': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    };

    return (
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap ${badgeStyle[level] || badgeStyle['Normal']}`}>
            {level}
        </span>
    );
}

// 7. Real-time Alerts View
function AlertsView({ showToast }) {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        setLoading(true);
        try {
            const data = await apiCall('/api/alerts');
            setAlerts(data.alerts || []);
        } catch (e) {
            showToast('Error loading alerts', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (id) => {
        try {
            await apiCall(`/api/alerts/${id}/resolve`, { method: 'POST' });
            setAlerts(alerts.map(a => a.id === id ? { ...a, is_resolved: true } : a));
            showToast('Alert marked as resolved', 'success');
        } catch (e) {
            showToast('Failed to resolve alert', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-slate-100">Real-Time Threat Alerts</h2>
                <p className="text-xs text-slate-400">Color-coded security incident alerts generated automatically by the AI analyzer engine.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {alerts.map(alert => {
                    const colorClasses = {
                        'Red': 'border-l-4 border-l-rose-500 bg-slate-900/80',
                        'Orange': 'border-l-4 border-l-amber-500 bg-slate-900/80',
                        'Yellow': 'border-l-4 border-l-yellow-400 bg-slate-900/80',
                        'Green': 'border-l-4 border-l-emerald-500 bg-slate-900/80'
                    };
                    return (
                        <div key={alert.id} className={`glass-panel p-5 rounded-xl border border-slate-800 ${colorClasses[alert.severity] || ''} flex items-center justify-between gap-4`}>
                            <div className="flex items-start space-x-4">
                                <div className={`p-2.5 rounded-xl shrink-0 ${
                                    alert.severity === 'Red' ? 'bg-rose-500/20 text-rose-400' :
                                    alert.severity === 'Orange' ? 'bg-amber-500/20 text-amber-400' : 'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                    <i data-lucide="bell" className="w-5 h-5"></i>
                                </div>
                                <div>
                                    <div className="flex items-center space-x-3 mb-1">
                                        <h4 className="font-bold text-slate-100 text-sm">{alert.title}</h4>
                                        <span className="text-[11px] code-font text-slate-400">{alert.created_at}</span>
                                    </div>
                                    <p className="text-xs text-slate-300">{alert.description}</p>
                                    <p className="text-[11px] text-cyan-400 code-font mt-1">Source IP: {alert.source_ip}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleResolve(alert.id)}
                                disabled={alert.is_resolved}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                                    alert.is_resolved ? 'bg-slate-800 text-slate-500 cursor-default' : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30'
                                }`}
                            >
                                {alert.is_resolved ? 'Resolved' : 'Mark Resolved'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// 8. Search & Filter View
function SearchFilterView() {
    const [searchIp, setSearchIp] = useState('');
    const [searchUser, setSearchUser] = useState('');
    const [searchLevel, setSearchLevel] = useState('All');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                ip: searchIp,
                username: searchUser,
                threat_level: searchLevel,
                search: searchKeyword
            });
            const data = await apiCall(`/api/logs?${queryParams.toString()}`);
            setResults(data.logs || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-slate-100">Multi-Criteria Log Search & Query</h2>
                <p className="text-xs text-slate-400">Filter security records by IP address, account username, threat level, or custom keyword strings.</p>
            </div>

            <form onSubmit={handleSearch} className="glass-panel p-6 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">IP Address</label>
                    <input
                        type="text"
                        placeholder="e.g. 198.51.100.44"
                        value={searchIp}
                        onChange={(e) => setSearchIp(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Username</label>
                    <input
                        type="text"
                        placeholder="e.g. admin"
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Threat Level</label>
                    <select
                        value={searchLevel}
                        onChange={(e) => setSearchLevel(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    >
                        <option value="All">All Threat Levels</option>
                        <option value="Critical">Critical</option>
                        <option value="High Risk">High Risk</option>
                        <option value="Medium Risk">Medium Risk</option>
                        <option value="Low Risk">Low Risk</option>
                        <option value="Normal">Normal</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Keyword Search</label>
                    <input
                        type="text"
                        placeholder="e.g. SQL Injection, DDoS"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                </div>

                <div className="sm:col-span-2 md:col-span-4 flex justify-end">
                    <button
                        type="submit"
                        className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center space-x-2"
                    >
                        <i data-lucide="search" className="w-4 h-4"></i>
                        <span>Execute Search Query</span>
                    </button>
                </div>
            </form>

            <div className="glass-panel rounded-2xl border border-slate-800 p-4">
                <p className="text-xs text-slate-400 mb-3">Matching Results: <span className="text-cyan-400 font-bold">{results.length}</span></p>
                <div className="space-y-2">
                    {results.map(r => (
                        <div key={r.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                            <div className="space-x-3">
                                <span className="code-font text-slate-400">{r.timestamp}</span>
                                <span className="code-font font-bold text-cyan-400">{r.ip_address}</span>
                                <span className="font-semibold text-slate-200">{r.event_type}</span>
                            </div>
                            <ThreatBadge level={r.threat_level} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// 9. Reports & Downloads View
function ReportsView({ stats, showToast }) {
    const handleDownload = (fmt) => {
        window.open(`/api/reports/download/${fmt}`, '_blank');
        showToast(`Downloading ${fmt.toUpperCase()} report...`, 'success');
    };

    const handleDownloadProjectZip = () => {
        window.open('/api/project/zip', '_blank');
        showToast('Downloading complete Project ZIP Archive...', 'success');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 py-4">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-slate-100">Security Audit Reports & Export Bundles</h2>
                <p className="text-xs text-slate-400">Generate executive summary reports in PDF, Excel, and CSV formats or download all files bundled into a single ZIP archive.</p>
            </div>

            {/* SINGLE ZIP BUNDLE DOWNLOAD - HIGHLIGHTED FEATURE */}
            <div className="glass-panel p-8 rounded-3xl border-2 border-cyan-500/50 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/50 shadow-2xl relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="space-y-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                            Single ZIP Archive Package
                        </span>
                        <h3 className="text-xl font-bold text-slate-100">Download All Reports & Logs in One ZIP File</h3>
                        <p className="text-xs text-slate-300 max-w-xl">
                            Consolidates the <strong className="text-cyan-400">PDF Security Audit Report</strong>, <strong className="text-cyan-400">Excel Worksheet</strong>, <strong className="text-cyan-400">CSV Data Export</strong>, <strong className="text-cyan-400">Executive Summary TXT</strong>, and raw log files into a single <code className="code-font text-cyan-300">.zip</code> package.
                        </p>
                    </div>

                    <button
                        onClick={() => handleDownload('zip')}
                        className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-cyan-500/30 transition-all transform hover:scale-105 shrink-0 flex items-center space-x-3"
                    >
                        <i data-lucide="archive" className="w-6 h-6"></i>
                        <span>Download ZIP Archive</span>
                    </button>
                </div>
            </div>

            {/* Individual Format Download Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* PDF */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                        <i data-lucide="file-text" className="w-6 h-6"></i>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-200">PDF Audit Report</h4>
                        <p className="text-xs text-slate-400 mt-1">Formatted SOC executive report with tables, threat breakdown, and AI recommendations.</p>
                    </div>
                    <button
                        onClick={() => handleDownload('pdf')}
                        className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center space-x-2"
                    >
                        <i data-lucide="download" className="w-4 h-4"></i>
                        <span>Download PDF</span>
                    </button>
                </div>

                {/* EXCEL */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <i data-lucide="sheet" className="w-6 h-6"></i>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-200">Excel Worksheet (.xlsx)</h4>
                        <p className="text-xs text-slate-400 mt-1">Multi-sheet Excel workbook with summary metrics and filtered log entries.</p>
                    </div>
                    <button
                        onClick={() => handleDownload('excel')}
                        className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center space-x-2"
                    >
                        <i data-lucide="download" className="w-4 h-4"></i>
                        <span>Download Excel</span>
                    </button>
                </div>

                {/* CSV */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-blue-500/40 transition-all space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                        <i data-lucide="table" className="w-6 h-6"></i>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-200">Raw CSV Dataset</h4>
                        <p className="text-xs text-slate-400 mt-1">Standard CSV format suitable for SIEM data ingestion and python processing.</p>
                    </div>
                    <button
                        onClick={() => handleDownload('csv')}
                        className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center space-x-2"
                    >
                        <i data-lucide="download" className="w-4 h-4"></i>
                        <span>Download CSV</span>
                    </button>
                </div>
            </div>

            {/* Export Complete Project Source Code ZIP */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-slate-200 text-sm">Download Complete Application Source Code</h4>
                    <p className="text-xs text-slate-400">Exports all project python backend files, ML engine scripts, and React components as a ZIP file.</p>
                </div>
                <button
                    onClick={handleDownloadProjectZip}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 font-semibold text-xs rounded-xl transition-all flex items-center space-x-2"
                >
                    <i data-lucide="folder-archive" className="w-4 h-4"></i>
                    <span>Export Source ZIP</span>
                </button>
            </div>
        </div>
    );
}

// 10. User Management View (Admin Only)
function UserManagementView({ showToast }) {
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('analyst');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await apiCall('/api/users');
            setUsers(data.users || []);
        } catch (e) {
            console.error(e);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await apiCall('/api/users', {
                method: 'POST',
                body: JSON.stringify({ username, email, password, role })
            });
            showToast(`User '${username}' created!`, 'success');
            setUsername(''); setEmail(''); setPassword('');
            fetchUsers();
        } catch (e) {
            showToast(e.message || 'Error creating user', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-slate-100">SOC User & Role Management</h2>
                <p className="text-xs text-slate-400">Create security analyst accounts and manage system privileges.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Create User Form */}
                <form onSubmit={handleCreateUser} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                    <h3 className="font-bold text-slate-200 text-sm">Add New User</h3>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">Role Privilege</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200"
                        >
                            <option value="analyst">Security Analyst</option>
                            <option value="admin">Administrator</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2.5 bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow"
                    >
                        Create User
                    </button>
                </form>

                {/* User List Table */}
                <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800">
                    <h3 className="font-bold text-slate-200 text-sm mb-4">Active Platform Users</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="text-slate-400 uppercase text-[10px] border-b border-slate-800">
                                    <th className="pb-3">ID</th>
                                    <th className="pb-3">Username</th>
                                    <th className="pb-3">Email</th>
                                    <th className="pb-3">Role</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td className="py-3 code-font text-slate-500">{u.id}</td>
                                        <td className="py-3 font-semibold text-slate-200">{u.username}</td>
                                        <td className="py-3 text-slate-400">{u.email}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-400'
                                            }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 11. Settings View
function SettingsView({ showToast }) {
    const [settings, setSettings] = useState({
        sensitivity_threshold: '0.75',
        email_alerts_enabled: 'true',
        alert_email_recipient: 'secops@cybersecurity.local'
    });

    useEffect(() => {
        apiCall('/api/settings').then(data => {
            if (data) setSettings(prev => ({ ...prev, ...data }));
        }).catch(() => {});
    }, []);

    const handleSave = async () => {
        try {
            await apiCall('/api/settings', {
                method: 'POST',
                body: JSON.stringify(settings)
            });
            showToast('Settings saved successfully', 'success');
        } catch (e) {
            showToast('Failed to save settings', 'error');
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h2 className="text-xl font-bold text-slate-100">System Configuration & ML Settings</h2>
                <p className="text-xs text-slate-400">Configure machine learning sensitivity thresholds and email alert preferences.</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
                <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                        Isolation Forest Anomaly Sensitivity ({settings.sensitivity_threshold})
                    </label>
                    <input
                        type="range"
                        min="0.1"
                        max="0.9"
                        step="0.05"
                        value={settings.sensitivity_threshold}
                        onChange={(e) => setSettings({ ...settings, sensitivity_threshold: e.target.value })}
                        className="w-full accent-cyan-500"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Higher sensitivity flags subtle log statistical anomalies as threats.</p>
                </div>

                <div className="pt-4 border-t border-slate-800">
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.email_alerts_enabled === 'true'}
                            onChange={(e) => setSettings({ ...settings, email_alerts_enabled: e.target.checked ? 'true' : 'false' })}
                            className="w-4 h-4 rounded border-slate-800 text-cyan-500 focus:ring-0 bg-slate-950"
                        />
                        <span className="text-xs font-bold text-slate-200">Enable Automated Email Notifications for Critical Threats</span>
                    </label>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">SOC Alert Recipient Email</label>
                    <input
                        type="email"
                        value={settings.alert_email_recipient}
                        onChange={(e) => setSettings({ ...settings, alert_email_recipient: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
                    />
                </div>

                <button
                    onClick={handleSave}
                    className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow"
                >
                    Save System Settings
                </button>
            </div>
        </div>
    );
}

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error("SOC App Error Boundary caught an error:", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#090D16] text-rose-400 p-8 flex flex-col items-center justify-center space-y-4">
                    <div className="p-6 rounded-2xl bg-slate-900 border border-rose-500/40 max-w-lg text-center shadow-2xl">
                        <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3">
                            <i data-lucide="alert-triangle" className="w-6 h-6"></i>
                        </div>
                        <h2 className="text-lg font-bold text-slate-100 mb-2">SOC Platform Render Alert</h2>
                        <p className="text-xs text-slate-400 mb-4">{this.state.error?.toString()}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow"
                        >
                            Refresh System
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

// Render React App to DOM
ReactDOM.createRoot(document.getElementById('root')).render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
);
