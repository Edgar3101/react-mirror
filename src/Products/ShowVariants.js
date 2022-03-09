import "../App.css"
import React from "react";


export default class ShowVariants extends React.Component{

    constructor(props){
      super(props);
      this.state = {
        colors: [],
        sizes: [],
      }
      this.id= this.props.id;
      this.myStorage = this.props.storage
      
    }
   
    componentDidMount() {
      fetch('http://localhost:8001/api/variants/').then((res)=>res.json().then((data)=>{
        //Debemos hacer lo mismo acomodar todo para que renderice los datos de la misma manera
        const list_of_colors= data.colors.filter(obj => obj.productId === this.id)
        
        this.setState({ colors: list_of_colors})

        const new_map= Object.entries(list_of_colors).map(([k, v]) => {
            for(const i in data.sizes){
              if(data.sizes[i].variant_color_id === v.id){
                return data.sizes[i]
              }
            }
        })
        this.setState({ sizes: new_map});
      }));

    }
    Save_Option = (data, param) =>{
      if(param === "color"){
        this.props.action(data)
      }
    }

    getSize(size, sizeId){
      this.myStorage.clear();
      this.myStorage.setItem("size", size)
      this.myStorage.setItem("id", sizeId)

    }
    render() {
      
      return(
        <>
        <h3 className="variant_color_title">Color: </h3>
        <ul>
          {this.state.colors.map((data) => (
            <li key={data.id} className="list"> <button style={{ backgroundColor: data.color }} className="circle" onClick={() => this.Save_Option(data.id, "color")}></button></li>
          ))} 
        </ul>
        <h3 className="variant_size_title">Tallas: </h3>
          <ul>
          {this.state.sizes.map((dato) => {
            return <li key={dato.id} className="list">  <button className="variant_button_size"  onClick={() => this.getSize(dato.id, dato.size)}>{dato.size}</button></li>
          })}
        </ul>
        
        </>
      
      )
    }
  }
