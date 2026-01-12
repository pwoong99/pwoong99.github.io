const linksData = [
    { name: '클래스팅', url: 'https://www.classting.com/', icon: '🏫' },
    { name: '패들렛', url: 'https://padlet.com/', icon: '📌' },
    { name: '카훗', url: 'https://kahoot.com/', icon: '😺' },
    { name: '구글 클래스룸', url: 'https://classroom.google.com/', icon: '🎓' },
    { name: '미리캔버스', url: 'https://www.miricanvas.com/', icon: '🎨' },
    { name: '띵커벨', url: 'https://tkbell.co.kr/', icon: '🔔' },
    { name: '네이버', url: 'https://www.naver.com/', icon: '💚' },
    { name: '유튜브', url: 'https://www.youtube.com/', icon: '▶️' },
    { name: 'EBS 온라인', url: 'https://www.ebsoc.co.kr/', icon: '📺' }
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
