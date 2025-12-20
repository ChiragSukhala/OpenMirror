const PRESETS = [
    {
        id: 'ubuntu',
        name: 'Ubuntu',
        description: 'Official Ubuntu Archive Mirror',
        upstream: 'rsync://archive.ubuntu.com/ubuntu',
        defaultPath: 'ubuntu',
        helpUrl: 'https://wiki.ubuntu.com/Mirrors',
        excludes: ['--exclude=~tmp', '--exclude=*.iso']
    },
    {
        id: 'archlinux',
        name: 'Arch Linux',
        description: 'Arch Linux Package Repository',
        upstream: 'rsync://rsync.archlinux.org/ftp_tier1',
        defaultPath: 'archlinux',
        helpUrl: 'https://wiki.archlinux.org/title/DeveloperWiki:NewMirrors',
        excludes: []
    },
    {
        id: 'alpine',
        name: 'Alpine Linux',
        description: 'Alpine Linux Packages',
        upstream: 'rsync://rsync.alpinelinux.org/alpine/',
        defaultPath: 'alpine',
        helpUrl: 'https://wiki.alpinelinux.org/wiki/How_to_setup_a_Alpine_Linux_mirror',
        excludes: []
    },
    {
        id: 'videolan',
        name: 'VideoLAN (VLC)',
        description: 'VideoLAN Software Mirror',
        upstream: 'rsync://images.videolan.org/videolan-ftp/',
        defaultPath: 'videolan',
        helpUrl: 'https://www.videolan.org/videolan/mirrors.html',
        excludes: []
    },
    {
        id: 'ctan',
        name: 'CTAN',
        description: 'The Comprehensive TeX Archive Network (CTAN) Mirror',
        upstream: 'rsync://rsync.dante.de/CTAN',
        defaultPath: 'ctan',
        helpUrl: 'https://ctan.org/mirrors',
        excludes: []
    },
    {
        id: 'termux',
        name: 'Termux',
        description: 'Termux Package Mirror',
        upstream: 'rsync://packages.termux.dev/termux',
        defaultPath: 'termux',
        helpUrl: 'https://github.com/termux/termux-packages/wiki/Mirrors',
        excludes: []
    },
];
