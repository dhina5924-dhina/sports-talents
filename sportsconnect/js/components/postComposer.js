window.SportsConnect = window.SportsConnect || {};
SportsConnect.components = SportsConnect.components || {};

SportsConnect.components.postComposer = {
    render(currentUser) {
        const avatar = currentUser?.avatar || '👤';
        const color = currentUser?.avatarColor || 'var(--primary)';
        
        return `
            <div class="post-composer">
                <div class="post-composer__top">
                    <div class="avatar" style="background: ${color}">${avatar}</div>
                    <div class="post-composer__input" contenteditable="true" placeholder="What's your sports update?"></div>
                </div>
                <div class="post-composer__preview" id="composer-preview" style="display:none;"></div>
                <div class="post-composer__bottom">
                    <div class="post-composer__tools">
                        <button class="tool-btn" title="Add Photo">📸</button>
                        <button class="tool-btn" title="Add Video">🎥</button>
                        <button class="tool-btn" title="Add Location">📍</button>
                        <button class="tool-btn" title="Tag Sport">⚽</button>
                        <button class="tool-btn text-accent" title="Post Achievement">🏆</button>
                    </div>
                    <button class="btn btn--primary post-composer__submit" disabled>Post</button>
                </div>
            </div>
        `;
    },

    init() {
        const composers = document.querySelectorAll('.post-composer');
        composers.forEach(composer => {
            const input = composer.querySelector('.post-composer__input');
            const submitBtn = composer.querySelector('.post-composer__submit');

            if (input && submitBtn) {
                input.addEventListener('input', () => {
                    if (input.textContent.trim().length > 0) {
                        submitBtn.removeAttribute('disabled');
                    } else {
                        submitBtn.setAttribute('disabled', 'true');
                    }
                });

                submitBtn.addEventListener('click', () => {
                    if (input.textContent.trim().length > 0) {
                        // Simulate post submission
                        submitBtn.textContent = 'Posting...';
                        setTimeout(() => {
                            input.textContent = '';
                            submitBtn.textContent = 'Post';
                            submitBtn.setAttribute('disabled', 'true');
                            // In a real app, we would add to store and trigger re-render
                            alert('Post published successfully!');
                        }, 500);
                    }
                });
            }
        });
    }
};
