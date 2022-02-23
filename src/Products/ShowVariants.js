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
            for(let i=0; i<data.sizes.length; i++){
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
        <ul>
          {this.state.colors.map((data) => (
            <li key={data.id} className="list"> <button className="variant_button" onClick={() => this.Save_Option(data.id, "color")}> Color: <div className="circle" style={{ backgroundColor: data.color }}></div> </button></li>
          ))} 
        </ul>
          <ul>
          {this.state.sizes.map((dato) => {
            return <li key={dato.id} className="list">  <button className="variant_button"  onClick={() => this.getSize(dato.id, dato.size)}>Talla: {dato.size}</button></li>
          })}
        </ul>
        
        </>
      
      )
    }
  }
