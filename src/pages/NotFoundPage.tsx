import { Link } from 'react-router-dom';

export function NotFoundPage() {
    return (
        <div>
            <p style={{ textAlign: "center" }}>
                Ops, caminho errado volte para a <Link to="/">página inicial</Link>
            </p>
        </div>
    )
}