window.SportsConnect = window.SportsConnect || {};

(function() {
    const STORAGE_KEY = 'sportsconnect_app_state_v1';

    function loadInitialState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge with sample data structure to ensure fallback integrity
                return Object.assign({}, window.SportsConnect.sampleData, parsed);
            }
        } catch (e) {
            console.warn('Failed to load stored state, using sampleData:', e);
        }
        return JSON.parse(JSON.stringify(window.SportsConnect.sampleData || {}));
    }

    class Store {
        constructor() {
            this.state = loadInitialState();
            this.listeners = [];
        }

        save() {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
            } catch (e) {
                console.warn('Failed to persist state:', e);
            }
            this.notify();
        }

        subscribe(listener) {
            if (typeof listener === 'function') {
                this.listeners.push(listener);
            }
            return () => {
                this.listeners = this.listeners.filter(l => l !== listener);
            };
        }

        notify() {
            this.listeners.forEach(fn => {
                try { fn(this.state); } catch (err) { console.error('Listener error:', err); }
            });
        }

        // --- Current User ---
        getCurrentUser() {
            return this.state.currentUser;
        }

        setCurrentUser(user) {
            this.state.currentUser = Object.assign({}, this.state.currentUser, user);
            this.save();
        }

        updateUserProfile(data) {
            this.state.currentUser = Object.assign({}, this.state.currentUser, data);
            // Also update in users list if present
            const uIdx = this.state.users.findIndex(u => u.id === this.state.currentUser.id);
            if (uIdx !== -1) {
                this.state.users[uIdx] = Object.assign({}, this.state.users[uIdx], data);
            }
            this.save();
        }

        // --- Users & Athletes ---
        getUsers() {
            return this.state.users || [];
        }

        getUserById(id) {
            const numId = Number(id);
            if (this.state.currentUser && (this.state.currentUser.id === numId || id === 'current')) {
                return this.state.currentUser;
            }
            return this.getUsers().find(u => u.id === numId);
        }

        toggleFollow(userId) {
            const u = this.getUserById(userId);
            if (!u) return false;
            u.isFollowing = !u.isFollowing;
            u.followers += u.isFollowing ? 1 : -1;
            
            // Add notification
            if (u.isFollowing) {
                this.state.notifications.unshift({
                    id: Date.now(),
                    type: 'follow',
                    text: `You started following <strong>${u.name}</strong>.`,
                    time: 'Just now',
                    read: false
                });
            }
            this.save();
            return u.isFollowing;
        }

        // --- Sports ---
        getSports() {
            return this.state.sports || [];
        }

        getSportById(id) {
            return this.getSports().find(s => s.id === id || s.name.toLowerCase() === String(id).toLowerCase());
        }

        // --- Posts ---
        getPosts(filter = {}) {
            let posts = [...(this.state.posts || [])];
            if (filter.sport) {
                posts = posts.filter(p => p.sport.toLowerCase() === filter.sport.toLowerCase());
            }
            if (filter.authorId) {
                posts = posts.filter(p => p.authorId === Number(filter.authorId));
            }
            if (filter.savedOnly) {
                posts = posts.filter(p => p.isSaved);
            }
            if (filter.type) {
                posts = posts.filter(p => p.type === filter.type);
            }
            return posts;
        }

        addPost(postData) {
            const cu = this.getCurrentUser();
            const newPost = Object.assign({
                id: Date.now(),
                authorId: cu.id,
                authorName: cu.name,
                username: cu.username,
                authorAvatar: cu.avatar,
                avatarBg: cu.avatarBg,
                verified: cu.verified,
                sport: cu.sport || "Athletics",
                location: `${cu.location.village}, ${cu.location.district}`,
                time: "Just now",
                likes: 0,
                comments: 0,
                shares: 0,
                isLiked: false,
                isSaved: false
            }, postData);

            this.state.posts.unshift(newPost);
            cu.stats.posts = (cu.stats.posts || 0) + 1;
            this.save();
            return newPost;
        }

        toggleLike(postId) {
            const post = this.state.posts.find(p => p.id === Number(postId));
            if (post) {
                post.isLiked = !post.isLiked;
                post.likes += post.isLiked ? 1 : -1;
                this.save();
                return { isLiked: post.isLiked, count: post.likes };
            }
            return null;
        }

        toggleSave(postId) {
            const post = this.state.posts.find(p => p.id === Number(postId));
            if (post) {
                post.isSaved = !post.isSaved;
                this.save();
                return post.isSaved;
            }
            return false;
        }

        addComment(postId, text) {
            const post = this.state.posts.find(p => p.id === Number(postId));
            if (post) {
                post.comments = (post.comments || 0) + 1;
                if (!post.commentsList) post.commentsList = [];
                const cu = this.getCurrentUser();
                const newComment = {
                    id: Date.now(),
                    authorName: cu.name,
                    authorAvatar: cu.avatar,
                    text: text,
                    time: "Just now",
                    likes: 0
                };
                post.commentsList.push(newComment);
                this.save();
                return newComment;
            }
            return null;
        }

        // --- Events ---
        getEvents(filter = {}) {
            let events = [...(this.state.events || [])];
            if (filter.status && filter.status !== 'All') {
                events = events.filter(e => e.status.toLowerCase() === filter.status.toLowerCase());
            }
            if (filter.sport) {
                events = events.filter(e => e.sport.toLowerCase() === filter.sport.toLowerCase());
            }
            return events;
        }

        getEventById(id) {
            return (this.state.events || []).find(e => e.id === Number(id));
        }

        registerForEvent(eventId) {
            const ev = this.getEventById(eventId);
            if (ev) {
                ev.registered = true;
                ev.participantsCount = (ev.participantsCount || 0) + 1;
                this.state.notifications.unshift({
                    id: Date.now(),
                    type: "event",
                    text: `Successfully registered for <strong>${ev.title}</strong>!`,
                    time: "Just now",
                    read: false
                });
                this.save();
                return true;
            }
            return false;
        }

        // --- Videos ---
        getVideos() {
            return this.state.videos || [];
        }

        // --- Villages ---
        getVillages() {
            return this.state.villages || [];
        }

        // --- Notifications ---
        getNotifications() {
            return this.state.notifications || [];
        }

        getUnreadCount() {
            return (this.state.notifications || []).filter(n => !n.read).length;
        }

        markAllNotificationsRead() {
            (this.state.notifications || []).forEach(n => n.read = true);
            this.save();
        }

        // --- Messaging ---
        getConversations() {
            return this.state.conversations || [];
        }

        getConversation(id) {
            return (this.state.conversations || []).find(c => c.id === Number(id));
        }

        sendMessage(convId, text) {
            const conv = this.getConversation(convId);
            if (conv) {
                const msg = {
                    id: Date.now(),
                    senderId: this.getCurrentUser().id,
                    text: text,
                    time: "Just now"
                };
                conv.messages.push(msg);
                conv.lastMessage = text;
                conv.lastTime = "Just now";
                this.save();
                return msg;
            }
            return null;
        }

        // --- Search ---
        globalSearch(query) {
            if (!query || !query.trim()) {
                return { athletes: [], sports: [], events: [], posts: [], videos: [] };
            }
            const q = query.toLowerCase().trim();
            const users = this.getUsers().filter(u => 
                u.name.toLowerCase().includes(q) || 
                u.sport.toLowerCase().includes(q) || 
                u.location.village.toLowerCase().includes(q) ||
                u.location.district.toLowerCase().includes(q)
            );
            const sports = this.getSports().filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
            const events = this.getEvents().filter(e => e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q));
            const posts = this.getPosts().filter(p => p.text.toLowerCase().includes(q) || p.sport.toLowerCase().includes(q));
            const videos = this.getVideos().filter(v => v.title.toLowerCase().includes(q) || v.sport.toLowerCase().includes(q));

            return { athletes: users, sports, events, posts, videos };
        }

        // --- Admin Verification ---
        getVerificationRequests() {
            return [
                { id: 1, athleteName: "Senthil Kumar", sport: "Cricket", village: "Usilampatti", date: "Yesterday", status: "Pending", document: "District Certificate.pdf" },
                { id: 2, athleteName: "Ramesh Babu", sport: "Volleyball", village: "Theni", date: "2 days ago", status: "Pending", document: "School Sports ID.jpg" }
            ];
        }
    }

    SportsConnect.store = new Store();
})();
