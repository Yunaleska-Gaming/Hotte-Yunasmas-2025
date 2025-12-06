const CALENDAR_EL = document.getElementById('calendar');


async function loadData(){
    try {
        const res = await fetch('assets/json/days.json');
        const data = await res.json();
        renderCalendar(data);
        }catch(e){
        console.error('Échec de chargement days.json', e);
        CALENDAR_EL.innerHTML = '<p class="small">Erreur de chargement du calendrier. Vérifie days.json.</p>';
    }
}


function isUnlocked(dayNumber){
    const now = new Date();
    const year = now.getFullYear();
    const target = new Date(Date.UTC(year,11,dayNumber,0,0,0));
    const localNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const localTarget = new Date(year, 11, dayNumber);
    return localNow >= localTarget;
}


function renderCalendar(days){
    CALENDAR_EL.innerHTML = '';
    days.forEach(day =>{
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('tabindex','0');
    card.setAttribute('aria-label', `Jour ${day.day} — ${day.title}`);


    const locked = !isUnlocked(day.day);
    if(locked) card.classList.add('locked');


    const flip = document.createElement('div');
    flip.className = 'flip';
    flip.dataset.day = day.day;

    const front = document.createElement('div'); front.className = 'face front';
    
    // Création de la balise <picture>
    const picture = document.createElement('picture');

    // Nom automatique : "day-X.png"
    const imageName = `day-${day.day}.png`;

    // Source mobile
    const sourceMobile = document.createElement('source');
    sourceMobile.media = '(max-width: 700px)';
    sourceMobile.srcset = `assets/images/mobile/${imageName}`;
    picture.appendChild(sourceMobile);

    // Image desktop
    const img = document.createElement('img');
    img.src = `assets/images/desktop/${imageName}`;
    img.alt = day.title;
    picture.appendChild(img);

    front.appendChild(picture);

    const badge = document.createElement('div'); badge.className = 'dayBadge'; badge.textContent = day.day;
    front.appendChild(badge);


    const back = document.createElement('div'); back.className = 'face back';
    const rtitle = document.createElement('div'); rtitle.className = 'rewardTitle'; rtitle.textContent = day.reward.title;
    const rdesc = document.createElement('div'); rdesc.className = 'rewardDesc'; rdesc.textContent = day.reward.desc;
    back.appendChild(rtitle); back.appendChild(rdesc);
    const note = document.createElement('div'); note.className = 'note'; note.textContent = day.reward.note || '';
    back.appendChild(note);


    flip.appendChild(front); flip.appendChild(back);



    if(locked) {
        const overlay = document.createElement('div'); overlay.className = 'lockOverlay';
        overlay.innerHTML = '<span class="pad">Bloqué<br /> Disponible le ' + day.day + ' décembre</span>';
        front.appendChild(overlay);
        
        card.setAttribute('aria-hidden', 'false');
    } 

    else {
        
        flip.addEventListener('click', () => {
        flip.classList.toggle('is-flipped');
        });
        
        card.addEventListener('keydown', (e)=> {
            if(e.key === 'Enter' || e.key === ' ') {
                e.preventDefault(); flip.classList.toggle('is-flipped');
            }
        });
    }


        card.appendChild(flip);
        CALENDAR_EL.appendChild(card);
    });
}


loadData();