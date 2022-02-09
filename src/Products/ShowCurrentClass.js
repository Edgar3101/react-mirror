import React from "react";
import ShowVariants from "./ShowVariants";
//import Recommended from "./Recommended";


export default class ShowCurrentClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentProduct: null,
            isLoading: true,
            index: 0,
            recommended: [],
        }

    }
    fetch_product() {
        fetch("http://localhost:8001/api/")
            .then(res => res.json())
            .then(data => {
                this.setState({ currentProduct: data.query[this.state.index] });
                this.setState({ isLoading: false });
                //Ahora una vez tengamos esto tenemos que tener en cuenta que ahora podemos obtener las variantes
            })
    }
    /*1
    changeProductLeft() {
        //setIsLoading(true);
        this.setState({ isLoading: true });
        if (this.state.index === 0) {
            fetch("http://localhost:8001/api/count/")
                .then(res => res.json())
                .then(data => {
                    this.setState({ index: data.query - 1 })
                })
        }
        else {
            this.setState({ index: this.state.index - 1 })
        }
        this.fetch_product();
    }
    changeProductRight() {
        this.setState({ isLoading: true });
        fetch("http://localhost:8001/api/count/")
            .then(res => res.json())
            .then(data => {
                if (this.state.index < data.query - 1)
                    //updateIndex(index + 1, setIndex) 
                    this.setState({ index: this.state.index + 1 })
                else
                    //updateIndex(0, setIndex)//setIndex(0);
                    this.setState({ index: 0 });
                this.fetch_product();
            })
    } */
    componentDidMount() {
        this.fetch_product();
        fetch('http://localhost:8001/api/random/').then((res) => res.json().then((data) => {
            this.setState({ recommended: data.query });
        }));
        document.addEventListener("keyup", function (e) {
            //La idea es que con esto capturemos el codigo de barras y haggamos fetch a una base de datos por ejemplo con firebase
            console.log(e.key)
        })
    }
    SelectProduct(id) {
        this.setState({ isLoading: true });
        this.setState({ index: id })
        this.fetch_product();

    }


    render() {
        console.log(this.state.currentProduct);
        return (
            <div class="container">
                <input type="text" hidden id="code-bar" />
                <div className="left_side">
                    <img className="default_image" src={this.state.isLoading === false ? "http://localhost:8001/uploads/" + this.state.currentProduct.image : ""}
                        alt={"Producto" + this.state.index} />
                </div>
                <div className="right_side">
                    <h1 class="Hello">{this.state.isLoading === false ? this.state.currentProduct.title : ""}</h1>
                    {this.state.isLoading === false ? <ShowVariants id={this.state.currentProduct.id} /> : ""}
                    <p className="text">{this.state.isLoading === false ? this.state.currentProduct.description : ""}</p>

                    <div className="zone-button">
                        {/*
                    <button className="direction-buttons" onClick={() => this.changeProductLeft()}>
                    <i class="fas fa-arrow-left fa-5x"></i>
                    </button>
                    <button className="direction-buttons" onClick={() => this.changeProductRight()}> 
                    <i class="fas fa-arrow-right fa-5x"></i>
                    </button>
                     */}
                        <button className="direction-buttons"><strong>Solicitar</strong></button>
                    </div>

                </div>
                <div className="recommended">
                    <h3 className="text">Recomendaciones</h3>
                    <ul>
                        {this.state.recommended.map((pro) => {
                            return (
                                <li onClick={() => this.SelectProduct(pro.id - 1)} key={"recommendeds" + String(pro.title)} >
                                    <img className="img_smaller" src={"http://localhost:8001/uploads/" + pro.image} alt={"image" + pro.title} />
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