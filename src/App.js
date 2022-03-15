import "./App.css"
import React from "react";
//import ShowCurrentClass from "./Products/ShowCurrentClass";
import Main from "./Refactor/Main";


function App() {
  //Lo ideal primero es hacer fetch de los productos
  
  //Es imporante tener en cuenta que en este casi siempre renderizaremos el primero 
  return (
    <div className="App">
      <Main/>
    </div>
  );
}

export default App;
