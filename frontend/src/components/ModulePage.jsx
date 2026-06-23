import PageHeader from './PageHeader';

function ModulePage({
                        title,
                        description,
                        children,
                    }) {
    return (
        <>
            <PageHeader
                title={title}
                description={description}
            />

            <section className="content-card">
                {children || (
                    <div className="empty-state">
                        Este módulo está preparado para conectarse con el backend.
                    </div>
                )}
            </section>
        </>
    );
}

export default ModulePage;