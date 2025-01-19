export const TWITTER_BUTTONS: TwitterButton[] = [
    { id: "home", label: "Home", ariaLabel: "Home" },
    { id: "explore", label: "Explore", ariaLabel: "Search and explore" },
    { id: "notifications", label: "Notifications", ariaLabel: "Notifications" },
    { id: "messages", label: "Messages", ariaLabel: "Direct Messages" },
    { id: "jobs", label: "Jobs", ariaLabel: "Jobs" },
    { id: "grok", label: "Grok", ariaLabel: "Grok" },
    { id: "lists", label: "Lists", ariaLabel: "Lists" },
    { id: "bookmarks", label: "Bookmarks", ariaLabel: "Bookmarks" },
    { id: "communities", label: "Communities", ariaLabel: "Communities" },
    { id: "premium", label: "Premium", ariaLabel: "Premium" },
    { id: "verified", label: "Verified Orgs", ariaLabel: "Verified Orgs" },
    { id: "profile", label: "Profile", ariaLabel: "Profile" },
    {
        id: "more",
        label: "More",
        ariaLabel: "More menu items",
        selector: 'button[aria-label="More menu items"]',
    },
];

export const RIGHT_SIDEBAR_ELEMENTS: RightSidebarElement[] = [
    { id: "entire-sidebar", label: "Entire Right Sidebar", category: "Sidebar" },
    { id: "premium-subscribe", label: "Premium Subscribe Section", category: "Premium" },
    { id: "search", label: "Search Box", category: "Search" },
    { id: "trending", label: "Trending Section", category: "What's happening" },
    { id: "who-to-follow", label: "Who to Follow Section", category: "Suggestions" },
];
