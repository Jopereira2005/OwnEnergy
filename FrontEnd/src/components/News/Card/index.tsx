import styled from './style.module.scss';

interface NewsCardProps {
  title: string;
  subtitle: string;
  author: string;
  news_org: string;
  date: string;
  imageUrl: string;
  imageCaption: string;
  body: string;
  onClick: () => void;
}

const NewsCard = ({ title, subtitle, author, news_org, date, imageUrl, imageCaption, body, onClick }: NewsCardProps) => {
  return (
    <div className={styled.newsCard}>
      <h1 className={styled.newsCard__title}>{title}</h1>
      <p className={styled.newsCard__subtitle}>{subtitle}</p>
      <p className={styled.newsCard__meta}>
        {author}, {news_org}<br/><span className={styled.newsCard__date}>{date}</span>
      </p>
      <img src={imageUrl} alt="Imagem da notícia" className={styled.newsCard__image} />
      <p className={styled.newsCard__caption}>{imageCaption}</p>
      <p className={styled.newsCard__body}>{body}</p>
      <button className={styled.newsCard__button} onClick={onClick}>Ler Mais</button>
    </div>
  );
};

export default NewsCard;
