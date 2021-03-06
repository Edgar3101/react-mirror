import React from "react";
import ShowVariants from "./ShowVariants";
import FetchBuy from "./Fetch_Product";
import MainLogo from "../logo.png"


export default class ShowCurrentClass extends React.Component {
    constructor(props) {
        super(props);
        this.sethandlerColor.bind(this);
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
        this.myStorage = window.localStorage;
    }
    fetch_product(b = null) {
        this.myStorage.clear()
        fetch("http://localhost:8001/api/")
            .then(res => res.json())
            .then(data => {
                //La mejor opcion que tensmos es mandar un diccionario que pueda funcionar mas o menos igual
                var data_val = {};
                var products = data.product;
                var colors = data.color;
                var sizes = data.variant_Size;
                var productCategories = data.productCategorie;
                //var category = data.categories;
                var counter = 0;
                products.map(function (obj) {
                    data_val[counter] = {
                        "id": obj.id, "title": obj.title, "description": obj.description, "price": obj.price,
                        "colors": colors.filter(color => color.productId === obj.id), 'sizes': null,
                        "categorie_id": productCategories.find(element => element.productId === obj.id).categoryId
                    }
                    var list_of_id = data_val[counter]['colors'].map(function (el) { return el.id });
                    data_val[counter]['sizes'] = sizes.filter(size => list_of_id.includes(size.variant_color_id))

                    counter = counter + 1;
                })
                //Vamos a tener todos los productos Guardados en un estado
                this.setState({ all_products: data_val })
                console.log(data_val)
                this.setState({ currentProduct: data_val[this.state.index]});
                b === null ? this.setState({ index_of_colors: Math.floor(Math.random() * this.state.currentProduct.colors.length) }) : this.setState({ index_of_colors: b });
                this.setState({ isLoading: false });

                //Ahora una vez tengamos esto tenemos que tener en cuenta que ahora podemos obtener las variantes
            })
        return true
    }

    diferenceTime(arr) {
        var value;
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] - arr[i - 1] > 4000) {
                value = false;
                break;
            }
            if (arr.length - 1 === i) {
                value = true;
            }
        }
        return value;
    }
    componentDidUpdate(prevProps, prevState){
        if (this.state.currentProduct !== null && this.state.currentProduct !== prevState.currentProduct) {
            fetch('http://localhost:8001/api/random/' + this.state.currentProduct.categorie_id).then((res) => res.json().then((data) => {
                const new_map = Object.entries(data.query).map(([k, v]) => {
                    for (let i = 0; i < data.colors.length; i++) {
                        if (v.id === data.colors[i].productId) {
                            data.query[k].image = data.colors[i].image;
                            data.query[k].index_of_image = data.colors[i].id;
                            //Tenemos un problema y es que debemos hacer un map para conseguir el index en allproducts
                            return data.query[k];
                        }
                    }
                })
                this.setState({ recommended: new_map });
            }));
        }

    }
    componentDidMount() {
        this.fetch_product();
        //Hay que modificar esta parte con la data que disponemos
        var code = [];
        var times = [];
        var self = this;
        window.addEventListener("keypress", function (e) {
            var enter;
            if (e.key !== "Shift") {
                if (e.key !== "Enter") {
                    code.push(e.key)
                }
                times.push(new Date().getTime())
            }
            if (e.key === "Enter") {
                enter = true
            }
            //La idea es que con esto capturemos el codigo de barras y haggamos fetch a una base de datos por ejemplo con firebase
            if (code.length > 6 && self.diferenceTime(times) === true && enter === true) {
                fetch("http://localhost:8001/api/code/" + code.join('') + "/")
                    .then(res => res.json())
                    .then(data => {
                        if (data.error === undefined) {
                            self.SelectProduct(data.product.id, data.color.id)
                            self.myStorage.clear()

                        }
                    })
                while (code.length > 0)
                    code.pop();
                while (times.length > 0)
                    times.pop();
            }
        })
    }
    promiseLoop = async (id, id_of_color) => new Promise((resolve) => {
        var self= this;
        self.setState({ isLoading: true });
        for (const i in self.state.all_products) {
            if (self.state.all_products[i].id === id) {
                self.setState({ index: i })
                break
            }
        }
        for (const k in self.state.all_products) {
            for (const j in self.state.all_products[k].colors) {
                if (self.state.all_products[k].colors[j].id === id_of_color) {
                    self.fetch_product(j)
                    break;
                }
            }
        }
        self.myStorage.clear();
        resolve("Works");
    })

    async SelectProduct(id, id_of_color) {
        this.promiseLoop(id, id_of_color).then((message) => console.log(message))
    }

    sethandlerColor = (new_index) => {
        let idx;
        for (let i = 0; i < this.state.currentProduct.colors.length; i++) {
            if (this.state.currentProduct.colors[i].id === new_index) {
                idx = i
            }
        }
        this.setState({ index_of_colors: idx })
    }

    render() {

        return (
            <>
            <div className="container">
                <input type="text" hidden id="code-bar" />
                <img src={MainLogo} alt="logo" className="img_logo"/>
                <div className="left_side">
                    <img className="default_image" src={this.state.isLoading === false ? "http://localhost:8001/uploads/" + this.state.currentProduct.colors[this.state.index_of_colors].image : ""}
                        alt={"Producto" + this.state.index} />
                </div>
                <div className="right_side">
                    <h1 className="Hello">{this.state.isLoading === false ? this.state.currentProduct.title : ""}</h1>
                    <p className="text">{this.state.isLoading === false ? this.state.currentProduct.description.substring(0, 240) : ""}</p>
                    {this.state.isLoading === false ? <ShowVariants id={this.state.currentProduct.id} storage={this.myStorage} action={this.sethandlerColor} /> : ""}
                   

                    <div className="zone-button">
                        <button className="direction-buttons" onClick={() => FetchBuy(this.state.currentProduct, this.myStorage)}>Solicitar</button>
                    </div>

                </div>
               
            </div>
            <div className="recommended">
                    <h3 className="text">Productos Relacionados</h3>
                    <ul>
                        {this.state.recommended.map((pro) => {
                            return (
                                <li onClick={() => this.SelectProduct(pro.id, pro.index_of_image)} key={"recommendeds" + String(pro.title)} >
                                    <img className="img_smaller" src={"http://localhost:8001/uploads/" + pro.image} alt={"image" + pro.title} />
                                    <p>{pro.title} ${pro.price}</p>
                                </li>
                            )
                        })}
                    </ul>
                </div>

            </>
        )
    }
}