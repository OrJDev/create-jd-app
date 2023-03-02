export const SITE = {
    title: 'Create JD',
    description: 'Your website description.',
    defaultLanguage: 'en-us',
} as const;

export const OPEN_GRAPH = {
    image: {
        src: 'https://github.com/withastro/astro/blob/main/assets/social/banner-minimal.png?raw=true',
        alt:
            'astro logo on a starry expanse of space,' +
            ' with a purple saturn-like planet floating in the right foreground',
    },
    twitter: 'astrodotbuild',
};

export const KNOWN_LANGUAGES = {
    English: 'en',
} as const;
export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES);

export const GITHUB_EDIT_URL = `https://github.com/withastro/astro/tree/main/examples/docs`;

export const COMMUNITY_INVITE_URL = `https://astro.build/chat`;

// See "Algolia" section of the README for more information.
export const ALGOLIA = {
    indexName: 'XXXXXXXXXX',
    appId: 'XXXXXXXXXX',
    apiKey: 'XXXXXXXXXX',
};

export type Sidebar = Record<
    (typeof KNOWN_LANGUAGE_CODES)[number],
    Record<string, { text: string; link: string }[]>
>;
export const SIDEBAR: Sidebar = {
    en: {
        'Create JD App': [
            { text: 'Introduction', link: 'en/introduction' },
        ],
        'PRPC': [
            { text: 'Getting Started', link: 'en/prpc-get-started' },
            { text: 'Install', link: 'en/install' },
            { text: 'Usage', link: 'en/usage' },
            { text: 'query$', link: 'en/query' },
            { text: 'mutation$', link: 'en/query' },
            { text: 'QueryProvider', link: 'en/query-provider' },
            { text: 'Examples', link: 'en/examples' },
            { text: 'Contributors', link: 'en/contributors' },
            { text: 'Sponsors', link: 'en/sponsors' },
        ],
    },
};
