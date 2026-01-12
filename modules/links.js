const linksData = [
    { name: '클래스팅', url: 'https://www.classting.com/', icon: '🏫' },
    { name: '미리캔버스', url: 'https://www.miricanvas.com/', icon: '🎨' },
    { name: '캔바', url: 'https://www.canva.com/', icon: '🖌️' },
    { name: '북크리에이터', url: 'https://app.bookcreator.com/', icon: '📚' },
    { name: '퀴즈앤', url: 'https://www.quizn.show/', icon: '❓' }
];

export default function initLinks() {
    const container = document.getElementById('links-container');

    linksData.forEach(link => {
        const a = document.createElement('a');
        a.href = link.url;
        a.target = '_blank';
        a.className = 'link-card';
        a.innerHTML = `
            <div class="link-icon">${link.icon}</div>
            <div class="link-name">${link.name}</div>
        `;
        container.appendChild(a);
    });
}
