const Item = props => {
    const { title, description, image_url, price } = props;
    return (
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <h2>{title}</h2>
        <img src={image_url} alt={title} style={{ width: '100%' }} />
        <h3>{price}</h3>
        <p>{description}</p>
      </div>
    );
  };
  
  export default Item;