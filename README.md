### Url Endpoint to heroku 
https://seaber-task.herokuapp.com

### Integrated code endpoint
https://seaber-task.herokuapp.com/integrate

This endpoint receives json data
{
  "extOrderId": "bda73cd4-30a0-40e5-bd0b-2bc3c907be47",
  "type": "cargo", 
  "cargoType": "Pasta",
  "cargoAmount": 100
}

### Seaber API endpoints
https://seaber-task.herokuapp.com/integrate/create

This endpoint receives sanitized data from the database and creates a order with it

https://seaber-task.herokuapp.com/seaber/orders
 here you can have a view of orders on the seaber API database