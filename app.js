class TerminalPortfolio {
    constructor() {
        this.currentInput = '';
        this.commandHistory = [];
        this.historyIndex = 0;
        this.currentTheme = 'green';
        this.isTyping = false;
        
        // Portfolio data
        this.data = {
            developer: {
                name: "Alex Developer",
                title: "Full Stack Developer",
                location: "San Francisco, CA",
                bio: "Passionate full-stack developer with 5+ years of experience building modern web applications. Specialized in React, Node.js, and cloud technologies. Love creating clean, efficient code and solving complex problems.",
                ascii_art: "    _    _     _____  __  __\n   / \\  | |   | ____| \\ \\/ /\n  / _ \\ | |   |  _|    \\  / \n / ___ \\| |___| |___   /  \\ \n/_/   \\_\\_____|_____| /_/\\_\\"
            },
            skills: [
                {"name": "JavaScript", "level": 95, "category": "Programming"},
                {"name": "React", "level": 90, "category": "Frontend"},
                {"name": "Node.js", "level": 85, "category": "Backend"},
                {"name": "Python", "level": 80, "category": "Programming"},
                {"name": "TypeScript", "level": 85, "category": "Programming"},
                {"name": "HTML/CSS", "level": 95, "category": "Frontend"},
                {"name": "MongoDB", "level": 75, "category": "Database"},
                {"name": "PostgreSQL", "level": 80, "category": "Database"},
                {"name": "AWS", "level": 70, "category": "Cloud"},
                {"name": "Docker", "level": 75, "category": "DevOps"},
                {"name": "Git", "level": 90, "category": "Tools"}
            ],
            projects: [
                {
                    name: "E-Commerce Platform",
                    description: "Full-stack e-commerce solution with React frontend and Node.js backend",
                    tech: ["React", "Node.js", "MongoDB", "Stripe API"],
                    github: "https://github.com/user/ecommerce-platform",
                    demo: "https://demo-ecommerce.com",
                    status: "Complete"
                },
                {
                    name: "Task Management App",
                    description: "Real-time collaborative task management tool with drag-and-drop interface",
                    tech: ["Vue.js", "Express.js", "Socket.io", "PostgreSQL"],
                    github: "https://github.com/user/task-manager",
                    demo: "https://task-app-demo.com",
                    status: "In Development"
                },
                {
                    name: "Weather Dashboard",
                    description: "Interactive weather dashboard with data visualization and forecasting",
                    tech: ["React", "D3.js", "Weather APIs", "CSS Grid"],
                    github: "https://github.com/user/weather-dashboard",
                    demo: "https://weather-dash.com",
                    status: "Complete"
                },
                {
                    name: "AI Chat Bot",
                    description: "Intelligent chatbot with natural language processing capabilities",
                    tech: ["Python", "TensorFlow", "Flask", "NLP"],
                    github: "https://github.com/user/ai-chatbot",
                    demo: "https://chatbot-demo.com",
                    status: "Beta"
                }
            ],
            contact: {
                email: "alexdev@example.com",
                github: "https://github.com/alexdev",
                linkedin: "https://linkedin.com/in/alexdeveloper",
                twitter: "https://twitter.com/alexcodes",
                website: "https://alexdeveloper.com",
                location: "San Francisco, CA"
            },
            themes: {
                green: {primary: "#00ff00", secondary: "#008800", accent: "#44ff44"},
                amber: {primary: "#ffb000", secondary: "#cc8800", accent: "#ffcc44"},
                blue: {primary: "#0088ff", secondary: "#0066cc", accent: "#44aaff"},
                matrix: {primary: "#00ff41", secondary: "#008f11", accent: "#44ff77"},
                cyberpunk: {primary: "#ff0080", secondary: "#cc0066", accent: "#ff44aa"}
            },
            commands: ["help", "about", "skills", "projects", "contact", "clear", "whoami", "ls", "theme", "neofetch", "exit", "date", "pwd", "cat", "echo"]
        };
        
        this.initializeElements();
        this.loadUserPreferences();
        this.startBootSequence();
        this.bindEvents();
    }

    initializeElements() {
        this.bootScreen = document.getElementById('boot-screen');
        this.terminalContent = document.getElementById('terminal-content');
        this.output = document.getElementById('output');
        this.inputDisplay = document.getElementById('input-display');
        this.hiddenInput = document.getElementById('hidden-input');
        this.cursor = document.getElementById('cursor');
        this.asciiBanner = document.getElementById('ascii-banner');
        this.prompt = document.getElementById('prompt');
    }

    loadUserPreferences() {
        const savedTheme = localStorage.getItem('terminal-theme');
        if (savedTheme && this.data.themes[savedTheme]) {
            this.currentTheme = savedTheme;
            this.setTheme(savedTheme);
        }
        
        const savedHistory = localStorage.getItem('terminal-history');
        if (savedHistory) {
            this.commandHistory = JSON.parse(savedHistory);
        }
    }

    saveUserPreferences() {
        localStorage.setItem('terminal-theme', this.currentTheme);
        localStorage.setItem('terminal-history', JSON.stringify(this.commandHistory.slice(-50)));
    }

    startBootSequence() {
        setTimeout(() => {
            this.bootScreen.classList.add('hidden');
            this.terminalContent.classList.remove('hidden');
            this.showWelcomeBanner();
            this.focusInput();
        }, 4500);
    }

    showWelcomeBanner() {
        this.asciiBanner.textContent = this.data.developer.ascii_art;
    }

    bindEvents() {
        // Focus management
        document.addEventListener('click', () => this.focusInput());
        
        // Keyboard events
        this.hiddenInput.addEventListener('input', (e) => this.handleInput(e));
        this.hiddenInput.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Mobile support
        if (this.isMobile()) {
            document.querySelector('.mobile-helper').style.display = 'block';
        }
    }

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    focusInput() {
        this.hiddenInput.focus();
    }

    handleInput(e) {
        this.currentInput = e.target.value;
        this.inputDisplay.textContent = this.currentInput;
    }

    handleKeydown(e) {
        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                this.executeCommand();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.navigateHistory('up');
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.navigateHistory('down');
                break;
            case 'Tab':
                e.preventDefault();
                this.handleTabCompletion();
                break;
            case 'c':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.cancelCurrentCommand();
                }
                break;
        }
    }

    executeCommand() {
        const command = this.currentInput.trim();
        if (!command) return;

        this.addToHistory(command);
        this.displayCommand(command);
        this.clearInput();
        
        const [cmd, ...args] = command.toLowerCase().split(' ');
        this.processCommand(cmd, args);
    }

    addToHistory(command) {
        this.commandHistory.push(command);
        this.historyIndex = this.commandHistory.length;
        this.saveUserPreferences();
    }

    displayCommand(command) {
        const commandLine = document.createElement('div');
        commandLine.className = 'command-input';
        commandLine.innerHTML = `<span class="prompt">alex@portfolio:~$ </span>${command}`;
        this.output.appendChild(commandLine);
    }

    clearInput() {
        this.currentInput = '';
        this.hiddenInput.value = '';
        this.inputDisplay.textContent = '';
    }

    navigateHistory(direction) {
        if (direction === 'up' && this.historyIndex > 0) {
            this.historyIndex--;
        } else if (direction === 'down' && this.historyIndex < this.commandHistory.length) {
            this.historyIndex++;
        }

        const command = this.historyIndex < this.commandHistory.length 
            ? this.commandHistory[this.historyIndex] 
            : '';
        
        this.currentInput = command;
        this.hiddenInput.value = command;
        this.inputDisplay.textContent = command;
    }

    handleTabCompletion() {
        const partial = this.currentInput.toLowerCase();
        const matches = this.data.commands.filter(cmd => cmd.startsWith(partial));
        
        if (matches.length === 1) {
            this.currentInput = matches[0];
            this.hiddenInput.value = matches[0];
            this.inputDisplay.textContent = matches[0];
        } else if (matches.length > 1) {
            this.typeOutput(`Available commands: ${matches.join(', ')}`);
        }
    }

    cancelCurrentCommand() {
        this.clearInput();
        this.typeOutput('^C');
    }

    processCommand(cmd, args) {
        switch (cmd) {
            case 'help':
                this.showHelp();
                break;
            case 'about':
                this.showAbout();
                break;
            case 'skills':
                this.showSkills();
                break;
            case 'projects':
                this.showProjects();
                break;
            case 'contact':
                this.showContact();
                break;
            case 'clear':
                this.clearScreen();
                break;
            case 'whoami':
                this.showWhoami();
                break;
            case 'ls':
                this.showList();
                break;
            case 'theme':
                this.changeTheme(args[0]);
                break;
            case 'neofetch':
                this.showNeofetch();
                break;
            case 'exit':
                this.showExit();
                break;
            case 'date':
                this.showDate();
                break;
            case 'pwd':
                this.showPwd();
                break;
            case 'cat':
                this.showCat(args[0]);
                break;
            case 'echo':
                this.showEcho(args.join(' '));
                break;
            case 'sudo':
                this.showSudo();
                break;
            case 'hack':
                this.showHack();
                break;
            default:
                this.showError(`Command not found: ${cmd}. Type 'help' for available commands.`);
        }
        
        this.scrollToBottom();
    }

    showHelp() {
        const helpText = `
Available commands:

<span class="highlight">Portfolio Commands:</span>
  about      - Learn more about me
  skills     - View my technical skills
  projects   - Browse my portfolio projects
  contact    - Get my contact information

<span class="highlight">System Commands:</span>
  help       - Show this help message
  clear      - Clear the terminal screen
  whoami     - Display current user info
  ls         - List available sections
  neofetch   - Show system information with ASCII art
  
<span class="highlight">Customization:</span>
  theme      - Change color theme (green, amber, blue, matrix, cyberpunk)
  
<span class="highlight">Utilities:</span>
  date       - Show current date and time
  pwd        - Print working directory
  cat        - Display file contents
  echo       - Display text
  exit       - Exit the terminal

<span class="highlight">Navigation Tips:</span>
  • Use ↑↓ arrow keys for command history
  • Use Tab for command completion
  • Click anywhere to focus input (mobile-friendly)

Try typing any command above!`;

        this.typeOutput(helpText);
    }

    showAbout() {
        const aboutText = `
<span class="highlight">${this.data.developer.name}</span>
<span class="highlight">${this.data.developer.title}</span>
📍 ${this.data.developer.location}

${this.data.developer.bio}

<span class="highlight">Quick Stats:</span>
• 5+ years of development experience
• Full-stack web development specialist
• Passionate about clean code and problem-solving
• Always learning new technologies

Type 'skills' to see my technical expertise
Type 'projects' to view my portfolio`;

        this.typeOutput(aboutText);
    }

    showSkills() {
        let skillsText = `
<span class="highlight">Technical Skills</span>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;

        const categories = {};
        this.data.skills.forEach(skill => {
            if (!categories[skill.category]) {
                categories[skill.category] = [];
            }
            categories[skill.category].push(skill);
        });

        Object.keys(categories).forEach(category => {
            skillsText += `\n<span class="highlight">${category}:</span>\n`;
            categories[category].forEach(skill => {
                const bar = '█'.repeat(Math.floor(skill.level / 10)) + 
                           '░'.repeat(10 - Math.floor(skill.level / 10));
                skillsText += `  ${skill.name.padEnd(15)} [${bar}] ${skill.level}%\n`;
            });
        });

        this.typeOutput(skillsText);
    }

    showProjects() {
        let projectsText = `
<span class="highlight">Portfolio Projects</span>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;

        this.data.projects.forEach((project, index) => {
            const statusColor = project.status === 'Complete' ? 'success' : 
                               project.status === 'Beta' ? 'warning' : 'highlight';
            
            projectsText += `
<span class="highlight">${index + 1}. ${project.name}</span>
   ${project.description}
   
   <span class="highlight">Tech Stack:</span> ${project.tech.join(', ')}
   <span class="highlight">Status:</span> <span class="${statusColor}">${project.status}</span>
   <span class="highlight">Links:</span> <a href="${project.github}" target="_blank">GitHub</a> | <a href="${project.demo}" target="_blank">Live Demo</a>
`;
        });

        projectsText += `
\nType 'contact' to get in touch about these projects!`;

        this.typeOutput(projectsText);
    }

    showContact() {
        const contactText = `
<span class="highlight">Get In Touch</span>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📧 <span class="highlight">Email:</span>     <a href="mailto:${this.data.contact.email}">${this.data.contact.email}</a>
🐙 <span class="highlight">GitHub:</span>    <a href="${this.data.contact.github}" target="_blank">${this.data.contact.github}</a>
💼 <span class="highlight">LinkedIn:</span>  <a href="${this.data.contact.linkedin}" target="_blank">linkedin.com/in/alexdeveloper</a>
🐦 <span class="highlight">Twitter:</span>   <a href="${this.data.contact.twitter}" target="_blank">@alexcodes</a>
🌐 <span class="highlight">Website:</span>   <a href="${this.data.contact.website}" target="_blank">${this.data.contact.website}</a>
📍 <span class="highlight">Location:</span>  ${this.data.contact.location}

<span class="success">Feel free to reach out for collaborations, opportunities, or just to say hello!</span>`;

        this.typeOutput(contactText);
    }

    showWhoami() {
        this.typeOutput(`${this.data.developer.name.toLowerCase().replace(' ', '')}`);
    }

    showList() {
        this.typeOutput(`about.txt    skills.json    projects/    contact.info    themes/`);
    }

    changeTheme(themeName) {
        if (!themeName) {
            const availableThemes = Object.keys(this.data.themes).join(', ');
            this.typeOutput(`Available themes: ${availableThemes}\nUsage: theme <name>`);
            return;
        }

        if (this.data.themes[themeName]) {
            this.currentTheme = themeName;
            this.setTheme(themeName);
            this.typeOutput(`<span class="success">Theme changed to: ${themeName}</span>`);
            this.saveUserPreferences();
        } else {
            this.showError(`Theme '${themeName}' not found. Available themes: ${Object.keys(this.data.themes).join(', ')}`);
        }
    }

    setTheme(themeName) {
        document.documentElement.setAttribute('data-theme', themeName);
    }

    showNeofetch() {
        const neofetchArt = `
      ██████╗ ██████╗ ██████╗ ████████╗███████╗ ██████╗ ██╗     ██╗ ██████╗ 
      ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗██║     ██║██╔═══██╗
      ██████╔╝██║   ██║██████╔╝   ██║   █████╗  ██║   ██║██║     ██║██║   ██║
      ██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══╝  ██║   ██║██║     ██║██║   ██║
      ██║     ╚██████╔╝██║  ██║   ██║   ██║     ╚██████╔╝███████╗██║╚██████╔╝
      ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝      ╚═════╝ ╚══════╝╚═╝ ╚═════╝`;

        const neofetchInfo = `
<span class="accent">${this.data.developer.name}@portfolio</span>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<span class="highlight">OS:</span>        Portfolio Terminal v2.1.0
<span class="highlight">Host:</span>      ${this.data.developer.title}
<span class="highlight">Kernel:</span>    JavaScript ES2023
<span class="highlight">Uptime:</span>    5+ years
<span class="highlight">Packages:</span>  ${this.data.skills.length} skills, ${this.data.projects.length} projects
<span class="highlight">Shell:</span>     /bin/portfolio
<span class="highlight">Theme:</span>     ${this.currentTheme}
<span class="highlight">Terminal:</span>  alex-terminal
<span class="highlight">CPU:</span>       Brain.js (Multi-core)
<span class="highlight">Memory:</span>    Unlimited creativity
<span class="highlight">Disk:</span>      ${this.data.projects.length} projects, ${this.data.skills.length} skills
<span class="highlight">Colors:</span>    ${Object.keys(this.data.themes).join(', ')}

${neofetchArt}`;

        this.typeOutput(neofetchInfo);
    }

    showDate() {
        const now = new Date();
        const dateStr = now.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        });
        this.typeOutput(dateStr);
    }

    showPwd() {
        this.typeOutput('/home/alex/portfolio');
    }

    showCat(filename) {
        if (!filename) {
            this.showError('cat: missing file name');
            return;
        }

        switch (filename.toLowerCase()) {
            case 'about.txt':
                this.showAbout();
                break;
            case 'skills.json':
                this.typeOutput(JSON.stringify(this.data.skills, null, 2));
                break;
            case 'contact.info':
                this.showContact();
                break;
            default:
                this.showError(`cat: ${filename}: No such file or directory`);
        }
    }

    showEcho(text) {
        this.typeOutput(text || '');
    }

    showSudo() {
        this.typeOutput(`<span class="error">Permission denied. Nice try though! 😏</span>`);
    }

    showHack() {
        this.typeOutput(`<span class="success">Access granted. Welcome to the matrix! 😎</span>`);
    }

    showExit() {
        const exitMessages = [
            "Thanks for visiting my portfolio! 👋",
            "Connection closed by remote host.",
            "Come back anytime! The terminal is always open.",
            "Goodbye! May your code compile on the first try. 🚀"
        ];
        
        const randomMessage = exitMessages[Math.floor(Math.random() * exitMessages.length)];
        this.typeOutput(`<span class="success">${randomMessage}</span>`);
    }

    clearScreen() {
        this.output.innerHTML = '';
    }

    showError(message) {
        this.typeOutput(`<span class="error">${message}</span>`);
    }

    typeOutput(text, speed = 30) {
        const outputDiv = document.createElement('div');
        outputDiv.className = 'command-result';
        outputDiv.innerHTML = text;
        this.output.appendChild(outputDiv);
    }

    scrollToBottom() {
        const terminalBody = document.querySelector('.terminal-body');
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
}

// Initialize the terminal when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TerminalPortfolio();
});