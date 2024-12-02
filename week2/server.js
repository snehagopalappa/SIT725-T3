var express = require("express")
var app = express()
app.use(express.static(__dirname+'/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
var port = process.env.port || 3000;


const addTwoNumber= (n1,n2) => n1+n2;
const subtract = (n1, n2) => n1 - n2;
const multiply = (n1, n2) => n1 * n2;
const divide = (n1, n2) => (n2 !== 0 ? n1 / n2 : "Division by zero error");


//GET Endpoint
app.get("/addTwoNumber", (req,res)=>{
    const n1= parseInt(req.query.n1);
    const n2=parseInt(req.query.n2);
    const result = addTwoNumber(n1,n2);
    res.json({statuscocde:200, data: result }); 
});


// GET Endpoint for Basic Calculator
app.get("/calculate", (req, res) => {
    const n1 = parseFloat(req.query.n1); // First number
    const n2 = parseFloat(req.query.n2); // Second number
    const operation = req.query.operation; // Operation type

    // Validate numbers
    if (isNaN(n1) || isNaN(n2)) {
        return res.json({ statusCode: 400, error: "Invalid numbers" });
    }

    let result;
    switch (operation) {
        case "subtract":
            result = subtract(n1, n2);
            break;
        case "multiply":
            result = multiply(n1, n2);
            break;
        case "divide":
            result = divide(n1, n2);
            break;
        default:
            return res.json({ statusCode: 400, error: "Invalid operation" });
    }

    res.json({ statusCode: 200, operation: operation, result: result });
});


app.listen(port,()=>{
console.log("App listening to: "+port)
})