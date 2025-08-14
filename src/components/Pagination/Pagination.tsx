import styles from './Pagination.module.css';

interface PaginationProps {
  total: number;
  pageSize: number;
  current: number;
  onChange: (page: number) => void; 
}

export const Pagination: React.FC<PaginationProps> = ({total, pageSize, current, onChange}) => {
    const totalPages = Math.ceil(total / pageSize);
    const pages = Array.from({length: totalPages}, (_, index) => index + 1);
    
    const handlePrevious = () => {
        if (current > 1) {
            onChange(current - 1);
        }
    };
    
    const handleNext = () => {
        if (current < totalPages) {
            onChange(current + 1);
        }
    };
    
    return (
        <div className={styles.pagination}>
            {/* Кнопка "Назад" */}
            <button 
                onClick={handlePrevious}
                disabled={current === 1}
                className={`${styles.navButton} ${current === 1 ? styles.disabled : ''}`}
                aria-label="Предыдущая страница"
            >
                ←
            </button>
            
            {/* Номера страниц */}
            {pages.map((page) => (
                <button 
                    key={page} 
                    onClick={() => onChange(page)} 
                    className={`${styles.pageNumber} ${page === current ? styles.active : ''}`}
                    aria-label={`Страница ${page}`}
                    aria-current={page === current ? 'page' : undefined}
                >
                    {page}
                </button>
            ))}
            
            {/* Кнопка "Вперед" */}
            <button 
                onClick={handleNext}
                disabled={current === totalPages}
                className={`${styles.navButton} ${current === totalPages ? styles.disabled : ''}`}
                aria-label="Следующая страница"
            >
                →
            </button>
        </div>
    );
};