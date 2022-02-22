import React from "react";
import ShowVariants from "./ShowVariants";



export default class ShowCurrentClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentProduct: null,
            isLoading: true,
            index: 0,
            recommended: [],
            recommended_colors: [],
            code: [], //Este es el tiempo original de aqui tendremos el tiempo de referencia
            all_products: {},
            index_of_colors: 0
        }

    }
    fetch_product() {
        fetch("http://localhost:8001/api/")
            .then(res => res.json())
            .then(data => {
                //La mejor opcion que tensmos es mandar un diccionario que pueda funcionar mas o menos igual
                var data_val= {};
                var products= data.product;
                var colors = data.color;
                var sizes= data.variant_Size
                var counter = 0;
                products.map(function(obj){
                    data_val[counter]= {"id" : obj.id, "title": obj.title, "description": obj.description, "price": obj.price, 
                        "colors": colors.filter(color => color.productId === obj.id), 'sizes': null}
                    var list_of_id= data_val[counter]['colors'].map(function(el){ return el.id});
                    data_val[counter]['sizes']= sizes.filter(size => list_of_id.includes(size.variant_color_id))  
                    counter = counter + 1;
                })
                //Vamos a tener todos los productos Guardados en un estado
                this.setState({ all_products: data_val })
                console.log(data_val)
                this.setState({ currentProduct: data_val[this.state.index] });
                this.setState({ index_of_colors: Math.floor(Math.random() * this.state.currentProduct.colors.length)});
                this.setState({ isLoading: false });
                //Ahora una vez tengamos esto tenemos que tener en cuenta que ahora podemos obtener las variantes
            })
    }

    diferenceTime(arr) {
        var value;
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] - arr[i - 1] > 2000) {
                value = false;
                break;
            }
            if (arr.length - 1 === i) {
                value = true;
            }
        }
        return value;
    }
    componentDidMount() {
        this.fetch_product();
        //Hay que modificar esta parte con la data que disponemos
        fetch('http://localhost:8001/api/random/').then((res) => res.json().then((data) => {
             const new_map= Object.entries(data.query).map(([k,v]) => {
                for(let i=0; i<data.colors.length; i++){
                    if(v.id === data.colors[i].productId){
                        data.query[k].image= data.colors[i].image;
                        return data.query[k];
                    }
                }
             })
            this.setState({ recommended: new_map });
            
        }));
        var code = [];
        var times = [];
        var self = this;
        window.addEventListener("keypress", function (e) {
            if (e.key !== "Shift") {
                code.push(e.key)
                times.push(new Date().getTime())
            }
            //La idea es que con esto capturemos el codigo de barras y haggamos fetch a una base de datos por ejemplo con firebase
            if (code.length > 6 && self.diferenceTime(times) === true) {
                fetch("http://localhost:8001/api/code/" + code.join('') + "/")
                    .then(res => res.json())
                    .then(data => {
                        if (data.error === undefined) {
                            self.setState({ index: data.product.id - 1 }); self.fetch_product();
                  
                        }
                    })
                while (code.length > 0)
                    code.pop();
                while (times.length > 0)
                    times.pop();
            }
        })
    }

    SelectProduct(id) {
        this.setState({ isLoading: true });
        this.setState({ index: id })
        this.fetch_product();

    }
    render() {

        return (
            <div className="container">
                <input type="text" hidden id="code-bar" />
                <div className="left_side">
                    <img className="default_image" src={this.state.isLoading === false ? "http://localhost:8001/uploads/" + this.state.currentProduct.colors[this.state.index_of_colors].image : ""}
                        alt={"Producto" + this.state.index} />
                </div>
                <div className="right_side">
                    <h1 class="Hello">{this.state.isLoading === false ? this.state.currentProduct.title : ""}</h1>
                    {this.state.isLoading === false ? <ShowVariants id={this.state.currentProduct.id} /> : ""}
                    <p className="text">{this.state.isLoading === false ? this.state.currentProduct.description : ""}</p>

                    <div className="zone-button">
                        <button className="direction-buttons"><strong>Solicitar</strong></button>
                    </div>

                </div>
                <div className="recommended">
                    <h3 className="text">Recomendaciones</h3>
                    <ul>
                        {this.state.recommended.map((pro) => {
                            return (
                                <li onClick={() => this.SelectProduct(pro.id - 1)} key={"recommendeds" + String(pro.title)} >
                                    <img className="img_smaller" src={"http://localhost:8001/uploads/" +  pro.image} alt={"image" + pro.title} />
                                    <p>{pro.title} ${pro.price}</p>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>

        )
    }
}