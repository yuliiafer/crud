const Item = (props) => {
  const { title, description, image_url, price } = props;
  return (
    /*
      <div className="product-container" style={{ width: '100%', maxWidth: '700px', margin: ' 0 auto', paddingBottom: '1rem'}}>
        <h2>{title}</h2>
        <img src={image_url} alt={title} style={{ width: '100%' }} />
        <h3>{price},-</h3>
        <p>Description: {description}</p>
      </div>*/

    <>
      <div className="cards">
        <div className="cards__container">
          <div className="cards__wrapper">
            <li className="cards__item">
              <figure className="cards__item__pic-wrap" data-category={price}>
                <img className="cards__item__img" alt={title} src={image_url} />
              </figure>
              <div className="cards__item__info">
                <h2 className="cards__item__text">{title}</h2>
                <h3 className="cards__item__text">{description}</h3>
              </div>
            </li>
          </div>
        </div>
      </div>
    </>
  );
};

export default Item;
