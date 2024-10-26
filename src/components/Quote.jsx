const Quote = ( {author, quote} ) =>{
    return (
        <div className="Quote">
            <h1>"{quote}"</h1>
            <p>{author}</p>
        </div>
    )
};


export default Quote;   