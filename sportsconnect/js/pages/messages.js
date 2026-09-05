window.SportsConnect = window.SportsConnect || {};
SportsConnect.pages = SportsConnect.pages || {};

SportsConnect.pages.messagesPage = {
    render() {
        const users = SportsConnect.store ? SportsConnect.store.getUsers() : [];
        const currentUser = users.find(u => u.id === 1) || users[0];
        const conversations = [
            { id: 1, userId: 2, name: 'Coach Ravi', avatar: '👨‍🏫', avatarBg: '#f59e0b', text: 'Great run today. Let’s focus on starts tomorrow.', time: '10:30 AM', unread: 2 },
            { id: 2, userId: 3, name: 'Siva', avatar: '🏃', avatarBg: '#3b82f6', text: 'Are you joining the district meet?', time: 'Yesterday', unread: 0 },
            { id: 3, userId: 4, name: 'Theni Athletics Club', avatar: '🏆', avatarBg: '#10b981', text: 'Training cancelled due to rain.', time: 'Mon', unread: 0 }
        ];

        let convListHtml = conversations.map(c => `
            <div class="conv-item" data-id="${c.id}" style="display: flex; gap: 12px; padding: 16px; border-bottom: 1px solid var(--border); cursor: pointer; transition: background 0.2s; background: ${c.unread ? 'var(--surface-hover)' : 'var(--surface)'};">
                <div style="width: 48px; height: 48px; border-radius: 50%; background: ${c.avatarBg}; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; position: relative;">
                    ${c.avatar}
                    <div style="position: absolute; bottom: 0; right: 0; width: 12px; height: 12px; background: var(--success); border: 2px solid var(--surface); border-radius: 50%;"></div>
                </div>
                <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span style="font-weight: ${c.unread ? 'bold' : '500'}; color: var(--text);">${c.name}</span>
                        <span style="font-size: 12px; color: ${c.unread ? 'var(--primary)' : 'var(--text-secondary)'};">${c.time}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <p style="font-size: 13px; color: ${c.unread ? 'var(--text)' : 'var(--text-secondary)'}; font-weight: ${c.unread ? '500' : 'normal'}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0;">${c.text}</p>
                        ${c.unread ? `<span style="background: var(--primary); color: white; font-size: 11px; padding: 2px 6px; border-radius: 10px; font-weight: bold;">${c.unread}</span>` : ''}
                    </div>
                </div>
            </div>
        `).join('');

        return `
        <div class="page-container" style="padding-bottom: var(--space-4xl); height: calc(100vh - 120px);">
            <div style="display: flex; height: 100%; background: var(--surface); border-radius: var(--radius-xl); overflow: hidden; border: 1px solid var(--border); box-shadow: var(--shadow-md);">
                
                <!-- Left Panel: Conversations -->
                <div class="messages-left" style="width: 350px; border-right: 1px solid var(--border); display: flex; flex-direction: column; background: var(--surface);">
                    <div style="padding: 20px; border-bottom: 1px solid var(--border);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                            <h2 style="font-family: 'Outfit', sans-serif; font-size: 24px; margin: 0;">Messages</h2>
                            <button style="background: var(--primary-light); color: white; border: none; width: 36px; height: 36px; border-radius: 50%; font-size: 20px; display: flex; align-items: center; justify-content: center; cursor: pointer;">+</button>
                        </div>
                        <div style="position: relative;">
                            <input type="text" placeholder="Search messages..." style="width: 100%; padding: 10px 10px 10px 36px; border-radius: var(--radius-md); border: 1px solid var(--border); background: var(--bg); outline: none;">
                            <svg style="position: absolute; left: 10px; top: 10px; color: var(--text-tertiary);" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        </div>
                    </div>
                    
                    <div style="flex: 1; overflow-y: auto;">
                        ${convListHtml}
                    </div>
                </div>
                
                <!-- Right Panel: Chat -->
                <div class="messages-right" style="flex: 1; display: flex; flex-direction: column; background: var(--bg); position: relative;">
                    <!-- Empty State -->
                    <div id="chat-empty" style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--bg); z-index: 10;">
                        <div style="font-size: 64px; color: var(--text-tertiary); margin-bottom: 16px;">💬</div>
                        <h3 style="color: var(--text-secondary); font-family: 'Outfit', sans-serif;">Select a conversation to start messaging</h3>
                    </div>
                    
                    <!-- Chat Header -->
                    <div id="chat-header" style="padding: 16px 20px; background: var(--surface); border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div id="chat-avatar" style="width: 40px; height: 40px; border-radius: 50%; background: #f59e0b; display: flex; align-items: center; justify-content: center; font-size: 20px;">👨‍🏫</div>
                            <div>
                                <h3 id="chat-name" style="margin: 0; font-size: 16px;">Coach Ravi</h3>
                                <p style="margin: 0; font-size: 12px; color: var(--success); font-weight: 500;">Online</p>
                            </div>
                        </div>
                        <div style="display: flex; gap: 12px;">
                            <button style="background: none; border: none; cursor: pointer; color: var(--text-secondary);"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></button>
                            <button style="background: none; border: none; cursor: pointer; color: var(--text-secondary);"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg></button>
                        </div>
                    </div>
                    
                    <!-- Chat Messages -->
                    <div id="chat-body" style="flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px;">
                        <div style="text-align: center; margin: 10px 0;">
                            <span style="background: var(--border-light); color: var(--text-secondary); padding: 4px 12px; border-radius: 12px; font-size: 11px;">Yesterday, 8:45 AM</span>
                        </div>
                        
                        <!-- Received Message -->
                        <div style="display: flex; gap: 10px; max-width: 80%;">
                            <div style="width: 32px; height: 32px; border-radius: 50%; background: #f59e0b; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;">👨‍🏫</div>
                            <div>
                                <div style="background: var(--surface); border: 1px solid var(--border); padding: 12px 16px; border-radius: 0 16px 16px 16px; color: var(--text); font-size: 14px; box-shadow: var(--shadow-sm);">
                                    How was your sprint practice today?
                                </div>
                                <div style="font-size: 11px; color: var(--text-tertiary); margin-top: 4px;">8:45 AM</div>
                            </div>
                        </div>
                        
                        <!-- Sent Message -->
                        <div style="display: flex; gap: 10px; max-width: 80%; align-self: flex-end; flex-direction: row-reverse;">
                            <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 16px; color: white; flex-shrink: 0;">ME</div>
                            <div>
                                <div style="background: var(--primary); color: white; padding: 12px 16px; border-radius: 16px 0 16px 16px; font-size: 14px; box-shadow: var(--shadow-sm);">
                                    Felt good! Clocked 11.2s.
                                </div>
                                <div style="font-size: 11px; color: var(--text-tertiary); margin-top: 4px; text-align: right;">8:50 AM</div>
                            </div>
                        </div>
                        
                        <!-- Received Message -->
                        <div style="display: flex; gap: 10px; max-width: 80%;">
                            <div style="width: 32px; height: 32px; border-radius: 50%; background: #f59e0b; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;">👨‍🏫</div>
                            <div>
                                <div style="background: var(--surface); border: 1px solid var(--border); padding: 12px 16px; border-radius: 0 16px 16px 16px; color: var(--text); font-size: 14px; box-shadow: var(--shadow-sm);">
                                    Great run today. Let’s focus on starts tomorrow.
                                </div>
                                <div style="font-size: 11px; color: var(--text-tertiary); margin-top: 4px;">10:30 AM</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Chat Input -->
                    <div style="padding: 16px 20px; background: var(--surface); border-top: 1px solid var(--border); display: flex; gap: 12px; align-items: center;">
                        <button style="background: none; border: none; color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; transition: background 0.2s;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg></button>
                        <input id="chat-input" type="text" placeholder="Type a message..." style="flex: 1; padding: 12px 16px; border-radius: 20px; border: 1px solid var(--border); background: var(--bg); outline: none; font-size: 14px;">
                        <button id="send-msg-btn" style="background: var(--accent); color: white; border: none; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
                    </div>
                </div>
            </div>
        </div>
        <style>
            .conv-item:hover { background: var(--surface-hover) !important; }
            #send-msg-btn:hover { transform: scale(1.05); }
            @media (max-width: 768px) {
                .messages-left { width: 100% !important; }
                .messages-right { display: none !important; position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 20; }
                .messages-right.active { display: flex !important; }
            }
        </style>
        `;
    },
    
    init() {
        const convItems = document.querySelectorAll('.conv-item');
        const emptyState = document.getElementById('chat-empty');
        const chatRight = document.querySelector('.messages-right');
        const chatName = document.getElementById('chat-name');
        const chatAvatar = document.getElementById('chat-avatar');
        
        convItems.forEach(item => {
            item.addEventListener('click', () => {
                convItems.forEach(i => i.style.borderLeft = 'none');
                item.style.borderLeft = '4px solid var(--primary)';
                
                // Update header
                const name = item.querySelector('span[style*="font-weight"]').innerText;
                const avatar = item.querySelector('div[style*="border-radius: 50%"]').innerHTML.trim().split('<')[0]; // Simple extraction
                const bg = item.querySelector('div[style*="border-radius: 50%"]').style.backgroundColor;
                
                chatName.innerText = name;
                chatAvatar.innerText = avatar;
                chatAvatar.style.backgroundColor = bg;
                
                emptyState.style.display = 'none';
                
                if (window.innerWidth <= 768) {
                    chatRight.classList.add('active');
                }
                
                // Scroll to bottom
                const body = document.getElementById('chat-body');
                body.scrollTop = body.scrollHeight;
            });
        });
        
        // Mobile back button logic (simulated by adding a button to header if needed)
        if (window.innerWidth <= 768) {
            const header = document.getElementById('chat-header');
            const backBtn = document.createElement('button');
            backBtn.innerHTML = '&larr;';
            backBtn.style.cssText = 'background:none; border:none; font-size:24px; margin-right:10px; cursor:pointer;';
            backBtn.onclick = () => chatRight.classList.remove('active');
            header.insertBefore(backBtn, header.firstChild);
        }

        // Send message simulation
        const sendBtn = document.getElementById('send-msg-btn');
        const input = document.getElementById('chat-input');
        const body = document.getElementById('chat-body');
        
        const sendMessage = () => {
            if(!input.value.trim()) return;
            
            const msgHtml = `
            <div style="display: flex; gap: 10px; max-width: 80%; align-self: flex-end; flex-direction: row-reverse; animation: slideInRight 0.3s ease;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 16px; color: white; flex-shrink: 0;">ME</div>
                <div>
                    <div style="background: var(--primary); color: white; padding: 12px 16px; border-radius: 16px 0 16px 16px; font-size: 14px; box-shadow: var(--shadow-sm);">
                        ${input.value}
                    </div>
                    <div style="font-size: 11px; color: var(--text-tertiary); margin-top: 4px; text-align: right;">Just now</div>
                </div>
            </div>
            `;
            
            body.insertAdjacentHTML('beforeend', msgHtml);
            input.value = '';
            body.scrollTop = body.scrollHeight;
        };
        
        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') sendMessage();
        });
        
        // Inject keyframes
        if(!document.getElementById('msg-keyframes')) {
            const style = document.createElement('style');
            style.id = 'msg-keyframes';
            style.innerHTML = '@keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }';
            document.head.appendChild(style);
        }
    }
};
