export class Room {
    constructor(
        public id: number,
        public name: string,
        public namespaceId: string,
        public privateRoom: boolean = false,
        public history: string[] = [],
    ) {}

    addMessage(message: string) {
        this.history.push(message);
    }

    clearHistory() {
        this.history = [];
    }
}

export class Namespace {
    constructor(
        public id: number,
        public name: string,
        public image: string,
        public endpoint: string,
        public rooms: Room[] = [],
    ) {}

    addRoom(room: Room) {
        this.rooms.push(room);
    }
}

const wikiNamespace = new Namespace(
    0,
    'Wikipedia',
    'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/103px-Wikipedia-logo-v2.svg.png',
    '/wiki',
);

wikiNamespace.addRoom(new Room(0, 'New Articles', '0'));
wikiNamespace.addRoom(new Room(1, 'Editors', '0'));
wikiNamespace.addRoom(new Room(2, 'Other', '0'));

const mozillaNamespace = new Namespace(
    1,
    'Mozilla',
    'https://www.mozilla.org/media/img/logos/firefox/logo-quantum.9c5e96634f92.png',
    '/mozilla',
);

mozillaNamespace.addRoom(new Room(0, 'Firefox', '1'));
mozillaNamespace.addRoom(new Room(1, 'SeaMonkey', '1'));
mozillaNamespace.addRoom(new Room(2, 'SpiderMonkey', '1'));
mozillaNamespace.addRoom(new Room(3, 'Rust', '1'));

const linuxNamespace = new Namespace(
    2,
    'Linux',
    'https://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png',
    '/linux',
);

linuxNamespace.addRoom(new Room(0, 'Debian', '2'));
linuxNamespace.addRoom(new Room(1, 'Red Hat', '2'));
linuxNamespace.addRoom(new Room(2, 'MacOs', '2'));
linuxNamespace.addRoom(new Room(3, 'Kernal Development', '2', true));

const namespaces = [wikiNamespace, mozillaNamespace, linuxNamespace];
export default namespaces;
