import "../App.css"
import React from "react";


export default class Variants extends React.Component{

    constructor(props){
      super(props);

      this.state = {
          show: false,
      }
      this.currentProduct= this.props.currentProduct;   
      this.mystorage= this.props.storage;   
    }
   
    componentDidUpdate(prevProps, prevState){
      if(prevProps.currentProduct !== this.currentProduct){
        this.currentProduct = this.props.currentProduct;
        this.forceUpdate()
      }
    }

    changeColors(data){
     this.currentProduct.currentColor= data;
     this.currentProduct.currentSizes= this.currentProduct.sizes.filter(obj => obj.variant_color_id === this.currentProduct.currentColor.id)
     this.props.action(this.currentProduct) 
   }
   getSize(size, sizeId){
    this.mystorage.clear();
    this.mystorage.setItem("size", size)
    this.mystorage.setItem("id", sizeId)

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
                  {this.currentProduct.currentSizes.map((dato) => {
                    return <li key={dato.id} className="list">  <button className="variant_button_size" onClick={() => this.getSize(dato.size, dato.id)}>{dato.size}</button></li>
                  })}
                </ul>
                </>
              )     
    }
  }
