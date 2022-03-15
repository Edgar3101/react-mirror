import "../App.css"
import React from "react";


export default class Variants extends React.Component{

    constructor(props){
      super(props);

      this.state = {
          show: false,
      }
      this.currentProduct= this.props.currentProduct;      
    }
   
    componentDidUpdate(prevProps, prevState){
      if(prevProps.currentProduct !== this.currentProduct){
        this.currentProduct = this.props.currentProduct;
        this.forceUpdate()
      }
    }

    changeColors(data){
     this.currentProduct.currentColor= data;
     this.props.action(this.currentProduct) 
   }
    render() {
            return(
                <>
                <h3 className="variant_color_title">Color: </h3>
                <ul>
                  {this.currentProduct.colors.map((data) => (
                    <li key={data.id} className="list"> <button style={{ backgroundColor: data.color }} className="circle" onClick={() => this.changeColors(data)}></button></li>
                  ))} 
                </ul>
                <h3 className="variant_size_title">Tallas: </h3>
                  <ul>
                  {this.currentProduct.sizes.map((dato) => {
                    return <li key={dato.id} className="list">  <button className="variant_button_size" >{dato.size}</button></li>
                  })}
                </ul>
                </>
              )     
    }
  }
