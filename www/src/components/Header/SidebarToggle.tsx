import { Component, createSignal } from "solid-js";

const MenuToggle: Component = () => {
    const [sidebarShown, setSidebarShown] = createSignal(false);

    function onClick() {
        setSidebarShown(!sidebarShown());
        // NOTE: You see that sneaky assertion operator there? That's because cringe. I'm sorry.
        const body = document.querySelector('body')!;

        if (sidebarShown()) {
            body.classList.add('mobile-sidebar-toggle');
        } else {
            body.classList.remove('mobile-sidebar-toggle');
        }
    }

    return (
        <button
            type="button"
            aria-pressed={sidebarShown() ? 'true' : 'false'}
            id="menu-toggle"
            onClick={onClick}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                />
            </svg>
            <span class="sr-only">Toggle sidebar</span>
        </button>
    );
};

export default MenuToggle;
