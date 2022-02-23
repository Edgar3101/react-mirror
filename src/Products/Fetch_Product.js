

export default async function FetchBuy(ws, currentProduct, local){
    var size= local.getItem("size");
    var id= local.getItem("id");
    if(size !== null && id !== null){
        ws.onopen = () =>{
            ws.send(currentProduct, size, id)
            console.log("connected")
        }
        
    }else{
        alert('Debe seleccionar una talla primero')
    }
    

}