import "./App.css"
import React from "react";
import ShowCurrent from "./Products/ShowCurrent";


function App() {
  //Lo ideal primero es hacer fetch de los productos
  
  //Es imporante tener en cuenta que en este casi siempre renderizaremos el primero 
  return (
    <div className="App">
      <ShowCurrent/>
    </div>
  );
}

export default App;
