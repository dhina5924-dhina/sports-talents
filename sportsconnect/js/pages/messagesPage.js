window.SportsConnect = window.SportsConnect || {};
SportsConnect.pages = SportsConnect.pages || {};

SportsConnect.pages.messagesPage = {
    render(params) {
        const store = SportsConnect.store;
        const conversations = store ? store.getConversations() : [];
        const activeConvId = params && params.id ? Number(params.id) : (conversations[0] ? conversations[0].id : null);
        const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];

        const convListHtml = conversations.map(c => `
            <div class="conv-item ${activeConv && activeConv.id === c.id ? 'active' : ''}" data-id="${c.id}" style="display: flex; gap: 12px; padding: 14px 16px; border-bottom: 1px solid var(--border); cursor: pointer; background: ${activeConv && activeConv.id === c.id ? 'var(--surface-hover)' : 'var(--surface)'}; transition: background 0.2s;">
                <div style="width: 48px; height: 48px; border-radius: 50%; background: ${c.user.avatarBg || 'var(--primary-light)'}; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; position: relative;">
                    ${c.user.avatar}
                    <div style="position: absolute; bottom: 2px; right: 2px; width: 12px; height: 12px; background: ${c.user.online ? 'var(--success)' : 'var(--text-muted)'}; border: 2px solid var(--surface); border-radius: 50%;"></div>
                </div>
                <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span style="font-weight: 600; color: var(--text); font-size: 14px;">${c.user.name}</span>
                        <span style="font-size: 12px; color: var(--text-muted);">${c.lastTime}</span>
                    </div>
                    <p style="margin: 0; font-size: 13px; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${c.lastMessage}</p>
                </div>
                ${c.unread ? `<span class="badge badge--primary" style="align-self: center;">${c.unread}</span>` : ''}
            </div>
        `).join('');

        let chatHtml = '';
        if (activeConv) {
            const messagesHtml = activeConv.messages.map(m => {
                const isMe = m.senderId === store.getCurrentUser().id;
                return `
                    <div style="display: flex; justify-content: ${isMe ? 'flex-end' : 'flex-start'}; margin-bottom: 12px;">
                        <div style="max-width: 70%; padding: 12px 16px; border-radius: ${isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px'}; background: ${isMe ? 'var(--primary)' : 'var(--surface-hover)'}; color: ${isMe ? '#ffffff' : 'var(--text)'}; font-size: 14px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                            <p style="margin: 0; line-height: 1.4;">${m.text}</p>
                            <span style="font-size: 10px; opacity: 0.75; display: block; text-align: right; margin-top: 4px;">${m.time}</span>
                        </div>
                    </div>
                `;
            }).join('');

            chatHtml = `
                <div class="chat-container" style="display: flex; flex-direction: column; height: 100%;">
                    <div class="chat-header" style="padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: var(--surface);">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 40px; height: 40px; border-radius: 50%; background: ${activeConv.user.avatarBg || 'var(--primary-light)'}; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                                ${activeConv.user.avatar}
                            </div>
                            <div>
                                <h4 style="margin: 0; font-size: 16px; color: var(--text);">${activeConv.user.name}</h4>
                                <span style="font-size: 12px; color: ${activeConv.user.online ? 'var(--success)' : 'var(--text-muted)'};">${activeConv.user.online ? '🟢 Online' : 'Offline'} • ${activeConv.user.role}</span>
                            </div>
                        </div>
                    </div>
                    <div class="chat-body" style="flex: 1; padding: 20px; overflow-y: auto; background: var(--bg);">
                        ${messagesHtml}
                    </div>
                    <div class="chat-footer" style="padding: 16px 20px; border-top: 1px solid var(--border); background: var(--surface);">
                        <form id="msg-form" style="display: flex; gap: 10px;">
                            <input type="text" id="msg-input" class="form-input" placeholder="Type a message to ${activeConv.user.name}..." style="flex: 1;" required>
                            <button type="submit" class="btn btn--primary" style="padding: 0 20px;">Send 🚀</button>
                        </form>
                    </div>
                </div>
            `;
        } else {
            chatHtml = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-muted); text-align: center; padding: 40px;">
                    <span style="font-size: 48px; margin-bottom: 16px;">💬</span>
                    <h3>Your Messages</h3>
                    <p>Select a conversation to start chatting with athletes, coaches, and scouts.</p>
                </div>
            `;
        }

        return `
            <div class="messages-page card" style="height: calc(100vh - 120px); overflow: hidden; display: flex; border-radius: var(--radius-lg);">
                <div style="width: 320px; border-right: 1px solid var(--border); display: flex; flex-direction: column; background: var(--surface);">
                    <div style="padding: 16px; border-bottom: 1px solid var(--border);">
                        <h2 style="margin: 0 0 12px 0; font-size: 20px;">Messages 💬</h2>
                        <input type="text" class="form-input" placeholder="Search chats..." style="width: 100%; font-size: 13px;">
                    </div>
                    <div style="flex: 1; overflow-y: auto;">
                        ${convListHtml}
                    </div>
                </div>
                <div style="flex: 1; display: flex; flex-direction: column; background: var(--surface);">
                    ${chatHtml}
                </div>
            </div>
        `;
    },

    init(params) {
        const convItems = document.querySelectorAll('.conv-item');
        convItems.forEach(item => {
            item.addEventListener('click', () => {
                const id = item.dataset.id;
                SportsConnect.router.navigate(`messages?id=${id}`);
            });
        });

        const form = document.getElementById('msg-form');
        const input = document.getElementById('msg-input');
        if (form && input) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const text = input.value.trim();
                if (!text) return;
                const activeId = params && params.id ? Number(params.id) : 1;
                SportsConnect.store.sendMessage(activeId, text);
                input.value = '';
                SportsConnect.router.handleRoute();
            });
        }
    }
};
