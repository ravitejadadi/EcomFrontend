import { Link } from 'react-router-dom';

const ComingSoonPage = ({ title }) => {
    return (
        <div className="container-custom py-24 min-h-[50vh] flex flex-col items-center justify-center text-center animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">{title}</h1>
            <p className="text-neutral-600 mb-8 max-w-md">
                This page is coming soon. We're working on it — check back shortly.
            </p>
            <Link to="/" className="btn btn-primary uppercase">Back to Home</Link>
        </div>
    );
};

export default ComingSoonPage;
