import "../App.css"
import React from "react";

export default class ShowVariants extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        query: []
      }
      this.id= props.id
    }
  
    componentDidMount() {
      fetch('http://localhost:8001/api/variant/' + this.id).then((res)=>res.json().then((data)=>{
        this.setState({ query: data.query });
      }));

    }
  
    render() {
      
      return(
        <>
        <ul>
          {this.state.query.map((data, key) => (
              data.type === "Color" || data.type === "color" ?
            <li key={data.id} className="list"> Color: <div className="circle" style={{ backgroundColor:data.description }}></div></li> : <></>
          ))}
        </ul>
          <ul>
          {this.state.query.map((data, key) => {
            return (
              data.type === "Talla" || data.type === "talla" ?
            <li key={data.id} className="list">  <button className="variant_button">Talla: {data.description}</button></li> : <></>
            )
            })}
        </ul>
        </>
      )
    }
  }
