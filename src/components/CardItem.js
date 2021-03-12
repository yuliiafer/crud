import { Link } from 'react-router-dom';

function CardItem(props) {
  return (
    <>
    <div className='cards'>
      <div className='cards__container flex-container'>
      <div className='cards__wrapper'>
        <ul className='cards__items'>
        <li className='cards__item'>
          <Link className='cards__item__link' to={props.path}>
            <figure className='cards__item__pic-wrap' data-category={props.price}>
              <img
                className='cards__item__img'
                alt='{props.title}'
                src={props.image_url}
              />
            </figure>
            <div className='cards__item__info'>
              <h2 className='cards__item__text'>{props.title}</h2>
              <h3 className='cards__item__text'>{props.description}</h3>
            </div>
          </Link>
        </li>
        </ul>
      </div>
    </div>
  </div>
  </>
  );
}

export default CardItem;