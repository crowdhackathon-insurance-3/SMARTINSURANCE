
let abi = require("./ethereum/ABI.json");
let blockchain = require("./ethereum/blockchain.json");

let Web3 = require("web3")
const Tx = require('ethereumjs-tx')

let sandbox = require("./sandbox.js");

function setDate(value,cb){
    const web3 = new Web3(blockchain.endpoint);  
    var contract = new web3.eth.Contract(abi,blockchain.address);
    var func = contract.methods.setDate(value);
    set(func,cb);
}

function paidContract(value,cb){
    const web3 = new Web3(blockchain.endpoint);  
    var contract = new web3.eth.Contract(abi,blockchain.address);
    var func = contract.methods.paidContract(value);
    set(func,cb);
}

function getDate(cb){
    const web3 = new Web3(blockchain.endpoint);  
    var contract = new web3.eth.Contract(abi,blockchain.address);
    var func = contract.methods.getDate();
    get(func,cb);
}


function get(func,cb){
    func.call({from : blockchain.public,gasPrice : 0,gasLimit : 30000000000},(a,b,c)=>{
        if(cb)cb(b)
    });

}


function set(func,cb){
    const web3 = new Web3(blockchain.endpoint);    
    
    let eabi = func.encodeABI();


    let acc = web3.eth.accounts.privateKeyToAccount("0x"+blockchain.private);


    func.estimateGas({from: blockchain.public}).then((gasAmount) => {
        estimatedGas = gasAmount.toString(16);

        console.log("Estimated gas: " + estimatedGas);

        web3.eth.getTransactionCount(blockchain.public).then(_nonce => {
            nonce = _nonce.toString(16);

            console.log("Nonce: " + nonce);
            const txParams = {
                gasPrice: 0,
                gasLimit: 300000,
                to: blockchain.address,
                data: eabi,
                from: blockchain.public,
                nonce: '0x' + nonce
            };

            const privateKey = Buffer.from(blockchain.private, 'hex');

            const tx = new Tx(txParams);
            tx.sign(privateKey); // Transaction Signing here

            const serializedTx = tx.serialize();

            web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', receipt => {
                if (cb)cb(receipt);
            })
        });
    });
}
    
function getUnpaid(cb){
    const web3 = new Web3(blockchain.endpoint);  
    var contract = new web3.eth.Contract(abi,blockchain.address);
    var func = contract.methods.getUnpaidContracts();
    get(func,cb);
}


function getPaymentCode(id,cb){
    const web3 = new Web3(blockchain.endpoint);  
    var contract = new web3.eth.Contract(abi,blockchain.address);
    var func = contract.methods.getPaymentCode(id);
    get(func,cb);
}
function getContractDetail(id,cb){
    const web3 = new Web3(blockchain.endpoint);  
    var contract = new web3.eth.Contract(abi,blockchain.address);
    var func = contract.methods.getContractDetail(id);
    get(func,cb);
}

function handleUnpaid(){
    console.log("getting");
    getUnpaid(res=>{
        res.map(item=>{
            console.log(item);
            getPaymentCode(item,code=>{
                console.log(code);
                sandbox.getPaymentStatus(code,(data)=>{
                    data = JSON.parse(data).payload;
                    if (data.status){
                        if (data.status == "COMPLETED"){
                            console.log("Bill has been paid, proceeding with contract completion")
                            paidContract(item,result=>{
                                console.log(result);
                            })
                        }
                    }
                })
            })
        })
    })
}

function start(){
    let s = setInterval(handleUnpaid,10000)
}

module.exports = {
    start : start,
    getDate : getDate,
    setDate : setDate,
    getUnpaidContracts : getUnpaid,
    getContractDetails : getPaymentCode,
}