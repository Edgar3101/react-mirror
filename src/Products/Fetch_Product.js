

export default async function FetchBuy(currentProduct, local){
    var size= local.getItem("size");
    var id= local.getItem("id");
    local.removeItem('size');  
    local.removeItem("id");  
    if(size !== null && id !== null){
        var websocket = new WebSocket("ws://localhost:8002/");
        websocket.onopen = () =>{
            console.log("Connected")
            websocket.send(JSON.stringify({ 'message': {currentProduct, size, id}}))   
                
        }
        
        
    }else{
        alert('Debe seleccionar una talla primero')
    }
    

}