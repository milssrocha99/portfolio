if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}
window.addEventListener("load", () => {
    window.scrollTo(0, 0);
});

const container = document.getElementById("photoContainer");
const canvas = document.getElementById("magicCanvas");
const ctx = canvas.getContext("2d");
const colorPhoto = document.querySelector(".color");
const grayscalePhoto = document.querySelector(".grayscale");
const photoTransition = document.querySelector(".photo-transition");
const scrollHint = document.querySelector(".scroll-hint");
const aboutSection = document.querySelector("#about");
const aboutPhoto = document.querySelector(".about-photo-frame");
const orbitOne = document.querySelector(".orbit-one");
const orbitTwo = document.querySelector(".orbit-two");

function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

window.addEventListener(
    "resize",
    resizeCanvas
);

resizeCanvas();

let mouseX = 0;
let mouseY = 0;
let trails = [];

document.addEventListener(
    "mousemove",
    (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        trails.push({
            x: mouseX,
            y: mouseY,
            size: 90,
            life: 1
        });
        if (trails.length > 25) {
            trails.shift();
        }
    }
);

function animate() {
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
    trails.forEach(
        (trail, index) => {
            const gradient =
                ctx.createRadialGradient(
                    trail.x,
                    trail.y,
                    0,
                    trail.x,
                    trail.y,
                    trail.size
                );
            gradient.addColorStop(
                0,
                `rgba(
                    255,
                    255,
                    255,
                    ${trail.life * 0.07}
                )`
            );
            gradient.addColorStop(
                0.35,
                `rgba(
                    255,
                    120,
                    180,
                    ${trail.life * 0.08}
                )`
            );
            gradient.addColorStop(
                1,
                "rgba(255,255,255,0)"
            );
            ctx.fillStyle =
                gradient;
            ctx.beginPath();
            ctx.arc(
                trail.x,
                trail.y,
                trail.size,
                0,
                Math.PI * 2
            );
            ctx.fill();
            trail.life -= 0.018;
            trail.size += 1.2;
            if (trail.life <= 0) {
                trails.splice(
                    index,
                    1
                );
            }
        }
    );
    for (let i = 0; i < trails.length; i++) {
        for (let j = i + 1; j < trails.length; j++) {
            const dx =
                trails[i].x - trails[j].x;
            const dy =
                trails[i].y - trails[j].y;
            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );
            if (distance < 75) {
                const opacity =
                    (1 - distance / 75) *
                    Math.min(
                        trails[i].life,
                        trails[j].life
                    ) *
                    0.16;
                ctx.beginPath();
                ctx.moveTo(
                    trails[i].x,
                    trails[i].y
                );
                ctx.lineTo(
                    trails[j].x,
                    trails[j].y
                );
                ctx.strokeStyle =
                    `rgba(
                        255,
                        255,
                        255,
                        ${opacity}
                    )`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(
        animate
    );
}
animate();

container.addEventListener(
    "mousemove",
    (event) => {
        const rect =
            container.getBoundingClientRect();
        const x =
            event.clientX -
            rect.left;
        const y =
            event.clientY -
            rect.top;
        grayscalePhoto.style.maskImage = `
            radial-gradient(
                circle 230px
                at ${x}px ${y}px,
                transparent 0%,
                rgba(
                    0,
                    0,
                    0,
                    0.18
                )
                30%,
                black 72%
            )
        `;
        grayscalePhoto.style.webkitMaskImage = `
            radial-gradient(
                circle 230px
                at ${x}px ${y}px,
                transparent 0%,
                rgba(
                    0,
                    0,
                    0,
                    0.18
                )
                30%,
                black 72%
            )
        `;
    }
);

window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const homeHeight = window.innerHeight;
    const progress = Math.min(
        scrollY / homeHeight,
        1
    );
    photoTransition.style.opacity = progress;
    scrollHint.style.opacity = 1 - progress;
    scrollHint.style.transform = `
        translateY(${progress * -20}px)
    `;
});

function animateAboutPhoto() {
    const rect = aboutSection.getBoundingClientRect();
    const trigger = window.innerHeight * 0.9;
    const distance = window.innerHeight * 0.55;
    let progress = (trigger - rect.top) / distance;
    progress = Math.max(0, Math.min(1, progress));
    const y = -250 * (1 - progress);
    const rotation = -4 + (2 * progress);
    aboutPhoto.style.opacity = progress;
    if (progress < 1) {
        aboutPhoto.style.transform =
            `translateY(${y}px) rotate(${rotation}deg)`;
        aboutPhoto.classList.remove("floating");
    } else {
        aboutPhoto.style.transform = "";
        aboutPhoto.classList.add("floating");
    }
    orbitOne.style.opacity = progress;
    orbitTwo.style.opacity = progress;
    if (progress < 1) {
        orbitOne.style.transform =
            `translateY(${y}px) rotate(-28deg)`;
        orbitTwo.style.transform =
            `translateY(${y}px) rotate(38deg)`;
        orbitOne.classList.remove("spinning");
        orbitTwo.classList.remove("spinning");
    } else {
        orbitOne.style.transform = "";
        orbitTwo.style.transform = "";
        orbitOne.classList.add("spinning");
        orbitTwo.classList.add("spinning");
    }
}

window.addEventListener("scroll", animateAboutPhoto, { passive: true });
window.addEventListener("load", animateAboutPhoto);

animateAboutPhoto();

const translations = {
    en: {
        nav: {
            home: "Home",
            about: "About",
            expertise: "Expertise",
            skills: "Skills",
            projects: "Projects",
            contact: "Contact"
        },
        home: {
            greeting: "Hi, I'm Milena",
            scroll: "SCROLL TO SCRUB TIMELINE"
        },
        about: {
            title: "Hello, I'm",
            description:
                "I'm a Full-Stack Developer focused on building complete digital solutions, from custom web interfaces and system architecture to backend development, databases, automation and deployment.",
            description2:
                "I build projects from the ground up, combining development, web design and process automation to transform ideas into functional, efficient and scalable products."
        },
        expertise: {
            title: "Technologies",
            titleAccent: "I work with",
            description:
                "I build complete digital solutions, from web systems and applications to backend, databases, APIs, automation and deployment."
        },
        skills: {
            roadmap: "Engineering Roadmap",
            coreTitle: "Core Execution",
            coreAccent: "Root Map",
            status: "ACTIVE",
            root01: {
                title: "Interface Engineering",
                description: "Building responsive, interactive and visually refined web interfaces."
            },
            root02: {
                title: "System Architecture",
                description: "Developing APIs, server logic, authentication and scalable systems."
            },
            root03: {
                title: "Data Infrastructure",
                description: "Structuring databases, data flows and reliable application storage."
            },
            root04: {
                title: "Process Automation",
                description: "Connecting systems and automating repetitive technical workflows."
            }
        },
        projects: {
            sideTitle: "PROJECTS",
            viewProject: "VIEW PROJECT",
            description: "Internal system built from scratch to manage traffic operations, vehicles, drivers, routes and operational data.",
            userAccess: "USER",
            username: "USER",
            password: "PASSWORD",
            standardAccess: "Standard system access.",
            adminAccess: "Full access including the audit log, where all activities performed in the system can be monitored.",
            builtTitle: "Built from scratch.",
            development: "I developed the entire application, including interface, architecture, backend, authentication, database and deployment.",
            features: {
                traffic: "Traffic control",
                vehicles: "Vehicles & drivers",
                routes: "Routes",
                passengers: "Passenger data",
                mileage: "Mileage",
                history: "History & filters",
                pdf: "PDF reports",
                audit: "Audit log"
            }
        },
        contact: {
            title: "Let's",
            titleAccent: "Talk.",
            intro: "Great ideas begin with a connection.",
            node: "NODE",
            status: "STATUS",
            location: "LOCATION",
            online: "ONLINE",
            name: "NAME",
            namePlaceholder: "Your name",
            email: "EMAIL",
            emailPlaceholder: "Your email",
            messagePlaceholder: "Write your message...",
            send: "SEND MESSAGE",
            ready: "READY"
        }
    },

    pt: {
        nav: {
            home: "Início",
            about: "Sobre",
            expertise: "Especialidades",
            skills: "Habilidades",
            projects: "Projetos",
            contact: "Contato"
        },
        home: {
            greeting: "Olá, eu sou Milena",
            scroll: "ROLE PARA NAVEGAR PELA TIMELINE"
        },
        about: {
            title: "Olá, eu sou",
            description: "Sou Desenvolvedora Full-Stack focada em criar soluções digitais completas, desde interfaces web personalizadas e arquitetura de sistemas até desenvolvimento backend, bancos de dados, automação e deployment.",
            description2: "Desenvolvo projetos do zero, combinando desenvolvimento, web design e automação de processos para transformar ideias em produtos funcionais, eficientes e escaláveis."
        },
        expertise: {
            title: "Tecnologias",
            titleAccent: "que utilizo",
            description: "Desenvolvo soluções digitais completas, desde sistemas web e aplicativos até backend, bancos de dados, APIs, automação e deployment."
        },
        skills: {
            roadmap: "Engineering Roadmap",
            coreTitle: "Execução Central",
            coreAccent: "Root Map",
            status: "ATIVO",
            root01: {
                title: "Engenharia de Interfaces",
                description: "Criação de interfaces web responsivas, interativas e visualmente refinadas."
            },
            root02: {
                title: "Arquitetura de Sistemas",
                description: "Desenvolvimento de APIs, lógica de servidor, autenticação e sistemas escaláveis."
            },
            root03: {
                title: "Infraestrutura de Dados",
                description: "Estruturação de bancos de dados, fluxos de dados e armazenamento confiável para aplicações."
            },
            root04: {
                title: "Automação de Processos",
                description: "Integração de sistemas e automação de fluxos técnicos repetitivos."
            }
        },
        projects: {
            sideTitle: "PROJETOS",
            viewProject: "VER PROJETO",
            description: "Sistema interno desenvolvido do zero para gerenciar operações de tráfego, veículos, motoristas, linhas e dados operacionais.",
            userAccess: "USUÁRIO",
            username: "USUÁRIO",
            password: "SENHA",
            standardAccess: "Acesso padrão ao sistema.",
            adminAccess: "Acesso completo, incluindo a auditoria, onde é possível acompanhar todas as atividades realizadas no sistema.",
            builtTitle: "Desenvolvido do zero.",
            development: "Desenvolvi toda a aplicação, incluindo interface, arquitetura, backend, autenticação, banco de dados e deploy.",
            features: {
                traffic: "Controle de tráfego",
                vehicles: "Veículos e motoristas",
                routes: "Linhas",
                passengers: "Dados de passageiros",
                mileage: "Quilometragem",
                history: "Histórico e filtros",
                pdf: "Relatórios em PDF",
                audit: "Auditoria"
        }
    },
        contact: {
            title: "Vamos",
            titleAccent: "Conversar.",
            intro: "Grandes ideias começam com uma conexão.",
            node: "NÓ",
            status: "STATUS",
            location: "LOCALIZAÇÃO",
            online: "ONLINE",
            name: "NOME",
            namePlaceholder: "Seu nome",
            email: "E-MAIL",
            emailPlaceholder: "Seu email",
            messagePlaceholder: "Escreva sua mensagem...",
            send: "ENVIAR MENSAGEM",
            ready: "PRONTO"
        }
    }
};

const expertiseSection =
    document.querySelector("#expertise");
const expertiseCommand =
    document.querySelector(".expertise-command");
let expertiseCommandSnapped = false;

function animateExpertiseCommand() {
    if (
        !expertiseSection ||
        !expertiseCommand
    ) {
        return;
    }
    const rect =
        expertiseSection.getBoundingClientRect(); 
    const start =
    window.innerHeight * 1.05;
    const end =
    window.innerHeight * 0.48;
    let progress =
        (start - rect.top) /
        (start - end);
    progress =
        Math.max(
            0,
            Math.min(
                1,
                progress
            )
        );

        let x;
        let y;
        let rotation;

        const screenHeight = window.innerHeight;

        if (progress < 0.20) {
            const p =
            progress / 0.20;
            x =
            -18 + (12 * p);
            y =
            (-0.36 * screenHeight) +
            (0.15 * screenHeight * p);
            rotation =
            -6 + (8 * p);
        } else if (progress < 0.42) {
            const p =
            (progress - 0.20) / 0.22;
            x =
            -6 + (17 * p);
            y =
            (-0.19 * screenHeight) +
            (0.09 * screenHeight * p);
            rotation =
            2 - (4 * p);
        } else if (progress < 0.64) {
            const p =
            (progress - 0.42) / 0.22;
            x =
            11 - (18 * p);
            y =
            (-0.10 * screenHeight) +
            (0.055 * screenHeight * p);
            rotation =
            -2 + (4 * p);
        } else if (progress < 0.82) {
            const p =
            (progress - 0.64) / 0.18;
            x =
            -7 + (11 * p);
            y =
            (-0.045 * screenHeight) +
            (0.03 * screenHeight * p);
            rotation =
            2 - (3 * p);
        } else {
            const p =
            (progress - 0.82) / 0.18;
            x =
            4 - (4 * p);
            y =
            (-0.015 * screenHeight) +
            (0.015 * screenHeight * p);
            rotation =
            -1 + (1 * p);
        }
        expertiseCommand.style.opacity =
        progress <= 0
        ? 0
        : Math.min(
            0.35 + progress * 2.5,
            1
        );
        expertiseCommand.style.filter =
        `blur(${2 * (1 - progress)}px)`;
        if (progress < 0.995) {
        expertiseCommandSnapped = false;
        expertiseCommand.classList.remove(
            "command-snap"
        );
        expertiseCommand.style.transform = `
            translate3d(
                ${x}vw,
                ${y}px,
                0
            )
            rotate(${rotation}deg)
            scale(${0.94 + progress * 0.06})
        `;
    } else {
        expertiseCommand.style.transform = `
            translate3d(
                0,
                0,
                0
            )
            rotate(0deg)
            scale(1)
        `;
        if (!expertiseCommandSnapped) 
            expertiseCommandSnapped = true;
            expertiseCommand.classList.remove(
                "command-snap"
            );
            void expertiseCommand.offsetWidth;
            expertiseCommand.classList.add(
                "command-snap"
            );
        }
    }

window.addEventListener(
    "scroll",
    animateExpertiseCommand,
    { passive: true }
);

window.addEventListener(
    "resize",
    animateExpertiseCommand
);

animateExpertiseCommand();

function getTranslation(lang, key) {
    const keys =
        key.split(".");
    let value =
        translations[lang];
    for (const part of keys) {
        if (
            value === undefined ||
            value === null
        ) {
            return undefined;
        }
        value =
            value[part];
    }
    return value;
}


/* =====================================
   PROJECTS — TITLE TRANSLATION
===================================== */

function updateProjectsTitle(language) {
    const title = document.querySelector(".projects-title-main");

    if (!title) return;

    const titleText =
        getTranslation(language, "projects.sideTitle") ||
        getTranslation("en", "projects.sideTitle");

    if (!titleText) return;

    if (
        title.dataset.currentText === titleText &&
        title.querySelector("span")
    ) {
        return;
    }

    const fragment = document.createDocumentFragment();

    for (const letter of titleText) {
        const span = document.createElement("span");
        span.textContent = letter;
        fragment.appendChild(span);
    }

    title.replaceChildren(fragment);

    title.dataset.currentText = titleText;
    title.setAttribute("aria-label", titleText);
}


function setLanguage(lang) {

    // Valida o idioma selecionado.
    const language = translations[lang] ? lang : "en";

    // TRADUZ TEXTOS
    document.querySelectorAll("[data-i18n]").forEach(element => {

        const key = element.getAttribute("data-i18n");
        const value = getTranslation(language, key);

        if (typeof value === "string") {
            element.textContent = value;
        }

    });

    // TRADUZ PLACEHOLDERS
    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {

        const key = element.getAttribute("data-i18n-placeholder");
        const value = getTranslation(language, key);

        if (typeof value === "string") {
            element.setAttribute("placeholder", value);
        }

    });

    // ATUALIZA O TÍTULO ANIMADO DE PROJECTS
    updateProjectsTitle(language);

    // ATUALIZA O IDIOMA DO DOCUMENTO
    document.documentElement.lang =
        language === "pt" ? "pt-BR" : "en";

    // SALVA A PREFERÊNCIA
    localStorage.setItem("portfolioLanguage", language);

    // ATUALIZA OS BOTÕES EN / PT
    document.querySelectorAll(".lang-btn").forEach(button => {

        const active = button.dataset.lang === language;

        button.classList.toggle("active", active);

        button.setAttribute(
            "aria-pressed",
            String(active)
        );

    });
}


document
    .querySelectorAll(".lang-btn")
    .forEach(button => {
        button.addEventListener(
            "click",
            () => {
                setLanguage(
                    button.dataset.lang
                );
            }
        );
    });

const savedLanguage =
    localStorage.getItem(
        "portfolioLanguage"
    ) || "en";
setLanguage(savedLanguage);

const skillsSection =
    document.querySelector("#skills");
const rootCards =
    document.querySelectorAll(".root-card");


function animateSkillsCards() {
    if (
        !skillsSection ||
        !rootCards.length
    ) {
        return;
    }
    const rect =
        skillsSection.getBoundingClientRect();
    const start =
        window.innerHeight * 0.82;
    const end =
        window.innerHeight * 0.20;
    let progress =
        (start - rect.top) /
        (start - end);
    progress =
        Math.max(
            0,
            Math.min(
                1,
                progress
            )
        );
    rootCards.forEach(
        (card, index) => {
            const delay =
                index * 0.10;
            const localProgress =
                Math.max(
                    0,
                    Math.min(
                        1,
                        (
                            progress -
                            delay
                        ) /
                        (
                            1 -
                            delay
                        )
                    )
                );
            const y =
                55 *
                (
                    1 -
                    localProgress
                );
            const scale =
                0.97 +
                (
                    localProgress *
                    0.03
                );
            card.style.opacity =
                localProgress;
            card.style.transform = `
                translateY(${y}px)
                scale(${scale})
            `;
        }
    );
}

window.addEventListener(
    "scroll",
    animateSkillsCards,
    { passive: true }
);

window.addEventListener(
    "resize",
    animateSkillsCards
);

animateSkillsCards();

rootCards.forEach(card => {
    card.addEventListener(
        "mousemove",
        event => {
            const rect =
                card.getBoundingClientRect();
            const x =
                event.clientX -
                rect.left;
            const y =
                event.clientY -
                rect.top;
            const centerX =
                rect.width / 2;
            const centerY =
                rect.height / 2;
            const rotateX =
                (
                    y -
                    centerY
                ) /
                45;
            const rotateY =
                (
                    centerX -
                    x
                ) /
                45;
            card.style.transform = `
                perspective(900px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(0)
                scale(1.01)
            `;
        }
    );

    card.addEventListener(
        "mouseleave",
        () => {
            card.style.transform = `
                perspective(900px)
                rotateX(0deg)
                rotateY(0deg)
                translateY(0)
                scale(1)
            `;
        }
    );
});

const engineeringLabel =
    document.querySelector(".engineering-label");
const skillsSectionElement =
    document.querySelector("#skills");

    function animateEngineeringLabel() {
    if (
        !engineeringLabel ||
        !skillsSectionElement
    ) {
        return;
    }

    const rect =
        skillsSectionElement.getBoundingClientRect();
    const start =
        window.innerHeight * 0.90;
    const end =
        window.innerHeight * 0.50;
    let progress =
        (start - rect.top) /
        (start - end);
    progress =
        Math.max(
            0,
            Math.min(
                1,
                progress
            )
        );
    const eased =
        progress * progress *
        (2 - 1 * progress);
    engineeringLabel.style.opacity =
        eased;
    engineeringLabel.style.transform = `
        scale(${0.92 + eased * 0.08})
    `;
    engineeringLabel.style.filter = `
        blur(${8 * (1 - eased)}px)
    `;
}

window.addEventListener(
    "scroll",
    animateEngineeringLabel,
    { passive: true }
);

window.addEventListener(
    "resize",
    animateEngineeringLabel
);

animateEngineeringLabel();

const earthCanvas =
    document.getElementById("earthCanvas");
if (earthCanvas) {
    const ctx =
        earthCanvas.getContext("2d");
    let width;
    let height;
    let centerX;
    let centerY;
    let radius;
    let rotation = 0;
    let connectionTime = 0;
    const points = [];
    const connectionNodes = [];

    function resizeEarthCanvas() {
        const rect =
            earthCanvas.getBoundingClientRect();
        const dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );
        earthCanvas.width =
            rect.width * dpr;
        earthCanvas.height =
            rect.height * dpr;
        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );
        width =
            rect.width;
        height =
            rect.height;
        centerX =
            width / 2;
        centerY =
            height / 2;
        const canvasSize =
    Math.min(
        width,
        height
    );
    radius =
    canvasSize * 0.31;
    }

    function createEarthPoints() {
        points.length = 0;
        const totalPoints =
            850;
        const goldenAngle =
            Math.PI *
            (
                3 -
                Math.sqrt(5)
            );
        for (
            let i = 0;
            i < totalPoints;
            i++
        ) {
            const y =
                1 -
                (
                    i /
                    (totalPoints - 1)
                ) * 2;
            const sphereRadius =
                Math.sqrt(
                    1 -
                    y * y
                );
            const theta =
                goldenAngle * i;
            const x =
                Math.cos(theta) *
                sphereRadius;
            const z =
                Math.sin(theta) *
                sphereRadius;
            points.push({
                x,
                y,
                z,
                size:
                    Math.random() *
                    0.8 +
                    0.35,
                brightness:
                    Math.random() *
                    0.45 +
                    0.35
            });
        }

        const nodeIndexes = [
            40,
            110,
            180,
            250,
            320,
            390,
            460,
            530,
            600,
            670,
            740,
            810
        ];
        nodeIndexes.forEach(
            index => {
                if (points[index]) {
                    connectionNodes.push(
                        points[index]
                    );
                }
            }
        );
    }

    function rotatePoint(
        point,
        angle
    ) {
        const cos =
            Math.cos(angle);
        const sin =
            Math.sin(angle);
        const rotatedX =
            point.x * cos -
            point.z * sin;
        const rotatedZ =
            point.x * sin +
            point.z * cos;
        return {
            x:
                rotatedX,
            y:
                point.y,
            z:
                rotatedZ
        };
    }

    function projectPoint(
        point
    ) {
        const perspective =
            2.7;
        const scale =
            perspective /
            (
                perspective -
                point.z
            );
        return {
            x:
                centerX +
                point.x *
                radius *
                scale,
            y:
                centerY +
                point.y *
                radius *
                scale,
            scale,
            z:
                point.z
        };
    }

    function drawEarthOutline() {
        ctx.beginPath();
        ctx.arc(
            centerX,
            centerY,
            radius * 1.02,
            0,
            Math.PI * 2
        );
        ctx.strokeStyle =
            "rgba(255,255,255,0.08)";
        ctx.lineWidth =
            1;
        ctx.stroke();
    }

  function drawConnections(projectedNodes) {
    connectionTime += 0.012;
    for (
        let i = 0;
        i < projectedNodes.length;
        i++
    ) {
        for (
            let j = i + 1;
            j < projectedNodes.length;
            j++
        ) {
            const a =
                projectedNodes[i];
            const b =
                projectedNodes[j];
            if (
                a.z < -0.15 ||
                b.z < -0.15
            ) {
                continue;
            }
            const dx =
                b.x - a.x;
            const dy =
                b.y - a.y;
            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );
            const connectionSeed =  
            (i * 13 + j * 7) % 10;
            if (connectionSeed > 4) {
                continue;
            }
            if (
                distance >
                radius * 1.55
            ) {
                continue;
            }
            const opacity =
                Math.max(
                    0,
                    1 -
                    distance /
                    (radius * 1.55)
                );
            const controlX =
                (
                    a.x +
                    b.x
                ) / 2;
            const controlY =
                (
                    a.y +
                    b.y
                ) / 2
                -
                distance * 0.18;
            ctx.beginPath();
            ctx.moveTo(
                a.x,
                a.y
            );
            ctx.quadraticCurveTo(
                controlX,
                controlY,
                b.x,
                b.y
            );
            ctx.strokeStyle = `
                rgba(
                    255,
                    255,
                    255,
                    ${opacity * 0.055}
                )
            `;
            ctx.lineWidth =
                0.7;

            ctx.stroke();
            const speed =
                0.95;
            const offset =
                (
                    i * 0.17 +
                    j * 0.11
                );
            const t =
                (
                    connectionTime *
                    speed +
                    offset
                ) % 1;
            const oneMinusT =
                1 - t;
            const flashX =
                oneMinusT *
                oneMinusT *
                a.x +
                2 *
                oneMinusT *
                t *
                controlX +
                t *
                t *
                b.x;
            const flashY =
                oneMinusT *
                oneMinusT *
                a.y +
                2 *
                oneMinusT *
                t *
                controlY +
                t *
                t *
                b.y;
            const trailT =
                Math.max(
                    0,
                    t - 0.10
                );
            const trailOneMinus =
                1 - trailT;
            const trailX =
                trailOneMinus *
                trailOneMinus *
                a.x +
                2 *
                trailOneMinus *
                trailT *
                controlX +
                trailT *
                trailT *
                b.x;
            const trailY =
                trailOneMinus *
                trailOneMinus *
                a.y +
                2 *
                trailOneMinus *
                trailT *
                controlY +
                trailT *
                trailT *
                b.y;
            const gradient =
                ctx.createLinearGradient(
                    trailX,
                    trailY,
                    flashX,
                    flashY
                );
            gradient.addColorStop(
                0,
                "rgba(255,255,255,0)"
            );
            gradient.addColorStop(
                1,
                `rgba(
                    255,
                    255,
                    255,
                    ${opacity * 0.75}
                )`
            );
            ctx.beginPath();
            ctx.moveTo(
                trailX,
                trailY
            );
            ctx.lineTo(
                flashX,
                flashY
            );
            ctx.strokeStyle =
                gradient;
            ctx.lineWidth =
                1.8;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(
                flashX,
                flashY,
                2.3,
                0,
                Math.PI * 2
            );
            ctx.fillStyle = `
                rgba(
                    255,
                    255,
                    255,
                    ${opacity}
                )
            `;
            ctx.shadowBlur =
                22;
            ctx.shadowColor =
                "rgba(255,255,255,0.95)";
            ctx.fill();
            ctx.shadowBlur =
                0;
        }
    }
}

    function drawNode(
        node
    ) {
        if (
            node.z <
            -0.1
        ) {
            return;
        }
        const pulse =
            Math.sin(
                Date.now() *
                0.004 +
                node.x * 10
            );
        const size =
            3 +
            pulse * 1;
        ctx.beginPath();
        ctx.arc(
            node.x,
            node.y,
            size,
            0,
            Math.PI * 2
        );
        ctx.fillStyle =
            "rgba(255,255,255,0.95)";
        ctx.shadowBlur =
            18;
        ctx.shadowColor =
            "rgba(255,255,255,0.9)";
        ctx.fill();
        ctx.shadowBlur =
            0;
        ctx.strokeStyle =
            "rgba(255,255,255,0.4)";
        ctx.lineWidth =
            0.7;
        ctx.strokeRect(
            node.x - 7,
            node.y - 7,
            14,
            14
        );

    }

    const orbitalNodes = [
        {
            angle: 0,
            speed: 0.004,
            radiusX: 1.32,
            radiusY: 0.42
        },
        {
            angle: 2,
            speed: 0.003,
            radiusX: 1.42,
            radiusY: 0.55
        },
        {
            angle: 4,
            speed: 0.005,
            radiusX: 1.25,
            radiusY: 0.32
        }
    ];

    function drawOrbitalNodes() {
        orbitalNodes.forEach(
            orbit => {
                orbit.angle +=
                orbit.speed;
            const x =
                centerX +
                Math.cos(
                    orbit.angle
                ) *
                radius *
                orbit.radiusX;
            const y =
                centerY +
                Math.sin(
                    orbit.angle
                ) *
                radius *
                orbit.radiusY;
            ctx.fillStyle =
                "rgba(255,255,255,0.95)";
            ctx.shadowBlur =
                16;
            ctx.shadowColor =
                "rgba(255,255,255,0.8)";
            ctx.fillRect(
                x - 2,
                y - 2,
                4,
                4
            );
            ctx.shadowBlur =
                0;
            ctx.strokeStyle =
                "rgba(255,255,255,0.35)";
            ctx.strokeRect(
                x - 6,
                y - 6,
                12,
                12
            );
        }
    );
}
 
function drawEarth() {
        ctx.clearRect(
            0,
            0,
            width,
            height
        );
        rotation +=
            0.0022;
        drawEarthOutline();
        drawOrbitalNodes();
        const projectedNodes =
            [];
        points.forEach(
            point => {
                const rotated =
                    rotatePoint(
                        point,
                        rotation
                    );
                const projected =
                    projectPoint(
                        rotated
                    );
                const depth =
                    (
                        rotated.z +
                        1
                    ) / 2;
                const alpha =
                    0.08 +
                    depth *
                    point.brightness;
                const size =
                    point.size *
                    projected.scale;
                ctx.beginPath();
                ctx.arc(
                    projected.x,
                    projected.y,
                    size,
                    0,
                    Math.PI * 2
                );
                ctx.fillStyle = `
                    rgba(
                        255,
                        255,
                        255,
                        ${alpha}
                    )
                `;
                ctx.fill();
            }
        );

        connectionNodes.forEach(
            point => {
                const rotated =
                    rotatePoint(
                        point,
                        rotation
                    );
                const projected =
                    projectPoint(
                        rotated
                    );
                projectedNodes.push(
                    projected
                );
            }
        );
        drawConnections(
            projectedNodes
        );
        projectedNodes.forEach(
            drawNode
        );
        requestAnimationFrame(
            drawEarth
        );
    }
    resizeEarthCanvas();
    createEarthPoints();
    drawEarth();

    window.addEventListener(
        "resize",
        resizeEarthCanvas
    );
}

const earthFlashCanvas =
    document.getElementById(
        "earthFlashCanvas"
    );
const contactGlobe =
    document.querySelector(
        ".contact-globe"
    );
const earthCanvasForIntro =
    document.getElementById(
        "earthCanvas"
    );
const earthInfoForIntro =
    document.querySelector(
        ".earth-info"
    );
if (
    earthFlashCanvas &&
    contactGlobe &&
    earthCanvasForIntro
) {
    const flashCtx =
        earthFlashCanvas.getContext(
            "2d"
        );
    let flashWidth = 0;
    let flashHeight = 0;
    let targetCenterX = 0;
    let targetCenterY = 0;
    let targetRadius = 0;
    let introFlashes = [];

    function clamp(
        value,
        min = 0,
        max = 1
    ) {
        return Math.max(
            min,
            Math.min(
                max,
                value
            )
        );
    }

    function randomBetween(
        min,
        max
    ) {
        return (
            Math.random() *
            (
                max - min
            )
            +
            min
        );
    }

    function smoothStep(
        value
    ) {
        value =
            clamp(value);
        return (
            value *
            value *
            (
                3 -
                2 * value
            )
        );
    }

    function resizeEarthFlashCanvas() {
        const rect =
            earthFlashCanvas
                .getBoundingClientRect();
        const earthRect =
            earthCanvasForIntro
                .getBoundingClientRect();
        const dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );
        earthFlashCanvas.width =
            rect.width *
            dpr;
        earthFlashCanvas.height =
            rect.height *
            dpr;
        flashCtx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );
        flashWidth =
            rect.width;
        flashHeight =
            rect.height;
        targetCenterX =
            flashWidth / 2;
        targetCenterY =
            flashHeight -
            earthRect.height / 2;
        targetRadius =
            Math.min(
                earthRect.width,
                earthRect.height
            ) * 0.31;
    }

    function createScrollConnections() {
        introFlashes = [];
        const total =
            22;
        for (
            let i = 0;
            i < total;
            i++
        ) {
            const targetAngle =
                (
                    Math.PI * 2 *
                    i /
                    total
                )
                +
                randomBetween(
                    -0.08,
                    0.08
                );
            const targetX =
                targetCenterX +
                Math.cos(
                    targetAngle
                ) *
                targetRadius;
            const targetY =
                targetCenterY +
                Math.sin(
                    targetAngle
                ) *
                targetRadius;
            const startX =
                randomBetween(
                    flashWidth * 0.05,
                    flashWidth * 0.95
                );
            const startY =
                randomBetween(
                    5,
                    70
                );
            const controlX =
                (
                    startX +
                    targetX
                ) / 2
                +
                randomBetween(
                    -85,
                    85
                );
            const controlY =
                randomBetween(
                    flashHeight * 0.25,
                    targetCenterY * 0.68
                );
            const delay =
                randomBetween(
                    0,
                    0.23
                );
            const end =
                randomBetween(
                    0.62,
                    0.78
                );
            introFlashes.push({
                startX,
                startY,
                controlX,
                controlY,
                targetX,
                targetY,
                delay,
                end,
                size:
                    randomBetween(
                        1.3,
                        2.3
                    ),
                trail:
                    randomBetween(
                        0.07,
                        0.15
                    )
            });
        }
    }

    function getScrollBezierPoint(
        flash,
        t
    ) {
        const oneMinus =
            1 - t;
        return {
            x:
                oneMinus *
                oneMinus *
                flash.startX
                +
                2 *
                oneMinus *
                t *
                flash.controlX
                +
                t *
                t *
                flash.targetX,
            y:
                oneMinus *
                oneMinus *
                flash.startY
                +
                2 *
                oneMinus *
                t *
                flash.controlY
                +
                t *
                t *
                flash.targetY
        };
    }

    function drawScrollFlash(
        flash,
        localProgress,
        globalProgress
    ) {
        const progress =
            smoothStep(
                localProgress
            );
        const spawnProgress =
            smoothStep(
                clamp(
                    progress / 0.16
            )
        );
        const head =
            getScrollBezierPoint(
                flash,
                progress
            );
        const tailProgress =
            Math.max(
                0,
                progress -
                flash.trail
            );
        const tail =
            getScrollBezierPoint(
                flash,
                tailProgress
            );
        const strength =(
            0.30 +
            progress *
            0.70
        ) *
        spawnProgress;
        if (
            progress > 0.035 &&
            progress < 0.999
        ) {
            const gradient =
                flashCtx
                    .createLinearGradient(
                        tail.x,
                        tail.y,
                        head.x,
                        head.y
                    );
            gradient.addColorStop(
                0,
                "rgba(255,255,255,0)"
            );
            gradient.addColorStop(
                0.55,
                `rgba(
                    255,
                    255,
                    255,
                    ${0.14 * strength}
                )`
            );
            gradient.addColorStop(
                1,
                `rgba(
                    255,
                    255,
                    255,
                    ${0.95 * strength}
                )`
            );
            flashCtx.beginPath();
            flashCtx.moveTo(
                tail.x,
                tail.y
            );
            flashCtx.lineTo(
                head.x,
                head.y
            );
            flashCtx.strokeStyle =
                gradient;
            flashCtx.lineWidth =
                1.5;
            flashCtx.stroke();
        }
        let headOpacity =
            spawnProgress
        if (
            globalProgress >
            0.80
        ) {
            headOpacity =
                1 -
                clamp(
                    (
                        globalProgress -
                        0.80
                    ) /
                    0.20
                );
        }
        if (
            spawnProgress < 1
        ) {
            const blurSize =
            18 -
            spawnProgress * 11;
            const glowRadius =
            flash.size *
            (
                4 -
                spawnProgress * 2
            );
            const spawnGlow =
            flashCtx.createRadialGradient(
                head.x,
                head.y,
                0,
                head.x,
                head.y,
                glowRadius
            );
            spawnGlow.addColorStop(
                0,
                `rgba(
                255,
                255,
                255,
                ${spawnProgress * 0.45}
                )`
            );
            spawnGlow.addColorStop(
                0.35,
                `rgba(
                255,
                255,
                255,
                ${spawnProgress * 0.12}
                )`
            );
            spawnGlow.addColorStop(
                1,
                "rgba(255,255,255,0)"
            );
            flashCtx.beginPath();
            flashCtx.arc(
                head.x,
                head.y,
                glowRadius,
                0,
                Math.PI * 2
            );
            flashCtx.fillStyle =
            spawnGlow;
            flashCtx.shadowBlur =
            blurSize;
            flashCtx.shadowColor =
            "rgba(255,255,255,0.40)";
            flashCtx.fill();
            flashCtx.shadowBlur =
            0;
        }
        flashCtx.beginPath();
        const currentFlashSize =
        flash.size *
        (
            0.65 *
            spawnProgress *
            0.35
        );
        flashCtx.arc(
            head.x,
            head.y,
            currentFlashSize,
            0,
            Math.PI * 2
        );
        flashCtx.fillStyle = `
            rgba(
                255,
                255,
                255,
                ${headOpacity}
            )
        `;
        flashCtx.shadowBlur = (
            28 -
            spawnProgress * 10
        ) *
        headOpacity;
        flashCtx.shadowColor =
            "rgba(255,255,255,0.95)";
        flashCtx.fill();
        flashCtx.shadowBlur =
            0;
        if (
            progress >
            0.92
        ) {
            const nodeOpacity =
                clamp(
                    (
                        progress -
                        0.92
                    ) /
                    0.08
                )
                *
                headOpacity;
            flashCtx.beginPath();
            flashCtx.arc(
                flash.targetX,
                flash.targetY,
                1.6,
                0,
                Math.PI * 2
            );
            flashCtx.fillStyle = `
                rgba(
                    255,
                    255,
                    255,
                    ${nodeOpacity * 0.85}
                )
            `;
            flashCtx.fill();
        }
    }

    function drawFormationRing(
        progress
    ) {
        const ringProgress =
            clamp(
                (
                    progress -
                    0.48
                ) /
                0.30
            );
        if (
            ringProgress <= 0
        ) {
            return;
        }
        const fadeOut =
            1 -
            clamp(
                (
                    progress -
                    0.82
                ) /
                0.18
            );
        flashCtx.beginPath();
        flashCtx.arc(
            targetCenterX,
            targetCenterY,
            targetRadius,
            0,
            Math.PI * 2
        );
        flashCtx.strokeStyle = `
            rgba(
                255,
                255,
                255,
                ${
                    ringProgress *
                    fadeOut *
                    0.11
                }
            )
        `;
        flashCtx.lineWidth =
            0.8;
        flashCtx.stroke();
    }

    // RENDER BASED ON SCROLL
    function renderGlobeScrollIntro() {
        const rect =
            contactGlobe
                .getBoundingClientRect();
        const start =
            window.innerHeight *
            0.94;
        const end =
            window.innerHeight *
            0.34;
        let progress =
            (
                start -
                rect.top
            )
            /
            (
                start -
                end
            );
        progress =
            clamp(
                progress
            );
        flashCtx.clearRect(
            0,
            0,
            flashWidth,
            flashHeight
        );

        // FLASHES
        introFlashes.forEach(
            flash => {
                const localProgress =
                    clamp(
                        (
                            progress -
                            flash.delay
                        )
                        /
                        (
                            flash.end -
                            flash.delay
                        )
                    );
                drawScrollFlash(
                    flash,
                    localProgress,
                    progress
                );
            }
        );
        drawFormationRing(
            progress
        );

        // GLOBE REVEAL
        const globeReveal =
            smoothStep(
                clamp(
                    (
                        progress -
                        0.58
                    )
                    /
                    0.32
                )
            );
        earthCanvasForIntro.style.opacity =
            globeReveal;
        earthCanvasForIntro.style.transform = `
            scale(
                ${
                    0.88 +
                    globeReveal *
                    0.12
                }
            )
        `;
        earthCanvasForIntro.style.filter = `
            blur(
                ${
                    7 *
                    (
                        1 -
                        globeReveal
                    )
                }px
            )
        `;

        // INFO REVEAL
        if (
            earthInfoForIntro
        ) {
            const infoReveal =
                smoothStep(
                    clamp(
                        (
                            progress -
                            0.73
                        )
                        /
                        0.22
                    )
                );
            earthInfoForIntro.style.opacity =
                infoReveal;
            earthInfoForIntro.style.transform = `
                translateX(-50%)
                translateY(
                    ${
                        8 *
                        (
                            1 -
                            infoReveal
                        )
                    }px
                )
            `;
        }
    }

    // SCROLL RAF
    let globeScrollTicking =
        false;
    function requestGlobeScrollRender() {
        if (
            globeScrollTicking
        ) {
            return;
        }
        globeScrollTicking =
            true;
        requestAnimationFrame(
            () => {
                renderGlobeScrollIntro();
                globeScrollTicking =
                    false;

            }
        );
    }

    // INIT GLOBO
    function initializeGlobeScrollIntro() {
        resizeEarthFlashCanvas();
        createScrollConnections();
        renderGlobeScrollIntro();
    }
    window.addEventListener(
        "scroll",
        requestGlobeScrollRender,
        {
            passive: true
        }
    );
    window.addEventListener(
        "resize",
        () => {
            resizeEarthFlashCanvas();
            createScrollConnections();
            renderGlobeScrollIntro();
        }
    );
    initializeGlobeScrollIntro();
}

// CONTACT INTRO
const contactIntro =
    document.querySelector(
        ".contact-intro-line"
    );
let contactIntroChars = [];

function prepareContactIntro() {
    if (!contactIntro) {
        return;
    }
    const text =
        contactIntro.textContent.trim();
    contactIntro.innerHTML = "";
    [...text].forEach(
        (char, index) => {
            if (char === " ") {
                const space =
                    document.createElement(
                        "span"
                    );
                space.className =
                    "contact-intro-space";
                contactIntro.appendChild(
                    space
                );
                return;
            }
            const span =
                document.createElement(
                    "span"
                );
            span.className =
                "contact-intro-char";
            span.textContent =
                char;
            span.dataset.index =
                index;
            contactIntro.appendChild(
                span
            );
        }
    );

    contactIntroChars =
        [
            ...contactIntro.querySelectorAll(
                ".contact-intro-char"
            )
        ];
}


/* =========================================
   PROJECTS — CARD SCROLL ANIMATION
========================================= */

const projectsSection = document.querySelector("#projects");

// PROJECT IMAGEM CAIXA
const projectLightbox =
    document.getElementById(
        "projectLightbox"
    );
const projectLightboxImage =
    document.getElementById(
        "projectLightboxImage"
    );
const projectLightboxClose =
    document.getElementById(
        "projectLightboxClose"
    );
const projectPreviewImages =
    document.querySelectorAll(
        ".project-preview-image"
    );

// ABRIR
function openProjectLightbox(
    image
) {
    if (
        !projectLightbox ||
        !projectLightboxImage ||
        !image
    ) {
        return;
    }
    projectLightboxImage.src =
        image.currentSrc ||
        image.src;
    projectLightboxImage.alt =
        image.alt ||
        "Project preview";
    projectLightbox
        .classList
        .add(
            "open"
        );
    projectLightbox
        .setAttribute(
            "aria-hidden",
            "false"
        );
    document.body.style.overflow =
        "hidden";
}

// FECHAR
function closeProjectLightbox() {
    if (
        !projectLightbox
    ) {
        return;
    }
    projectLightbox
        .classList
        .remove(
            "open"
        );
    projectLightbox
        .setAttribute(
            "aria-hidden",
            "true"
        );
    document.body.style.overflow =
        "";
    setTimeout(
        () => {
            if (
                projectLightboxImage &&
                !projectLightbox
                    .classList
                    .contains("open")
            ) {
                projectLightboxImage.src =
                    "";

                projectLightboxImage.alt =
                    "";
            }
        },
        350
    );
}

// CLICK MODAL IMAGEM
projectPreviewImages.forEach(
    button => {
        button.addEventListener(
            "click",
            () => {
                const image =
                    button.querySelector(
                        "img"
                    );
                if (
                    image
                ) {
                    openProjectLightbox(
                        image
                    );
                }
            }
        );
    }
);

// BOTAO FECHAR
if (
    projectLightboxClose
) {
    projectLightboxClose
        .addEventListener(
            "click",
            closeProjectLightbox
        );
}

// CLICAR FOR DO MODAL FECHA
if (
    projectLightbox
) {
    projectLightbox
        .addEventListener(
            "click",
            event => {
                if (
                    event.target ===
                    projectLightbox
                ) {

                    closeProjectLightbox();
                }
            }
        );
}

// ESC FECHA MODAL
document.addEventListener(
    "keydown",
    event => {
        if (
            event.key ===
            "Escape" &&
            projectLightbox &&
            projectLightbox
                .classList
                .contains("open")
        ) {
            closeProjectLightbox();
        }
    }
);

const projectsMenuLinks =
    document.querySelectorAll(
        'a[href="#projects"]'
    );
projectsMenuLinks.forEach(
    link => {
        link.addEventListener(
            "click",
            event => {
                event.preventDefault();
                if (
                    !projectsSection
                ) {
                    return;
                }
                const scrollRange =
                    Math.max(
                        0,
                        projectsSection.offsetHeight -
                        window.innerHeight
                    );
                const completedPosition =
                    scrollRange *
                    0.52;
                const targetY =
                    projectsSection.offsetTop +
                    completedPosition;
                window.scrollTo({
                    top: targetY,
                    behavior: "smooth"
                });
            }
        );
    }
);


/* ============================================
   PROJECTS — SCROLL CINEMATIC REVEAL
   LETTERS FALL + CORNERS FROM SCREEN EDGES
============================================ */

const projectsRevealSection =
    document.querySelector("#projects");

const projectsRevealCapsule =
    document.querySelector(".projects-header-capsule");

const projectsRevealCard =
    document.querySelector(".project-showcase-card");

const projectCornerElements = [
    document.querySelector(".project-showcase-card .corner-top-left"),
    document.querySelector(".project-showcase-card .corner-top-right"),
    document.querySelector(".project-showcase-card .corner-bottom-left"),
    document.querySelector(".project-showcase-card .corner-bottom-right")
];

function clampProjectsReveal(value) {
    return Math.max(0, Math.min(1, value));
}

function easeProjectsReveal(value) {
    const t = clampProjectsReveal(value);

    return t * t * (3 - 2 * t);
}

function renderProjectsReveal() {
    if (
        !projectsRevealSection ||
        !projectsRevealCapsule ||
        !projectsRevealCard
    ) return;

    const rect = projectsRevealSection.getBoundingClientRect();

    /*
       A animação começa quando a seção
       entra na tela e termina enquanto
       avança pela região sticky.
    */
    const start = window.innerHeight * 0.90;
    const end = window.innerHeight * 0.08;

    const progress = clampProjectsReveal(
        (start - rect.top) / (start - end)
    );

    /* =====================================
       1. LETRAS CAINDO NA CÁPSULA
    ===================================== */

    const letterLayers = [
        projectsRevealCapsule.querySelectorAll(
            ".projects-title-main span"
        ),
    ];

    letterLayers.forEach((letters, layerIndex) => {
        letters.forEach((letter, index) => {

            const delay = index * 0.045;

            const localProgress = easeProjectsReveal(
                (progress - delay) / 0.53
            );

            const finalLetterTop =
            projectsRevealCapsule.getBoundingClientRect().top +
            projectsRevealCapsule.offsetHeight / 2;

            const initialY =
            -finalLetterTop -
            100 -
            (index * 35);

            const travelY =
                initialY * (1 - localProgress);

            const initialRotation =
                index % 2 === 0 ? -9 : 9;

            const rotation =
                initialRotation * (1 - localProgress);

            const alpha = clampProjectsReveal(
                localProgress * 2
            );

            /*
               Usamos a propriedade translate
               individual, preservando a animação
               CSS que usa transform.
            */
            letter.style.translate =
                `0 ${travelY}px`;

            letter.style.rotate =
                `${rotation}deg`;

            letter.style.opacity = alpha;

        });

    });

    /* =====================================
       2. CANTONEIRAS VINDO DOS 4 CANTOS
    ===================================== */

    const cornersProgress = easeProjectsReveal(
        (progress - 0.12) / 0.68
    );

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const corners = [
        { x: 0, y: 0 },
        { x: viewportWidth, y: 0 },
        { x: 0, y: viewportHeight },
        { x: viewportWidth, y: viewportHeight }
    ];

    projectCornerElements.forEach((corner, index) => {
        if (!corner) return;

        const cornerRect = corner.getBoundingClientRect();

        /*
           Mede a posição final da cantoneira.
           Como translate pode estar ativo,
           removemos seu efeito na medição.
        */
        const currentTranslateX =
            parseFloat(corner.dataset.revealX || "0");

        const currentTranslateY =
            parseFloat(corner.dataset.revealY || "0");

        const finalX =
            cornerRect.left - currentTranslateX;

        const finalY =
            cornerRect.top - currentTranslateY;

        const target = corners[index];

        const moveX =
            (target.x - finalX) *
            (1 - cornersProgress);

        const moveY =
            (target.y - finalY) *
            (1 - cornersProgress);

        corner.style.translate =
            `${moveX}px ${moveY}px`;

        corner.style.opacity =
            String(cornersProgress);

        corner.dataset.revealX = moveX;
        corner.dataset.revealY = moveY;
    });
}

/* =====================================
   PERFORMANCE — REQUEST ANIMATION FRAME
===================================== */

let projectsRevealTicking = false;

function requestProjectsReveal() {
    if (projectsRevealTicking) return;

    projectsRevealTicking = true;

    requestAnimationFrame(() => {
        renderProjectsReveal();
        projectsRevealTicking = false;
    });
}

if (projectsRevealSection) {
    window.addEventListener(
        "scroll",
        requestProjectsReveal,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        requestProjectsReveal
    );

    renderProjectsReveal();
}
