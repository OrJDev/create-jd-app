import './index.css';
import { render } from 'solid-js/web';
import { Home } from './pages';
import SolidTrpc from './utils/trpc';

render(() => (
    <SolidTrpc
        opts={{ url: "http://localhost:4000/trpc" }}
    >
        <Home />
    </SolidTrpc>
), document.getElementById('root') as HTMLElement
);
