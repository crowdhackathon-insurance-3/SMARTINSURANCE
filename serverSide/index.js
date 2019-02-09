let express = require("express");
let bodyparser = require("body-parser");
let path = require("path");

let sandbox = require("./sandbox.js");

let abi = require("./ethereum/ABI.json");
let blockchain = require("./ethereum/blockchain.json");

let Web3 = require("web3")


let app = new express();
app.use(bodyparser.json());


let app_id = "5c5eb1e4e4b08673622af6bc"


let client_id = "449fbd72-6ff2-4406-9663-668346c3b7ab"
let client_secret = "qX8xG3eQ7iU7yU5oW6cU4yY0hV8vG8hW8lE1sV6bR2gJ2vR7aN";


let access_token = "13586cd4aea3fd9b15d324b9b6c1d48a4b585b98c941ce4e27a3b4e9baa73e7a";
let id_token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IkYwREU5NzcwRDAxMDdFQzg0M0FGN0U0NTg2RkY0ODc5MEM1NDNCMTciLCJ0eXAiOiJKV1QiLCJ4NXQiOiI4TjZYY05BUWZzaERyMzVGaHY5SWVReFVPeGMifQ.eyJuYmYiOjE1NDk3MTA3OTUsImV4cCI6MTU0OTcxMTA5NSwiaXNzIjoiaHR0cHM6Ly9teS5uYmcuZ3IvaWRlbnRpdHkiLCJhdWQiOiI0NDlmYmQ3Mi02ZmYyLTQ0MDYtOTY2My02NjgzNDZjM2I3YWIiLCJpYXQiOjE1NDk3MTA3OTUsImF0X2hhc2giOiJ1bTJOdFpKVDI5U2txWlI1cnVSWWlnIiwic2lkIjoiMGQxNmJhMTAyNjA1YTEwYWIxNjIzOWQ3Yjk0MGMzNjgiLCJzdWIiOiIxOWY2NjlhNy1lMjU0LTQzMDItYjE4Mi1mYjE2MzQ3OTdiZWUiLCJhdXRoX3RpbWUiOjE1NDk3MTA2NDMsImlkcCI6ImxvY2FsIiwiYW1yIjpbInB3ZCJdfQ.qBivg79UqHlHTTlntNASf9Rwphb-qrQb_TY4zpaHZc7tGmE9IfIAEywsHINa8kMyl_pSzELacKoupttU-6eV2nsuz6syJC1ykpeoR_7yJa2-XO6QW2B3QeALC7lBhjgHPEq9QImzwxAKUTAi3e9X75cxsyiJLNYnELKQQtvz3AoPGuIzp7Vs5xUE6PLt1LzJeackEYpeKm3H9nRkNTCkZFMAB5enrBsLFOfbi3irQm1udhn613NGHXtoDokt_HFDVzoQjKJCqIgWYtO-ZNbTlGsJWgFVPH1hlGGc5D-gBX_Bn_aMf6HXA5n0RaY33IAO-tRz1siU6eFBcd7sFBAAkA";
let refresh_token = "27979cc0a1f02848cd35afe1804c8946c85bccdd711621d4f41465aaf704be2a";


let payments = {
    "a" : false,
    "b" : false,
    "c" : false,
    "d" : false,
}



app.use("/oauth",(req,res)=>{
    res.end("OK");
})

app.post("/pay",(req,res)=>{
    res.set({ 'content-type': 'application/json; charset=utf-8' });
    let id = req.body.payment_id;
    if (payments[id] !== undefined){
        if (payments[id]){
            console.log(`payment ${id} has already been paid`);
            res.end(`payment ${id} has already been paid`);
        }
        else{
            payments[id] = true;
            console.log(`payment ${id} has just been paid`);
            console.log("calling blockchain mediator")
            res.end(`payment ${id} has just been paid`)
        }
    }
    else{
        res.end("no such payment id : "+id)
    }
})

app.get("/sandbox",(req,res)=>{
    res.set({ 'content-type': 'application/json; charset=utf-8' });
    let box = sandbox.generate();
    sandbox.push(box,(result)=>{
        let ids = box.networks[0].spots[0].spotMachines[0].spotMachineTransactions.map((r)=>r.clearSysRef)
        res.send(result);
    });
 })


 
app.get("/transactionStatus",(req,res)=>{
    res.set({ 'content-type': 'application/json; charset=utf-8' });
    let code = req.query.payment_code
    sandbox.getPaymentStatus(code,(data)=>{
        console.log(data);
        res.end(data);
    })
 })

 app.get("/pay",(req,res)=>{
    res.set({ 'content-type': 'application/json; charset=utf-8' });
     let code = req.query.payment_code
     sandbox.pay(code,(data)=>{
         console.log(data);
         res.end(data);
     })
  })




app.get("/web3",(req,res)=>{
    console.log("web3");
    const web3 = new Web3(blockchain.endpoint);
    let contract = new web3.eth.Contract(abi, blockchain.address);
    let transfer = contract.methods

    transfer.setDate(666).send({from : blockchain.public,},(a,b,c)=>console.log(a,b,c))
    let acc = web3.eth.accounts.privateKeyToAccount(blockchain.private);
    console.log(acc);
    res.end("OK")
})








app.use("/",(req,res)=>{
    res.sendFile(path.join(__dirname + '/html/index.html'))
})



app.listen(80);