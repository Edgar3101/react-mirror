import "./App.css"
import React from "react";
//import ShowCurrent from "./Products/ShowCurrent";
import ShowCurrentClass from "./Products/ShowCurrentClass";


function App() {
  //Lo ideal primero es hacer fetch de los productos
  
  //Es imporante tener en cuenta que en este casi siempre renderizaremos el primero 
  return (
    <div className="App">
      <ShowCurrentClass/>
    </div>
  );
}

export default App;
