document.addEventListener("DOMContentLoaded", function () {
    fetch('./data.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            const navItemsContainer = document.getElementById('navItems');
            const pageContentContainer = document.getElementById('pageContent');

            if (!Array.isArray(data) || data.length === 0) {
                pageContentContainer.innerHTML = '<p>No API data available.</p>';
                return;
            }

            // Populate the sidebar with navigation items
            data.forEach((item, index) => {
                const navItem = document.createElement('div');
                navItem.className = 'nav-item';
                navItem.textContent = item.name;
                navItem.dataset.index = index; // Store index for quick lookup
                navItem.addEventListener('click', () => loadContent(data, index));
                navItemsContainer.appendChild(navItem);
            });

            // Display the first page by default
            loadContent(data, 0);
        })
        .catch(error => console.error('Error loading JSON data:', error));

        function loadContent(data, index) {
            const pageContentContainer = document.getElementById('pageContent');
            const item = data[index];
        
            const formatText = (text) => {
                // Format code blocks (wrapped in ```)
                text = text.replace(/```([\s\S]*?)```/g, '<div class="code-box"><pre><code>$1</code></pre></div>');
        
                // Format inline code (wrapped in `)
                text = text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
        
                // Format bold, italic, and underline
                text = text
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold with **
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')             // Italic with *
                    .replace(/_(.*?)_/g, '<u>$1</u>');                // Underline with _

                text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
                    const language = lang || 'plaintext';
                    return `<div class="code-box"><pre><code class="language-${language}">${code.trim()}</code></pre></div>`;
                });
        
                return text;
            };
        
            pageContentContainer.innerHTML = `
                <h2 class="function-header">${item.name}</h2>
                <div class="content-text">${formatText(item.text)}</div>
            `;
        }

    // Search functionality
    const searchBar = document.getElementById('searchBar');
    searchBar.addEventListener('input', function () {
        const searchTerm = searchBar.value.toLowerCase();
        const navItems = document.getElementById('navItems').getElementsByClassName('nav-item');

        for (let item of navItems) {
            const itemText = item.textContent.toLowerCase();
            item.style.display = itemText.includes(searchTerm) ? 'block' : 'none';
        }
    });
});
