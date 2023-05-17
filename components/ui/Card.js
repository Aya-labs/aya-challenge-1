
function Card(props){
    const classes = 'card '+props.className;
    return(
        
        <div className="container" >
            <div className="main">
                {props.children}
            </div>
        </div>
    );
}
export default Card;