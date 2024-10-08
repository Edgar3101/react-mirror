import React from "react";
import Variants from "./Variants";
import MainLogo from "../logo.png"
import FetchBuy from "../Products/Fetch_Product";


export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.sethandlerProduct.bind(this);
        this.state = {
            currentProduct: null,
            show: false,
            index: 0,
            recommended: [],
            all_products: [],
            time: 0,
        }
        this.myStorage = window.localStorage;

    }
    startTimer(){
       this.timer = setInterval(() => {
           this.state.time < 1000 ? this.setState({ time : this.state.time + 1}) : this.setState({ time : 0})
       }, 1000)
    }
    resetTimer(){
        this.setState({ time: 0 })
    }

    getListOFiD(OBJ){
        var list= OBJ.map(function(id){ return id.id})
        return list.sort(function(a,b) { return a-b})
    }
    componentDidMount() {
        //this.startTimer()
        var self = this;
        var code = [];
        window.addEventListener("keypress", function (e) {
            if (e.key !== "Shift" && e.key !== "Enter") {
                code.push(e.key)
            } else if (e.key === "Enter" && code.length > 4) {
                fetch("http://localhost:8001/api/" + code.join("") + "/")
                    .then(res => res.json())
                    .then(data => {
                        if (data.error !== undefined){
                            console.log("Lo siento el producto no existe " + data.error)
                        }else{
                      
                        //Primero que todo debemos seleccionar una imagen que querramos renderizar
                        var random= Math.floor(Math.random() * data.product.colors.length)
 
                        data.product.currentColor = data.product.colors[random]

                        //Antes de hacer cualquier cambio es importante seleccionar los productos que se van a renderizar y con que imagenes
                        data.product.currentSizes= data.product.sizes.filter(obj => obj.variant_color_id === data.product.currentColor.id);
                        for(const i in data.related){
                            //La idea es que en productos relacionados seleccionemos un producto distinto
                            var counter=0;
                            do {

                                var quickrandom= Math.floor(Math.random() * data.related[i].colors.length)
                                counter = counter + 1;
                            } while((data.related[i].colors[quickrandom].id === data.product.colors[random].id) && counter < 8)
                            
                            data.related[i].currentColor= data.related[i].colors[quickrandom]
                            data.related[i].currentSizes= data.related[i].sizes.filter(obj => obj.variant_color_id === data.related[i].currentColor.id)
                        }
                             
                        //Aqui convertimos el objeto a un array
                        const final_data= Object.keys(data.related).map(key => data.related[key])
                             
                        self.setState({ all_products: final_data })
                             
                        self.resetTimer()
                             
                        self.setState({ currentProduct: data.product });}
                             
                    }).catch(err => {console.log("Lo siento el producto no existe " + err)})
                         
                    while (code.length > 0){
                        code.pop();
                    }
                       
            }
        })
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.currentProduct !== this.state.currentProduct) {           
            this.setState({ show: true });
        }
        if(this.state.time > 120 && this.state.show === true ){
            this.setState({ show: false})
        }
    }
    sethandlerProduct = (product) => {
        this.setState({ currentProduct: product })
    }

    changeProduct(ProID){
        for(const i in this.state.all_products){
            if(this.state.all_products[i].id === ProID){
                this.setState({ currentProduct: this.state.all_products[i]})
            }
        }
    }
    render() {
        const show = this.state.show;
        if (show) {
            return (
                <>
                    <div className="container">
                        <img src={MainLogo} alt="logo" className="img_logo" />
                        <div className="left_side">
                            <img className="default_image" src={"http://localhost:8001/uploads/" + this.state.currentProduct.currentColor.image}
                                alt={"Producto" + this.state.index} />
                        </div>
                        <div className="right_side">
                            <h1 className="Hello">{this.state.currentProduct.title}</h1>
                            <p className="text">{this.state.currentProduct.description.substring(0, 240)}</p>
                            
                            <Variants storage={this.myStorage} currentProduct={this.state.currentProduct} action={this.sethandlerProduct} />


                            <div className="zone-button">
                                <button className="direction-buttons" onClick={() => FetchBuy(this.currentProduct, this.myStorage)}>Solicitar</button>
                            </div>

                        </div>

                    </div>
                    <div className="recommended">
                        <h3 className="text">Productos Relacionados</h3>
                        <ul>
                            {this.state.all_products.map((pro) => {
                                return (
                                    <li key={"recommendeds" + String(pro.title)} onClick={() => this.changeProduct(pro.id)}>
                                        <img className="img_smaller" src={"http://localhost:8001/uploads/" + pro.currentColor.image} 
                                        alt={"image" + pro.title} />
                                        <p>{pro.title}</p>
                                        <p>$ {pro.price}</p>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                </>
            )

        } else {
            return <></>
        }

    }
}