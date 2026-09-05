/* ==========================================================================
   SPORTS PLATFORM - Single Page Application Engine
   ========================================================================== */

const API_BASE = (window.location.protocol === "file:" || !window.location.origin || window.location.origin === "null")
  ? "http://127.0.0.1:8000"
  : window.location.origin;

// State Management
let currentUser = null;
let authToken = localStorage.getItem("sports_jwt_token") || null;
let activeCategoryFilter = "All";
let activePostForComments = null;

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  initApp();
  window.addEventListener("hashchange", handleRouting);
});

async function initApp() {
  if (authToken) {
    await fetchCurrentUser();
  } else {
    updateNavUI();
  }
  
  handleRouting();
  loadTrendingWidget();
  loadSuggestedAthletes();
  
  if (currentUser) {
    fetchNotificationBadge();
    // Poll notifications every 30s
    setInterval(fetchNotificationBadge, 30000);
  }
}

/* ==========================================================================
   API Client Helper
   ========================================================================== */
async function apiRequest(endpoint, method = "GET", body = null, isFormData = false, silent = false) {
  const headers = {};
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }
  if (!isFormData && body && method !== "GET") {
    headers["Content-Type"] = "application/json";
  }

  const config = {
    method,
    headers
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    
    if (res.status === 401) {
      logout(silent);
      if (!silent) showToast("Session expired. Please log in again.", "error");
      return null;
    }

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ detail: "API Error occurred" }));
      throw new Error(errData.detail || `Request failed with status ${res.status}`);
    }

    if (res.status === 204) return true;
    return await res.json();
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err);
    if (!silent) showToast(err.message, "error");
    return null;
  }
}

async function fetchCurrentUser() {
  const data = await apiRequest("/api/auth/me", "GET", null, false, true);
  if (data) {
    currentUser = data;
    updateNavUI();
  } else {
    logout(true);
  }
}

/* ==========================================================================
   Auth Handlers & Nav UI
   ========================================================================== */
function updateNavUI() {
  const container = document.getElementById("nav-links-container");
  const sidebarAdmin = document.getElementById("sidebar-admin-link");
  const sidebarProfile = document.getElementById("sidebar-profile-link");

  if (sidebarAdmin) {
    sidebarAdmin.style.display = (currentUser && currentUser.is_admin) ? "flex" : "none";
  }

  if (sidebarProfile && currentUser) {
    sidebarProfile.href = `#profile/${currentUser.username}`;
  }

  if (currentUser) {
    container.innerHTML = `
      <a href="#feed" class="nav-item">🏠 Feed</a>
      <a href="#explore" class="nav-item">🔍 Explore</a>
      <a href="#upload" class="btn-upload-nav">➕ Post</a>
      <a href="#notifications" class="nav-item">
        🔔
        <span id="nav-notif-badge" class="badge" style="display:none;">0</span>
      </a>
      <a href="#profile/${currentUser.username}" style="display:flex; align-items:center; gap:0.5rem;">
        <img src="${currentUser.profile_picture}" class="user-avatar-btn" alt="${currentUser.username}">
      </a>
      <button onclick="logout()" class="nav-item" style="color:var(--accent-pink);">Logout</button>
    `;
  } else {
    container.innerHTML = `
      <button onclick="openModal('modal-login')" class="nav-item">Sign In</button>
      <button onclick="openModal('modal-register')" class="btn-upload-nav">Get Started</button>
    `;
  }
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  const username_or_email = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  const data = await apiRequest("/api/auth/login", "POST", { username_or_email, password });
  if (data && data.access_token) {
    authToken = data.access_token;
    localStorage.setItem("sports_jwt_token", authToken);
    closeModal("modal-login");
    await fetchCurrentUser();
    showToast("Welcome back! Successfully logged in.", "success");
    window.location.hash = "#feed";
  }
}

async function handleRegisterSubmit(e) {
  e.preventDefault();
  const username = document.getElementById("reg-username").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;
  const bio = document.getElementById("reg-bio").value;

  const newUser = await apiRequest("/api/auth/register", "POST", { username, email, password, bio });
  if (newUser) {
    closeModal("modal-register");
    showToast("Registration successful! Logging you in...", "success");
    // Auto login
    const loginData = await apiRequest("/api/auth/login", "POST", { username_or_email: username, password });
    if (loginData && loginData.access_token) {
      authToken = loginData.access_token;
      localStorage.setItem("sports_jwt_token", authToken);
      await fetchCurrentUser();
      window.location.hash = "#feed";
    }
  }
}

function logout(silent = false) {
  authToken = null;
  currentUser = null;
  localStorage.removeItem("sports_jwt_token");
  updateNavUI();
  if (!silent) showToast("Logged out successfully.", "success");
  window.location.hash = "#feed";
}

/* ==========================================================================
   Routing System
   ========================================================================== */
function handleRouting() {
  const hash = window.location.hash || "#feed";
  const main = document.getElementById("main-view-container");

  if (hash.startsWith("#feed")) {
    renderHomeFeedView(main);
  } else if (hash.startsWith("#explore")) {
    renderExploreView(main);
  } else if (hash.startsWith("#upload")) {
    if (!currentUser) {
      openModal("modal-login");
      window.location.hash = "#feed";
      return;
    }
    renderUploadView(main);
  } else if (hash.startsWith("#profile")) {
    const parts = hash.split("/");
    const targetUsername = parts[1] || (currentUser ? currentUser.username : null);
    if (!targetUsername) {
      openModal("modal-login");
      return;
    }
    renderProfileView(main, targetUsername);
  } else if (hash.startsWith("#notifications")) {
    if (!currentUser) {
      openModal("modal-login");
      return;
    }
    renderNotificationsView(main);
  } else if (hash.startsWith("#admin")) {
    if (!currentUser || !currentUser.is_admin) {
      showToast("Access Denied. Administrator privilege required.", "error");
      window.location.hash = "#feed";
      return;
    }
    renderAdminView(main);
  } else if (hash.startsWith("#login")) {
    openModal("modal-login");
  } else if (hash.startsWith("#register")) {
    openModal("modal-register");
  } else {
    renderHomeFeedView(main);
  }
}

/* ==========================================================================
   1. Home Feed View
   ========================================================================== */
async function renderHomeFeedView(container) {
  container.innerHTML = `
    <div class="category-bar">
      <button class="category-pill ${activeCategoryFilter==='All'?'active':''}" onclick="filterCategory('All')">🏆 All Sports</button>
      <button class="category-pill ${activeCategoryFilter==='Cricket'?'active':''}" onclick="filterCategory('Cricket')">🏏 Cricket</button>
      <button class="category-pill ${activeCategoryFilter==='Football'?'active':''}" onclick="filterCategory('Football')">⚽ Football</button>
      <button class="category-pill ${activeCategoryFilter==='Basketball'?'active':''}" onclick="filterCategory('Basketball')">🏀 Basketball</button>
      <button class="category-pill ${activeCategoryFilter==='Volleyball'?'active':''}" onclick="filterCategory('Volleyball')">🏐 Volleyball</button>
      <button class="category-pill ${activeCategoryFilter==='Tennis'?'active':''}" onclick="filterCategory('Tennis')">🎾 Tennis</button>
      <button class="category-pill ${activeCategoryFilter==='Badminton'?'active':''}" onclick="filterCategory('Badminton')">🏸 Badminton</button>
      <button class="category-pill ${activeCategoryFilter==='Athletics'?'active':''}" onclick="filterCategory('Athletics')">🏃 Athletics</button>
    </div>
    <div id="posts-list-target" style="display:flex; flex-direction:column; gap:1.5rem;">
      <p style="text-align:center; padding:2rem; color:var(--text-dim);">Loading posts...</p>
    </div>
  `;

  const endpoint = activeCategoryFilter === "All" ? "/api/posts" : `/api/posts?category=${activeCategoryFilter}`;
  const posts = await apiRequest(endpoint);
  
  const postsTarget = document.getElementById("posts-list-target");
  if (!posts || posts.length === 0) {
    postsTarget.innerHTML = `
      <div class="widget-card" style="text-align:center; padding:3rem;">
        <h3>No sports posts found in ${activeCategoryFilter} 🏆</h3>
        <p style="color:var(--text-muted); margin-top:0.5rem;">Be the first athlete to publish a photo or video!</p>
        <a href="#upload" class="btn-primary" style="display:inline-block; width:auto; margin-top:1rem;">Upload Post</a>
      </div>
    `;
    return;
  }

  postsTarget.innerHTML = posts.map(p => renderPostCardHTML(p)).join("");
}

function filterCategory(cat) {
  activeCategoryFilter = cat;
  if (window.location.hash.startsWith("#feed") || window.location.hash === "") {
    renderHomeFeedView(document.getElementById("main-view-container"));
  } else {
    window.location.hash = "#feed";
  }
}

/* Post Card HTML Generator */
function renderPostCardHTML(post) {
  const mediaObj = post.media && post.media.length > 0 ? post.media[0] : null;
  let mediaHTML = "";
  if (mediaObj) {
    if (mediaObj.media_type === "video") {
      mediaHTML = `<video src="${mediaObj.media_url}" controls preload="metadata"></video>`;
    } else {
      mediaHTML = `<img src="${mediaObj.media_url}" alt="Sports Media" loading="lazy">`;
    }
  }

  const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
  });

  const isLiked = post.is_liked;

  return `
    <article class="post-card" id="post-card-${post.id}">
      <div class="post-header">
        <div class="post-author">
          <a href="#profile/${post.author.username}">
            <img src="${post.author.profile_picture}" class="author-avatar" alt="${post.author.username}">
          </a>
          <div class="author-info">
            <h4>
              <a href="#profile/${post.author.username}">${post.author.username}</a>
            </h4>
            <p>${formattedDate}</p>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <span class="category-badge">${post.category}</span>
          ${(currentUser && (currentUser.id === post.user_id || currentUser.is_admin)) ? 
            `<button onclick="deletePost(${post.id})" title="Delete Post" style="color:var(--accent-pink); font-size:1.1rem; padding:0.2rem 0.5rem;">🗑️</button>` : ''}
        </div>
      </div>

      <div class="post-media-box">
        ${mediaHTML}
      </div>

      <div class="post-content">
        <p class="post-caption">${post.caption || ''}</p>
        <div class="post-hashtags">
          ${(post.hashtags || []).map(tag => `<span class="hashtag-tag">#${tag}</span>`).join(" ")}
        </div>
        <div class="post-stats">
          <span id="likes-count-${post.id}">${post.likes_count} Likes</span>
          <span>${post.comments_count} Comments</span>
        </div>
      </div>

      <div class="post-actions">
        <button class="action-btn ${isLiked ? 'liked' : ''}" id="like-btn-${post.id}" onclick="toggleLike(${post.id})">
          ❤️ ${isLiked ? 'Liked' : 'Like'}
        </button>
        <button class="action-btn" onclick="openCommentsModal(${post.id})">
          💬 Comment
        </button>
        <button class="action-btn" onclick="sharePost('${post.id}')">
          🔗 Share
        </button>
        <button class="action-btn" onclick="reportContent('post', ${post.id})" style="margin-left:auto; font-size:0.8rem; opacity:0.7;">
          🚩 Report
        </button>
      </div>
    </article>
  `;
}

/* ==========================================================================
   2. Explore / Search View
   ========================================================================== */
async function renderExploreView(container) {
  container.innerHTML = `
    <div class="widget-card">
      <h2 style="font-family:var(--font-heading); margin-bottom:1rem;">Explore & Search 🔍</h2>
      <div style="display:flex; gap:0.5rem; margin-bottom:1.5rem;">
        <input type="text" id="explore-search-input" class="form-control" placeholder="Search athletes, sports, or #hashtags..." style="flex:1;" onkeypress="if(event.key==='Enter') executeExploreSearch()">
        <button onclick="executeExploreSearch()" class="btn-primary" style="width:auto; padding:0 1.5rem;">Search</button>
      </div>
      <div id="explore-results-target">
        <p style="color:var(--text-dim); text-align:center; padding:1.5rem;">Loading explore content...</p>
      </div>
    </div>
  `;
  await executeExploreSearch();
}

async function executeExploreSearch() {
  const query = document.getElementById("explore-search-input") ? document.getElementById("explore-search-input").value : "";
  const target = document.getElementById("explore-results-target");
  if (!target) return;

  const data = await apiRequest(`/api/search?q=${encodeURIComponent(query)}`);
  if (!data) return;

  let html = "";

  // Users matched
  if (data.users && data.users.length > 0) {
    html += `<h3 style="margin-bottom:0.75rem; font-family:var(--font-heading);">Athletes (${data.users.length})</h3>`;
    html += `<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:1rem; margin-bottom:2rem;">`;
    data.users.forEach(u => {
      html += `
        <div class="widget-card" style="padding:1rem; text-align:center;">
          <img src="${u.profile_picture}" class="author-avatar" style="width:60px; height:60px; margin:0 auto 0.5rem auto;" alt="${u.username}">
          <h4 style="font-size:0.95rem;"><a href="#profile/${u.username}">${u.username}</a></h4>
          <a href="#profile/${u.username}" class="btn-follow" style="display:inline-block; margin-top:0.5rem;">View Profile</a>
        </div>
      `;
    });
    html += `</div>`;
  }

  // Posts matched / Popular posts
  const postsToShow = data.posts && data.posts.length > 0 ? data.posts : data.popular_posts;
  const sectionTitle = data.posts && data.posts.length > 0 ? "Matching Posts" : "Popular Sports Posts 🔥";

  html += `<h3 style="margin-bottom:1rem; font-family:var(--font-heading);">${sectionTitle}</h3>`;
  html += `<div style="display:flex; flex-direction:column; gap:1.5rem;">`;
  if (postsToShow && postsToShow.length > 0) {
    postsToShow.forEach(p => {
      html += renderPostCardHTML(p);
    });
  } else {
    html += `<p style="color:var(--text-dim);">No posts matched your search criteria.</p>`;
  }
  html += `</div>`;

  target.innerHTML = html;
}

function handleGlobalSearch(e) {
  if (e.key === "Enter") {
    const val = e.target.value;
    window.location.hash = "#explore";
    setTimeout(() => {
      const exploreInput = document.getElementById("explore-search-input");
      if (exploreInput) {
        exploreInput.value = val;
        executeExploreSearch();
      }
    }, 100);
  }
}

/* ==========================================================================
   3. Upload View
   ========================================================================== */
function renderUploadView(container) {
  container.innerHTML = `
    <div class="widget-card">
      <h2 style="font-family:var(--font-heading); margin-bottom:0.5rem;">Upload Sports Media 📸🎥</h2>
      <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1.5rem;">Share your training videos, match highlights, or sports action photos.</p>

      <form onsubmit="handleUploadSubmit(event)">
        <div class="form-group">
          <label>Select Sports Photo or Video</label>
          <div class="upload-dropzone" onclick="document.getElementById('upload-file-input').click()">
            <p style="font-size:1.5rem; margin-bottom:0.5rem;">📁</p>
            <p style="font-weight:700;">Click to select media file</p>
            <p style="font-size:0.8rem; color:var(--text-dim); margin-top:0.25rem;">Photos (JPG, PNG, WEBP max 10MB) | Videos (MP4, WEBM max 50MB)</p>
          </div>
          <input type="file" id="upload-file-input" style="display:none;" accept="image/*,video/*" onchange="handleFilePreview(event)">
          
          <div class="preview-container" id="media-preview-box"></div>
        </div>

        <div class="form-group">
          <label>Sports Category</label>
          <select id="upload-category" class="form-control" required>
            <option value="Cricket">Cricket 🏏</option>
            <option value="Football">Football ⚽</option>
            <option value="Basketball">Basketball 🏀</option>
            <option value="Volleyball">Volleyball 🏐</option>
            <option value="Tennis">Tennis 🎾</option>
            <option value="Badminton">Badminton 🏸</option>
            <option value="Athletics">Athletics 🏃</option>
            <option value="Other">Other 🏆</option>
          </select>
        </div>

        <div class="form-group">
          <label>Caption</label>
          <textarea id="upload-caption" class="form-control" rows="3" placeholder="Describe the action, match result, or technique..."></textarea>
        </div>

        <div class="form-group">
          <label>Hashtags (Comma or space separated)</label>
          <input type="text" id="upload-hashtags" class="form-control" placeholder="e.g. CricketWorld, MatchDay, SlamDunk">
        </div>

        <button type="submit" id="btn-publish-post" class="btn-primary">Publish Sports Post</button>
      </form>
    </div>
  `;
}

function handleFilePreview(e) {
  const file = e.target.files[0];
  const box = document.getElementById("media-preview-box");
  if (!file || !box) return;

  const url = URL.createObjectURL(file);
  box.style.display = "block";

  if (file.type.startsWith("video")) {
    box.innerHTML = `<video src="${url}" controls style="width:100%; height:300px; object-fit:cover;"></video>`;
  } else {
    box.innerHTML = `<img src="${url}" style="width:100%; height:300px; object-fit:cover;">`;
  }
}

async function handleUploadSubmit(e) {
  e.preventDefault();
  const fileInput = document.getElementById("upload-file-input");
  if (!fileInput.files || fileInput.files.length === 0) {
    showToast("Please select a photo or video to upload.", "error");
    return;
  }

  const btn = document.getElementById("btn-publish-post");
  btn.disabled = true;
  btn.innerText = "Publishing Post...";

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);
  formData.append("category", document.getElementById("upload-category").value);
  formData.append("caption", document.getElementById("upload-caption").value);
  formData.append("hashtags", document.getElementById("upload-hashtags").value);

  const res = await apiRequest("/api/posts", "POST", formData, true);
  btn.disabled = false;
  btn.innerText = "Publish Sports Post";

  if (res) {
    showToast("Sports post published successfully! 🏆", "success");
    window.location.hash = "#feed";
  }
}

/* ==========================================================================
   4. User Profile View
   ========================================================================== */
async function renderProfileView(container, username) {
  container.innerHTML = `<p style="text-align:center; padding:2rem; color:var(--text-dim);">Loading profile for ${username}...</p>`;

  const user = await apiRequest(`/api/users/${username}`);
  if (!user) {
    container.innerHTML = `<div class="widget-card" style="text-align:center;"><h2>User Not Found</h2></div>`;
    return;
  }

  const isOwnProfile = currentUser && currentUser.username === user.username;

  container.innerHTML = `
    <div class="profile-card">
      <img src="${user.profile_picture}" class="profile-avatar-xl" alt="${user.username}">
      <h2 style="font-family:var(--font-heading);">${user.username}</h2>
      <p style="color:var(--text-muted); max-width:450px;">${user.bio || 'Sports Enthusiast & Athlete'}</p>

      <div class="profile-stats">
        <div class="stat-box">
          <span class="stat-value">${user.total_posts}</span>
          <span class="stat-label">Posts</span>
        </div>
        <div class="stat-box">
          <span class="stat-value">${user.total_likes}</span>
          <span class="stat-label">Likes</span>
        </div>
        <div class="stat-box">
          <span class="stat-value" id="profile-followers-count">${user.followers_count}</span>
          <span class="stat-label">Followers</span>
        </div>
        <div class="stat-box">
          <span class="stat-value">${user.following_count}</span>
          <span class="stat-label">Following</span>
        </div>
      </div>

      <div>
        ${isOwnProfile ? 
          `<button onclick="openModal('modal-edit-profile')" class="btn-primary" style="width:auto; padding:0.6rem 1.5rem;">Edit Profile</button>` :
          `<button id="btn-follow-user" onclick="toggleFollow(${user.id})" class="btn-follow ${user.is_following ? 'following' : ''}" style="padding:0.6rem 1.8rem; font-size:0.9rem;">
            ${user.is_following ? 'Following' : 'Follow'}
          </button>`
        }
      </div>
    </div>

    <h3 style="font-family:var(--font-heading); margin-top:2rem; margin-bottom:1rem;">Uploaded Media (${user.total_posts})</h3>
    <div id="user-posts-target" style="display:flex; flex-direction:column; gap:1.5rem;">
      <p style="color:var(--text-dim);">Loading athlete posts...</p>
    </div>
  `;

  // Pre-fill edit modal
  if (isOwnProfile) {
    document.getElementById("edit-username").value = user.username;
    document.getElementById("edit-avatar").value = user.profile_picture;
    document.getElementById("edit-bio").value = user.bio || "";
  }

  // Load user posts
  const userPosts = await apiRequest(`/api/posts?username=${username}`);
  const postsTarget = document.getElementById("user-posts-target");
  if (!userPosts || userPosts.length === 0) {
    postsTarget.innerHTML = `<div class="widget-card" style="text-align:center;"><p style="color:var(--text-dim);">No posts uploaded yet.</p></div>`;
  } else {
    postsTarget.innerHTML = userPosts.map(p => renderPostCardHTML(p)).join("");
  }
}

async function handleProfileUpdateSubmit(e) {
  e.preventDefault();
  const username = document.getElementById("edit-username").value;
  const profile_picture = document.getElementById("edit-avatar").value;
  const bio = document.getElementById("edit-bio").value;

  const updated = await apiRequest("/api/users/profile", "PUT", { username, profile_picture, bio });
  if (updated) {
    currentUser = updated;
    closeModal("modal-edit-profile");
    updateNavUI();
    showToast("Profile updated successfully!", "success");
    renderProfileView(document.getElementById("main-view-container"), updated.username);
  }
}

/* ==========================================================================
   5. Notifications View
   ========================================================================== */
async function renderNotificationsView(container) {
  container.innerHTML = `<p style="text-align:center; padding:2rem; color:var(--text-dim);">Loading notifications...</p>`;

  const data = await apiRequest("/api/notifications");
  if (!data) return;

  // Mark all as read
  await apiRequest("/api/notifications/read", "PUT");
  fetchNotificationBadge();

  if (!data.notifications || data.notifications.length === 0) {
    container.innerHTML = `
      <div class="widget-card" style="text-align:center; padding:3rem;">
        <h3>No notifications yet 🔔</h3>
        <p style="color:var(--text-muted); margin-top:0.5rem;">When athletes like your posts or follow you, updates will show up here.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="widget-card">
      <h2 style="font-family:var(--font-heading); margin-bottom:1.25rem;">Notifications 🔔</h2>
      <div style="display:flex; flex-direction:column; gap:0.75rem;">
        ${data.notifications.map(n => {
          let text = "";
          if (n.type === "like") text = "liked your sports post ❤️";
          else if (n.type === "comment") text = "commented on your post 💬";
          else if (n.type === "follow") text = "started following you 👤";

          const date = new Date(n.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

          return `
            <div style="display:flex; align-items:center; gap:0.85rem; padding:0.75rem; background:rgba(255,255,255,0.03); border-radius:var(--radius-md); border-left:3px solid ${n.is_read?'transparent':'var(--primary)'};">
              <img src="${n.actor.profile_picture}" class="author-avatar" alt="${n.actor.username}">
              <div style="flex:1;">
                <p style="font-size:0.9rem;">
                  <a href="#profile/${n.actor.username}" style="font-weight:700; color:var(--text-main);">${n.actor.username}</a>
                  ${text}
                </p>
                <span style="font-size:0.75rem; color:var(--text-dim);">${date}</span>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

async function fetchNotificationBadge() {
  if (!currentUser) return;
  const data = await apiRequest("/api/notifications");
  if (data && data.unread_count > 0) {
    const navBadge = document.getElementById("nav-notif-badge");
    const sideBadge = document.getElementById("sidebar-notif-badge");
    if (navBadge) { navBadge.style.display = "inline-block"; navBadge.innerText = data.unread_count; }
    if (sideBadge) { sideBadge.style.display = "inline-block"; sideBadge.innerText = data.unread_count; }
  } else {
    const navBadge = document.getElementById("nav-notif-badge");
    const sideBadge = document.getElementById("sidebar-notif-badge");
    if (navBadge) navBadge.style.display = "none";
    if (sideBadge) sideBadge.style.display = "none";
  }
}

/* ==========================================================================
   6. Admin Moderation Dashboard View
   ========================================================================== */
async function renderAdminView(container) {
  container.innerHTML = `<p style="text-align:center; padding:2rem; color:var(--text-dim);">Loading administrator dashboard...</p>`;

  const stats = await apiRequest("/api/admin/stats");
  const reports = await apiRequest("/api/reports");
  const users = await apiRequest("/api/admin/users");

  if (!stats) return;

  container.innerHTML = `
    <div class="widget-card">
      <h2 style="font-family:var(--font-heading); margin-bottom:1rem;">Platform Administration 🛡️</h2>

      <!-- Metrics Cards -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:1rem; margin-bottom:2rem;">
        <div style="background:rgba(0,229,255,0.08); border:1px solid rgba(0,229,255,0.2); padding:1rem; border-radius:var(--radius-md); text-align:center;">
          <h3 style="font-size:1.6rem; color:var(--primary);">${stats.total_users}</h3>
          <span style="font-size:0.8rem; color:var(--text-muted);">Users</span>
        </div>
        <div style="background:rgba(255,42,109,0.08); border:1px solid rgba(255,42,109,0.2); padding:1rem; border-radius:var(--radius-md); text-align:center;">
          <h3 style="font-size:1.6rem; color:var(--accent-pink);">${stats.total_posts}</h3>
          <span style="font-size:0.8rem; color:var(--text-muted);">Posts</span>
        </div>
        <div style="background:rgba(255,255,255,0.05); padding:1rem; border-radius:var(--radius-md); text-align:center;">
          <h3 style="font-size:1.6rem; color:#fff;">${stats.total_likes}</h3>
          <span style="font-size:0.8rem; color:var(--text-muted);">Likes</span>
        </div>
        <div style="background:rgba(255,255,255,0.05); padding:1rem; border-radius:var(--radius-md); text-align:center;">
          <h3 style="font-size:1.6rem; color:#fff;">${stats.pending_reports}</h3>
          <span style="font-size:0.8rem; color:var(--text-muted);">Pending Reports</span>
        </div>
      </div>

      <!-- Moderation Reports -->
      <h3 style="font-family:var(--font-heading); margin-bottom:0.75rem;">Reported Content (${reports ? reports.length : 0})</h3>
      <table class="admin-table" style="margin-bottom:2rem;">
        <thead>
          <tr>
            <th>ID</th>
            <th>Reporter</th>
            <th>Target</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${(reports && reports.length > 0) ? reports.map(r => `
            <tr>
              <td>#${r.id}</td>
              <td>${r.reporter.username}</td>
              <td><span class="category-badge">${r.target_type} #${r.target_id}</span></td>
              <td>${r.reason}</td>
              <td><strong style="color:${r.status==='pending'?'var(--accent-pink)':'var(--primary)'};">${r.status}</strong></td>
              <td>
                ${r.status === 'pending' ? `
                  <button onclick="resolveReport(${r.id}, 'resolved')" class="btn-follow" style="font-size:0.75rem; padding:0.25rem 0.6rem;">Resolve</button>
                  <button onclick="resolveReport(${r.id}, 'dismissed')" style="color:var(--text-dim); font-size:0.75rem; margin-left:0.4rem;">Dismiss</button>
                ` : 'Done'}
              </td>
            </tr>
          `).join("") : `<tr><td colspan="6" style="text-align:center; color:var(--text-dim);">No active reports found.</td></tr>`}
        </tbody>
      </table>

      <!-- User Accounts Management -->
      <h3 style="font-family:var(--font-heading); margin-bottom:0.75rem;">Platform Registered Users</h3>
      <table class="admin-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Posts</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${(users && users.length > 0) ? users.map(u => `
            <tr>
              <td style="display:flex; align-items:center; gap:0.5rem;">
                <img src="${u.profile_picture}" class="author-avatar" style="width:28px; height:28px;" alt="${u.username}">
                <a href="#profile/${u.username}">${u.username}</a>
              </td>
              <td>${u.email}</td>
              <td>${u.total_posts}</td>
              <td>${u.is_admin ? '<strong style="color:var(--primary);">Admin</strong>' : 'User'}</td>
              <td>
                ${!u.is_admin ? `<button onclick="deleteUserByAdmin(${u.id})" class="btn-danger" style="font-size:0.75rem;">Delete User</button>` : '-'}
              </td>
            </tr>
          `).join("") : ''}
        </tbody>
      </table>
    </div>
  `;
}

async function resolveReport(reportId, newStatus) {
  const updated = await apiRequest(`/api/reports/${reportId}`, "PUT", { status: newStatus });
  if (updated) {
    showToast(`Report #${reportId} marked as ${newStatus}`, "success");
    renderAdminView(document.getElementById("main-view-container"));
  }
}

async function deleteUserByAdmin(userId) {
  if (confirm("Are you sure you want to delete this user and all their content?")) {
    const ok = await apiRequest(`/api/admin/users/${userId}`, "DELETE");
    if (ok) {
      showToast("User deleted successfully", "success");
      renderAdminView(document.getElementById("main-view-container"));
    }
  }
}

/* ==========================================================================
   Interactive Actions (Likes, Comments, Follows, Reports)
   ========================================================================== */
async function toggleLike(postId) {
  if (!currentUser) {
    openModal("modal-login");
    return;
  }

  const btn = document.getElementById(`like-btn-${postId}`);
  const countSpan = document.getElementById(`likes-count-${postId}`);
  const isCurrentlyLiked = btn.classList.contains("liked");

  // Optimistic UI Update
  if (isCurrentlyLiked) {
    btn.classList.remove("liked");
    btn.innerHTML = "❤️ Like";
    const currentCount = parseInt(countSpan.innerText) || 1;
    countSpan.innerText = `${Math.max(0, currentCount - 1)} Likes`;
  } else {
    btn.classList.add("liked");
    btn.innerHTML = "❤️ Liked";
    const currentCount = parseInt(countSpan.innerText) || 0;
    countSpan.innerText = `${currentCount + 1} Likes`;
  }

  const endpoint = `/api/posts/${postId}/like`;
  const res = await apiRequest(endpoint, isCurrentlyLiked ? "DELETE" : "POST");
  if (res && res.likes_count !== undefined) {
    countSpan.innerText = `${res.likes_count} Likes`;
  }
}

async function toggleFollow(userId) {
  if (!currentUser) {
    openModal("modal-login");
    return;
  }

  const btn = document.getElementById("btn-follow-user");
  const isFollowing = btn.classList.contains("following");

  // Optimistic update
  if (isFollowing) {
    btn.classList.remove("following");
    btn.innerText = "Follow";
  } else {
    btn.classList.add("following");
    btn.innerText = "Following";
  }

  const endpoint = `/api/users/${userId}/follow`;
  const res = await apiRequest(endpoint, isFollowing ? "DELETE" : "POST");
  if (res) {
    const followersSpan = document.getElementById("profile-followers-count");
    if (followersSpan && res.followers_count !== undefined) {
      followersSpan.innerText = res.followers_count;
    }
  }
}

async function openCommentsModal(postId) {
  activePostForComments = postId;
  openModal("modal-comments");
  
  const listTarget = document.getElementById("modal-comments-list");
  listTarget.innerHTML = `<p style="color:var(--text-dim); text-align:center;">Loading comments...</p>`;

  const comments = await apiRequest(`/api/posts/${postId}/comments`);
  if (!comments || comments.length === 0) {
    listTarget.innerHTML = `<p style="color:var(--text-dim); text-align:center; padding:1rem;">No comments yet. Be the first to comment!</p>`;
    return;
  }

  listTarget.innerHTML = comments.map(c => `
    <div style="display:flex; align-items:flex-start; gap:0.75rem; padding:0.6rem; background:rgba(255,255,255,0.03); border-radius:var(--radius-md);">
      <img src="${c.user.profile_picture}" class="author-avatar" style="width:32px; height:32px;" alt="${c.user.username}">
      <div style="flex:1;">
        <p style="font-size:0.85rem;">
          <a href="#profile/${c.user.username}" style="font-weight:700; color:var(--text-main);">${c.user.username}</a>
          <span style="color:var(--text-muted); margin-left:0.5rem;">${c.content}</span>
        </p>
        <span style="font-size:0.72rem; color:var(--text-dim);">${new Date(c.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
      </div>
      ${(currentUser && (currentUser.id === c.user_id || currentUser.is_admin)) ? 
        `<button onclick="deleteComment(${c.id})" style="color:var(--accent-pink); font-size:0.8rem;">✕</button>` : ''}
    </div>
  `).join("");
}

async function handleCommentSubmit(e) {
  e.preventDefault();
  if (!currentUser) {
    openModal("modal-login");
    return;
  }
  const input = document.getElementById("comment-input");
  const content = input.value;
  if (!content || !activePostForComments) return;

  const newComment = await apiRequest(`/api/posts/${activePostForComments}/comments`, "POST", { content });
  if (newComment) {
    input.value = "";
    openCommentsModal(activePostForComments);
  }
}

async function deleteComment(commentId) {
  const ok = await apiRequest(`/api/comments/${commentId}`, "DELETE");
  if (ok) {
    showToast("Comment deleted", "success");
    openCommentsModal(activePostForComments);
  }
}

async function deletePost(postId) {
  if (confirm("Are you sure you want to delete this sports post?")) {
    const ok = await apiRequest(`/api/posts/${postId}`, "DELETE");
    if (ok) {
      showToast("Post deleted successfully", "success");
      const card = document.getElementById(`post-card-${postId}`);
      if (card) card.remove();
    }
  }
}

async function reportContent(targetType, targetId) {
  if (!currentUser) {
    openModal("modal-login");
    return;
  }
  const reason = prompt("Please enter the reason for reporting this content:");
  if (reason && reason.trim()) {
    const res = await apiRequest("/api/reports", "POST", { target_type: targetType, target_id: targetId, reason: reason.trim() });
    if (res) {
      showToast("Report submitted to platform moderators. Thank you!", "success");
    }
  }
}

function sharePost(postId) {
  const shareUrl = `${window.location.origin}/#feed`;
  navigator.clipboard.writeText(shareUrl).then(() => {
    showToast("Post link copied to clipboard! 🔗", "success");
  }).catch(() => {
    showToast("Link: " + shareUrl, "success");
  });
}

/* ==========================================================================
   Sidebar Widgets Loader
   ========================================================================== */
async function loadTrendingWidget() {
  const target = document.getElementById("trending-hashtags-list");
  if (!target) return;

  const data = await apiRequest("/api/search");
  if (data && data.hashtags && data.hashtags.length > 0) {
    target.innerHTML = data.hashtags.slice(0, 5).map(h => `
      <div class="trending-item">
        <span class="trending-tag">#${h.tag}</span>
        <span class="trending-count">${h.count} posts</span>
      </div>
    `).join("");
  } else {
    target.innerHTML = `<p style="font-size:0.82rem; color:var(--text-dim);">No trending tags yet.</p>`;
  }
}

async function loadSuggestedAthletes() {
  const target = document.getElementById("suggested-users-list");
  if (!target) return;

  const data = await apiRequest("/api/search");
  if (data && data.popular_posts && data.popular_posts.length > 0) {
    const uniqueUsers = [];
    const seen = new Set();
    data.popular_posts.forEach(p => {
      if (!seen.has(p.author.username)) {
        seen.add(p.author.username);
        uniqueUsers.push(p.author);
      }
    });

    target.innerHTML = uniqueUsers.slice(0, 4).map(u => `
      <div class="user-mini-card">
        <div style="display:flex; align-items:center; gap:0.6rem;">
          <img src="${u.profile_picture}" class="author-avatar" style="width:34px; height:34px;" alt="${u.username}">
          <a href="#profile/${u.username}" style="font-weight:700; font-size:0.85rem; color:var(--text-main);">${u.username}</a>
        </div>
        <a href="#profile/${u.username}" class="btn-follow">View</a>
      </div>
    `).join("");
  } else {
    target.innerHTML = `<p style="font-size:0.82rem; color:var(--text-dim);">No suggested users.</p>`;
  }
}

/* ==========================================================================
   Modal & Toast Helpers
   ========================================================================== */
function openModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.add("active");
}

function closeModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.remove("active");
}

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✅' : '⚠️'}</span> <span>${message}</span>`;
  
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
