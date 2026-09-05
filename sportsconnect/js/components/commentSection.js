window.SportsConnect = window.SportsConnect || {};
SportsConnect.components = SportsConnect.components || {};

SportsConnect.components.commentSection = {
    render(comments, postId) {
        let commentsHtml = '';
        
        if (comments && comments.length > 0) {
            commentsHtml = comments.map(comment => this.renderComment(comment)).join('');
        } else {
            commentsHtml = '<p class="text-tertiary" style="text-align: center; padding: 1rem 0;">No comments yet. Be the first to comment!</p>';
        }

        return `
            <div class="comment-section">
                <div class="comment-section__list">
                    ${commentsHtml}
                </div>
                <div class="comment-section__input-area">
                    <div class="avatar" style="background: var(--primary);">👤</div>
                    <div class="comment-input-wrapper">
                        <input type="text" class="comment-input" data-post="${postId}" placeholder="Write a comment...">
                        <button class="comment-submit-btn" data-post="${postId}">Post</button>
                    </div>
                </div>
            </div>
        `;
    },

    renderComment(comment, isReply = false) {
        const replyClass = isReply ? 'comment-item--reply' : '';
        let repliesHtml = '';
        
        if (comment.replies && comment.replies.length > 0) {
            repliesHtml = `
                <div class="comment-replies">
                    ${comment.replies.map(reply => this.renderComment(reply, true)).join('')}
                </div>
            `;
        }

        return `
            <div class="comment-item ${replyClass}">
                <div class="avatar comment-avatar" style="background: ${comment.userAvatarColor || 'var(--primary)'}">${comment.userAvatar || '👤'}</div>
                <div class="comment-content-wrapper">
                    <div class="comment-bubble">
                        <a href="#profile?id=${comment.userId}" class="comment-author">${comment.userName}</a>
                        <span class="comment-text">${comment.text}</span>
                    </div>
                    <div class="comment-actions">
                        <span class="comment-time">${comment.timestamp}</span>
                        <button class="comment-action-btn like-comment-btn" data-id="${comment.id}">Like (${comment.likesCount || 0})</button>
                        ${!isReply ? `<button class="comment-action-btn reply-btn" data-id="${comment.id}">Reply</button>` : ''}
                    </div>
                    ${repliesHtml}
                </div>
            </div>
        `;
    },

    init(postId) {
        // Since this might be called multiple times for different posts, 
        // we should ideally use event delegation on the document or a specific container.
        
        // Setup once globally if possible, or bind to specific container
        const containers = document.querySelectorAll(`#comments-${postId}`);
        
        containers.forEach(container => {
            container.addEventListener('click', (e) => {
                if (e.target.classList.contains('like-comment-btn')) {
                    const btn = e.target;
                    let text = btn.textContent;
                    let count = parseInt(text.match(/\d+/) || [0])[0];
                    if (btn.classList.contains('liked')) {
                        btn.classList.remove('liked');
                        btn.textContent = `Like (${count - 1})`;
                        btn.style.color = 'var(--text-secondary)';
                    } else {
                        btn.classList.add('liked');
                        btn.textContent = `Like (${count + 1})`;
                        btn.style.color = 'var(--error)';
                    }
                }
                
                if (e.target.classList.contains('comment-submit-btn')) {
                    const input = container.querySelector('.comment-input');
                    if (input.value.trim() !== '') {
                        alert('Comment posted!');
                        input.value = '';
                    }
                }
            });

            const input = container.querySelector('.comment-input');
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && input.value.trim() !== '') {
                        alert('Comment posted!');
                        input.value = '';
                    }
                });
            }
        });
    }
};
