import "../App.css"
import React, { useState, useEffect } from "react";
import ShowVariants from "./ShowVariants";
import Recommended from "./Recommended";
//Este modulo cumple la funcion de renderizar el producto actual se le debe pasar
//un parametro Index

export default function ShowCurrent() {
    const [currentProduct, setCurrentProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [index, setIndex] = useState(0)
    const fetch_product = () => {

        fetch("http://localhost:8001/api/")
            .then(res => res.json())
            .then(data => {
                setCurrentProduct(data.query[index])
                setIsLoading(false)
                //Ahora una vez tengamos esto tenemos que tener en cuenta que ahora podemos obtener las variantes

            })
    }
    const changeProductLeft = () => {
        setIsLoading(true);
        if (index === 0) {
            fetch("http://localhost:8001/api/count/")
                .then(res => res.json())
                .then(data => {
                    setIndex(data.query - 1)
                })
        }
        else {
            setIndex(index - 1);
        }
        fetch_product();

    }
    const changeProductRight = () => {
        setIsLoading(true);
        fetch("http://localhost:8001/api/count/")
            .then(res => res.json())
            .then(data => {
                if (index < data.query - 1)
                    setIndex(index + 1)
                else
                    setIndex(0);
                fetch_product();
                

            })

    }
    useEffect(() => {
        fetch_product();
    }, [])
    return (
        <div class="container">
            <div className="left_side">
                <img className="default_image" src={isLoading === false ? "http://localhost:8001/uploads/" + currentProduct.image : "Cargando...."}
                    alt={"Producto" + index} />
            </div>
            <div className="right_side">
                <h1 class="Hello">{isLoading === false ? currentProduct.title : "Cargando..."}</h1>
                {isLoading === false ? <ShowVariants id={currentProduct.id} /> : "Cargando..."}
                <p className="text">{isLoading === false ? currentProduct.description : "Cargando..."}</p>
                <div className="zone-button">
                    <button className="direction-buttons" onClick={() => changeProductLeft()}>
                    <i class="fas fa-arrow-left fa-5x"></i>
                    </button>
                    <button className="direction-buttons" onClick={() => changeProductRight()}> 
                    <i class="fas fa-arrow-right fa-5x"></i>
                    </button>
                </div>
            </div>
            <div className="recommended">
                <Recommended/>
            </div>
        </div>
    )
}
