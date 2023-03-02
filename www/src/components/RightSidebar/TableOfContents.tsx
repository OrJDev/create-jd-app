import type { MarkdownHeading } from 'astro';
import { unescape } from 'html-escaper';
import type { Component } from "solid-js";
import { createEffect, createSignal, onCleanup } from "solid-js";

type TableOfContentsProps = {
    headings: MarkdownHeading[]
}

const TableOfContents: Component<TableOfContentsProps> = ({ headings = [] }) => {
    const onThisPageID = 'on-this-page-heading';
    const [currentID, setCurrentID] = createSignal('overview');

    createEffect(() => {
        const setCurrent: IntersectionObserverCallback = (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    const { id } = entry.target;
                    if (id === onThisPageID) continue;
                    setCurrentID(entry.target.id);
                    break;
                }
            }
        };

        const observerOptions: IntersectionObserverInit = {
            // Negative top margin accounts for `scroll-margin`.
            // Negative bottom margin means heading needs to be towards top of viewport to trigger intersection.
            rootMargin: '-100px 0% -66%',
            threshold: 1,
        };

        const headingsObserver = new IntersectionObserver(setCurrent, observerOptions);

        // Observe all the headings in the main page content.
        document.querySelectorAll('article :is(h1,h2,h3)').forEach((h) => headingsObserver.observe(h));

        // Stop observing when the component is unmounted.
        onCleanup(() => {
            headingsObserver.disconnect();
        });
    });

    function onClick(e: MouseEvent) {
        const target = e.target as HTMLLinkElement;
        const href = target.getAttribute('href')
        if (!href) return;
        setCurrentID(href.replace('#', ''));
    }

    return (
        <>
            <h2 id={onThisPageID} class="heading">
                On this page
            </h2>
            <ul>
                {headings
                    .filter(({ depth }) => depth > 1 && depth < 4)
                    .map((heading) => (
                        <li
                            class={`header-link depth-${heading.depth} ${currentID() === heading.slug ? 'current-header-link' : ''
                                }`.trim()}
                        >
                            <a href={`#${heading.slug}`} onClick={onClick}>
                                {unescape(heading.text)}
                            </a>
                        </li>
                    ))}
            </ul>
        </>
    );
};

export default TableOfContents;
