import { formatDate } from "../../helpers/formatDate"
import styles from "./Header.module.css"

interface HeaderProps {
  title: string
  currentDate?: Date
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className={styles.header}>
      <div className={styles.titleContainer}>
        <img 
          src="/site-pic.png" 
          alt="Service Avatar" 
          className={styles.avatar}
        />
        <div className={styles.leftWords}>
          <div>BETTER</div>
          <div className={styles.bottomRow}>
            <div className={styles.checkWord}>CHECK</div>
            <div className={styles.rightWord}>NEWS</div>
          </div>
        </div>
      </div>
      <p className={styles.datetime_text}>{formatDate(new Date())}</p>
    </header>
  )
}