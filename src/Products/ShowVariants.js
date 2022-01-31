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
      console.log(this.state.query) //returns [];
    }
  
    render() {
      console.log(this.state.query) //returns [] the first render, returns ['topic1','topic2','topic3'] on the second render;
      return(
        <ul>
          {this.state.query.map((data, key) => (
              data.type === "Color" ?
            <li key={data.id} className="list"> Color: {data.description}</li> : <></>
          ))}
        </ul>
      )
    }
  }
