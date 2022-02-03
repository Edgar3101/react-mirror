import "../App.css"
import React from "react";


export default class Recommended extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: []
        }
    }
    componentDidMount() {
        fetch('http://localhost:8001/api/random/').then((res) => res.json().then((data) => {
            this.setState({ query: data.query });
        }));
        console.log(this.state.query)
    }


    render() {
        console.log(this.state.query)
        return (
            <>
                <h3 className="text">Recomendaciones</h3>
                <ul>
                    {this.state.query.map((pro) => {
                        return (
                            <li key={"recommendeds" + String(pro.title)} >
                                <img className="img_smaller" src={"http://localhost:8001/uploads/" + pro.image} alt={"image" + pro.title} />
                                <p>{pro.title} ${pro.price}</p>
                            </li>
                        )

                    })}
                </ul>

            </>
        )
    }
}
