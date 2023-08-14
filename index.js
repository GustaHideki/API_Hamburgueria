const express = require("express")
const uuid = require("uuid")
const app = express()
const port = 3000
app.use(express.json())




const orders = []

const checkRequest = (request, response, next)=>{
    const method = request.method
    const url = request.url
    console.log(`${method} & ${url}`)
    next()
}

const checkOrderId = (request, response, next) => {
    const { id } = request.params
    const index = orders.findIndex(Element => Element.id === id)
    if (index < 0) {
        return response.status(404).json({ error: "Order Not Found" })
    }
    request.userId = id
    request.userIndex = index
    next()
}
app.get('/order',checkRequest, (request, response) => {
    return response.json(orders)
})

app.post('/order',checkRequest, (request, response) => {
    const { order, clientName, price } = request.body
    const newOrder = { id: uuid.v4(), order, clientName, price, status: "Em Preparação" }
    orders.push(newOrder)
    return response.status(201).json(newOrder)
})

app.put('/order/:id', checkOrderId,checkRequest, (request, response) => {
    const id = request.userId
    const index = request.userIndex
    const { order, clientName, price } = request.body
    const updateOrder = { id, order, clientName, price, status: "Em Preparação" }
    orders[index] = updateOrder
    return response.status(201).json(updateOrder)
})

app.delete('/order/:id', checkOrderId,checkRequest, (request, response) => {
    const { id } = request.userId
    const index = request.userIndex
    orders.splice(index, 1)
    return response.status(204).json()

})

app.get('/order/:id', checkOrderId,checkRequest, (request, response) => {
    const { id } = request.userId
    const index = request.userIndex
    const specificOrder = orders[index]
    return response.status(200).json(specificOrder)

})

app.patch('/order/:id', checkOrderId,checkRequest, (request, response) => {
    const { id } = request.userId
    const index = request.userIndex
    orders[index].status = "Pedido Pronto"
    return response.status(200).json(orders[index])
})


app.listen(port, () => {
    console.log(`🚀Server Started on Port ${port}🚀`)
})