import Image from 'next/image';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.grid}>
        <div className={styles.card}>
          <img
            src='https://rich-cdn.xy-design.top/dsm/ddns-updater.png'
            alt=''
            className={styles.cover}
          />
          <strong>1112</strong>
          <div className={styles['card-btn']}>
            <a>外网地址</a>
            <a>内网地址</a>
          </div>
        </div>
      </div>
    </main>
  );
}
