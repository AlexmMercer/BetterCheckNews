import styles from './NewsBanner.module.css'

export interface NewsBannerProps {
    title: string
    url?: string
    urlToImage?: string | null
}

export const NewsBanner = ({ title, url, urlToImage }: NewsBannerProps) => {
    const hasImage = Boolean(urlToImage && urlToImage.trim().length > 0)

    const body = (
        <>
            {hasImage && (
                <div className={styles.imageContainer}>
                    <img
                        src={urlToImage as string}
                        alt={title}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className={styles.image}
                        onError={(e) => {
                            e.currentTarget.style.display = 'none'
                        }}
                    />
                </div>
            )}
            <div className={styles.content}>
                <h1 className={styles.title}>{title}</h1>
                <div className={styles.meta}>Breaking News</div>
            </div>
        </>
    )

    return (
        <div className={styles.banner}>
            {url ? (
                <a href={url} target="_blank" rel="noopener noreferrer" aria-label={title}>
                    {body}
                </a>
            ) : (
                body
            )}
        </div>
    )
}
