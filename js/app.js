// State
let selectedMirrors = [];
let globalSettings = {
    webRoot: '/var/www/html',
    analytics: true,
    serverName: '_',
    useDefaultServer: true,
    startHour: Math.floor(Math.random() * 24), // Default random 0-23
    syncFrequency: 1 // Default once a day
};

// DOM Elements
const mirrorsList = document.getElementById('mirrors-list');
const generatedCode = document.getElementById('generated-code');
const generateBtn = document.getElementById('generate-btn');
const webRootInput = document.getElementById('web-root');
const analyticsCheckbox = document.getElementById('analytics-check');
const serverNameInput = document.getElementById('server-name');
const defaultServerCheck = document.getElementById('default-server-check');
const cronStartHourInput = document.getElementById('cron-start-hour');
const syncFrequencyInput = document.getElementById('sync-frequency');

// Initialize
function init() {
    // Set initial random value to input
    cronStartHourInput.value = globalSettings.startHour;
    if (syncFrequencyInput) syncFrequencyInput.value = globalSettings.syncFrequency;

    renderPresets();
    setupEventListeners();
    updateServerNameState(); // Initial state
    generateScript(); // Initial generation
}

function renderPresets() {
    mirrorsList.innerHTML = PRESETS.map(preset => `
        <div class="border rounded p-4 mb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white shadow-sm hover:shadow-md transition gap-4">
            <div>
                <h3 class="font-bold text-lg">${preset.name}</h3>
                <p class="text-gray-600 text-sm">${preset.description}</p>
                <div class="text-xs text-gray-500 mt-1">Upstream: ${preset.upstream}</div>
                ${preset.helpUrl ? `<a href="${preset.helpUrl}" target="_blank" class="text-xs text-blue-500 hover:underline mt-1 inline-block">Official Registration Info ↗</a>` : ''}
            </div>
            <button onclick="toggleMirror('${preset.id}')" 
                    id="btn-${preset.id}"
                    class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition whitespace-nowrap">
                Add
            </button>
        </div>
    `).join('');
}

function setupEventListeners() {
    webRootInput.addEventListener('input', (e) => { globalSettings.webRoot = e.target.value; generateScript(); });
    analyticsCheckbox.addEventListener('change', (e) => { globalSettings.analytics = e.target.checked; generateScript(); });

    serverNameInput.addEventListener('input', (e) => { globalSettings.serverName = e.target.value; generateScript(); });
    defaultServerCheck.addEventListener('change', (e) => {
        globalSettings.useDefaultServer = e.target.checked;
        updateServerNameState();
        generateScript();
    });

    cronStartHourInput.addEventListener('input', (e) => {
        let val = parseInt(e.target.value);
        if (isNaN(val)) val = 0;
        if (val < 0) val = 0;
        if (val > 23) val = 23;
        globalSettings.startHour = val;
        generateScript();
    });

    if (syncFrequencyInput) {
        syncFrequencyInput.addEventListener('change', (e) => {
            globalSettings.syncFrequency = parseInt(e.target.value);
            generateScript();
        });
    }

    generateBtn.addEventListener('click', generateScript);
}

function updateServerNameState() {
    if (globalSettings.useDefaultServer) {
        serverNameInput.disabled = true;
        globalSettings.serverName = '_';
    } else {
        serverNameInput.disabled = false;
        if (serverNameInput.value === '' || serverNameInput.value === '_') {
            serverNameInput.value = ''; // Clear if it was default
        }
        globalSettings.serverName = serverNameInput.value || 'example.com';
    }
}

// Global scope for HTML onclick
window.toggleMirror = function (id) {
    const btn = document.getElementById(`btn-${id}`);
    const index = selectedMirrors.findIndex(m => m.id === id);

    if (index === -1) {
        // Add
        const preset = PRESETS.find(p => p.id === id);
        selectedMirrors.push({ ...preset }); // Clone
        btn.textContent = 'Remove';
        btn.classList.remove('bg-gray-200', 'hover:bg-gray-300');
        btn.classList.add('bg-red-500', 'text-white', 'hover:bg-red-600');
    } else {
        // Remove
        selectedMirrors.splice(index, 1);
        btn.textContent = 'Add';
        btn.classList.remove('bg-red-500', 'text-white', 'hover:bg-red-600');
        btn.classList.add('bg-gray-200', 'hover:bg-gray-300');
    }
    generateScript(); // Auto-regenerate preview
};

function generateCronSchedule(index) {
    const baseHour = globalSettings.startHour;
    const frequency = globalSettings.syncFrequency;

    // Stagger logic:
    // We still stagger by 30 mins per mirror to avoid thundering herd.
    const totalMinutesOffset = index * 30;
    const addedHours = Math.floor(totalMinutesOffset / 60);
    const minute = totalMinutesOffset % 60;

    const startHour = (baseHour + addedHours) % 24;

    // Calculate hours based on frequency
    const hours = [];
    const interval = 24 / frequency; // 24, 12, or 6

    for (let i = 0; i < frequency; i++) {
        hours.push((startHour + (i * interval)) % 24);
    }

    return `${minute} ${hours.sort((a, b) => a - b).join(',')} * * *`;
}

function generateScript() {
    const root = globalSettings.webRoot.replace(/\/$/, ''); // Remove trailing slash
    const serverName = globalSettings.serverName;

    let script = `#!/bin/bash
# OpenMirror Setup Script
# Generated on ${new Date().toISOString()}

set -e

# 1. Install Dependencies
echo "Installing dependencies..."
apt-get update
apt-get install -y nginx rsync ${globalSettings.analytics ? 'goaccess' : ''} cron

# 2. Create Web Root
echo "Creating web root at ${root}..."
mkdir -p ${root}
chown -R www-data:www-data ${root}

# 3. Configure Nginx
echo "Configuring Nginx..."
cat <<EOF > /etc/nginx/conf.d/openmirror.conf
server {
    listen 80;
    server_name ${serverName};
    
    root ${root};
    autoindex on;
    
    access_log /var/log/nginx/openmirror_access.log combined;
    error_log /var/log/nginx/openmirror_error.log;

    location / {
        try_files \\$uri \\$uri/ =404;
    }

    ${globalSettings.analytics ? `
    location /stats.html {
        alias ${root}/stats.html;
    }
    ` : ''}
}
EOF

${globalSettings.useDefaultServer ? `
# Remove default nginx config if it exists (since we are using default server)
rm -f /etc/nginx/sites-enabled/default
` : ''}

# 4. Configure Mirrors & Cron
echo "Configuring Mirrors..."
`;

    selectedMirrors.forEach((mirror, index) => {
        const mirrorPath = `${root}/${mirror.defaultPath}`;
        const cronSchedule = generateCronSchedule(index);

        script += `
# --- ${mirror.name} ---
echo "Setting up ${mirror.name}..."
mkdir -p ${mirrorPath}
chown www-data:www-data ${mirrorPath}

# Create Cron Job
# Schedule: ${cronSchedule}
cat <<EOF >> /etc/cron.d/openmirror
${cronSchedule} root rsync -avz --delete ${mirror.excludes ? mirror.excludes.join(' ') : ''} ${mirror.upstream} ${mirrorPath} >> /var/log/openmirror-${mirror.id}.log 2>&1
EOF
`;
    });

    if (globalSettings.analytics) {
        script += `
# --- Analytics ---
echo "Setting up Analytics..."
# Run GoAccess daily
cat <<EOF >> /etc/cron.d/openmirror
0 0 * * * root goaccess /var/log/nginx/openmirror_access.log -o ${root}/stats.html --log-format=COMBINED
EOF
`;
    }

    script += `
# 5. Restart Services
echo "Restarting services..."
systemctl restart nginx
systemctl restart cron

echo "OpenMirror setup complete!"
echo "Your mirrors will start syncing according to the schedule."
echo "Monitor logs at /var/log/openmirror-*.log"

# 6. Initial Sync Instructions
echo ""
echo "-----------------------------------------------------"
echo "To start the initial sync immediately in the background:"
echo ""
`;

    selectedMirrors.forEach(mirror => {
        const mirrorPath = `${root}/${mirror.defaultPath}`;
        script += `echo "nohup rsync -avz --delete ${mirror.excludes ? mirror.excludes.join(' ') : ''} ${mirror.upstream} ${mirrorPath} >> /var/log/openmirror-${mirror.id}.log 2>&1 &"
`;
    });

    script += `
echo ""
echo "You can track progress with: tail -f /var/log/openmirror-*.log"
echo "-----------------------------------------------------"
`;

    generatedCode.textContent = script;
}

// Start
init();
