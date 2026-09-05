window.SportsConnect = window.SportsConnect || {};
SportsConnect.components = SportsConnect.components || {};

SportsConnect.components.messaging = {
    renderConversationList(conversations, activeId) {
        if (!conversations || conversations.length === 0) {
            return '<div class="messaging__empty">No conversations yet.</div>';
        }

        return conversations.map(conv => {
            const isActive = conv.id === activeId ? 'active' : '';
            const unreadBadge = conv.unreadCount > 0 
                ? `<span class="messaging__unread-badge">${conv.unreadCount}</span>` 
                : '';
                
            return `
                <div class="messaging__list-item ${isActive}" data-id="${conv.id}">
                    <div class="avatar messaging__avatar" style="background: ${conv.userAvatarColor || 'var(--primary)'}">
                        ${conv.userAvatar || '👤'}
                        ${conv.online ? '<div class="online-indicator"></div>' : ''}
                    </div>
                    <div class="messaging__list-info">
                        <div class="messaging__list-header">
                            <span class="messaging__list-name">${conv.userName}</span>
                            <span class="messaging__list-time">${conv.lastTimestamp}</span>
                        </div>
                        <div class="messaging__list-preview">
                            <span class="text-truncate">${conv.lastMessage}</span>
                            ${unreadBadge}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    renderChat(conversation, messages, currentUserId) {
        if (!conversation) {
            return `
                <div class="messaging__chat-empty">
                    <div class="icon-large">💬</div>
                    <h3>Your Messages</h3>
                    <p>Select a conversation from the sidebar to start chatting.</p>
                </div>
            `;
        }

        const messagesHtml = messages.map(msg => {
            const isMe = msg.senderId === currentUserId;
            const bubbleClass = isMe ? 'message-bubble--sent' : 'message-bubble--received';
            
            return `
                <div class="message-wrapper ${isMe ? 'message-wrapper--right' : 'message-wrapper--left'}">
                    <div class="message-bubble ${bubbleClass}">
                        ${msg.text}
                    </div>
                    <div class="message-time">${msg.timestamp}</div>
                </div>
            `;
        }).join('');

        return `
            <div class="messaging__chat">
                <div class="messaging__chat-header">
                    <div class="messaging__chat-user">
                        <div class="avatar" style="background: ${conversation.userAvatarColor || 'var(--primary)'}">
                            ${conversation.userAvatar || '👤'}
                        </div>
                        <div>
                            <h3 class="m-0">${conversation.userName}</h3>
                            <span class="text-sm text-tertiary">${conversation.online ? 'Online' : 'Offline'}</span>
                        </div>
                    </div>
                    <div class="messaging__chat-actions">
                        <button class="icon-btn" title="Call">📞</button>
                        <button class="icon-btn" title="More">⋮</button>
                    </div>
                </div>
                
                <div class="messaging__chat-body" id="chat-messages-container">
                    ${messagesHtml}
                </div>
                
                <div class="messaging__chat-input-area">
                    <button class="icon-btn" title="Attach file">📎</button>
                    <input type="text" class="messaging__input" id="chat-input" placeholder="Type a message...">
                    <button class="btn btn--primary" id="chat-send-btn">Send</button>
                </div>
            </div>
        `;
    },

    init() {
        const sendBtn = document.getElementById('chat-send-btn');
        const input = document.getElementById('chat-input');
        const container = document.getElementById('chat-messages-container');

        const sendMessage = () => {
            if (input && input.value.trim() !== '' && container) {
                const text = input.value.trim();
                const now = new Date();
                const time = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
                
                const msgHtml = `
                    <div class="message-wrapper message-wrapper--right" style="animation: slideUp 0.3s ease;">
                        <div class="message-bubble message-bubble--sent">
                            ${text}
                        </div>
                        <div class="message-time">${time}</div>
                    </div>
                `;
                
                container.insertAdjacentHTML('beforeend', msgHtml);
                input.value = '';
                this.scrollToBottom(container);
            }
        };

        if (sendBtn) sendBtn.addEventListener('click', sendMessage);
        if (input) input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        // Initialize scroll position
        if (container) this.scrollToBottom(container);
    },

    scrollToBottom(container) {
        container.scrollTop = container.scrollHeight;
    }
};
