const CardImage = (props) => {
  return (
    <img style={{ width: '183px' }} src={`https://image.tmdb.org/t/p/w500${props.posterPath}`} />
  )
}

export default CardImage
