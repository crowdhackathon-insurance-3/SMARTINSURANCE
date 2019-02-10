/* eslint-disable */
const contractAddress = '0x561415ce8c54db68168816d9a8f1e50cc255c1a4'
const ABI = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_insuranceCompanyAddress",
				"type": "address"
			},
			{
				"name": "_agentAddress",
				"type": "address"
			},
			{
				"name": "_agentCommission",
				"type": "uint8"
			},
			{
				"name": "_amount",
				"type": "uint16"
			}
		],
		"name": "addContract",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_name",
				"type": "string"
			},
			{
				"name": "_property",
				"type": "uint8"
			},
			{
				"name": "_iban",
				"type": "string"
			},
			{
				"name": "_micropayments",
				"type": "bool"
			}
		],
		"name": "addUser",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_id",
				"type": "uint256"
			},
			{
				"name": "_agencyCompanyCommission",
				"type": "uint8"
			},
			{
				"name": "_dias",
				"type": "uint256"
			}
		],
		"name": "completeContract",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_userAddress",
				"type": "address"
			},
			{
				"name": "_name",
				"type": "string"
			},
			{
				"name": "_property",
				"type": "uint8"
			},
			{
				"name": "_active",
				"type": "bool"
			},
			{
				"name": "_iban",
				"type": "string"
			},
			{
				"name": "_micropayments",
				"type": "bool"
			}
		],
		"name": "editUser",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "paidContract",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_date",
				"type": "uint256"
			}
		],
		"name": "setDate",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "_date",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getCommissions",
		"outputs": [
			{
				"name": "",
				"type": "uint8"
			},
			{
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getContractDetail",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint16"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint8"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getContractsWithMicropayments",
		"outputs": [
			{
				"name": "",
				"type": "uint256[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getDate",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getPaidContractsOfUser",
		"outputs": [
			{
				"name": "",
				"type": "uint256[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getPaymentCode",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getPendingContractsOfUser",
		"outputs": [
			{
				"name": "",
				"type": "uint256[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getUnpaidContracts",
		"outputs": [
			{
				"name": "",
				"type": "uint256[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getUnpaidContractsOfUser",
		"outputs": [
			{
				"name": "",
				"type": "uint256[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_userAddress",
				"type": "address"
			}
		],
		"name": "getUserInfo",
		"outputs": [
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "uint8"
			},
			{
				"name": "",
				"type": "bool"
			},
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]

let smartInsurance = {
    web3: null,
    contract: null,
		account: '',
		userInfo: {},

    init (callback) {
        let Web3 = window.Web3
        this.web3 = new Web3(Web3.givenProvider)
        this.contract = new this.web3.eth.Contract(ABI, contractAddress)
        this.web3.eth.getAccounts()
        .then((accounts) => {
						console.log(accounts)
						this.account = accounts[0]
						this.getUserInfo().then((data) => {
							this.userInfo = data
							callback(data)
							console.log('User Info: ', data)
						})
        })
    },

    async getUserInfo () {
			let data = await this.contract.methods.getUserInfo(this.account).call({from: this.account}).then()
			return {name: data[0], property: parseInt(data[1]), active: data[2], micropayments: data[3]}
    },

    async getDate () {
        return await this.contract.methods.getDate().call({from: this.account}).then()
		},
	
		async getUnpaidContracts () {
			return await this.contract.methods.getUnpaidContractsOfUser().call({from: this.account}).then()
		},

		async getPaidContracts () {
			return await this.contract.methods.getPaidContractsOfUser().call({from: this.account}).then()
		},

		async getOrdersDetail (order) {
			let data =  await this.contract.methods.getContractDetail(order).call({from: this.account}).then()
			return {dias: data[0], amount: data[1], date: data[2], Comission1: data[3], Comission2: data[4], micropayments: data[5]}

		},

		async getPendingContracts () {
			return await this.contract.methods.getPendingContractsOfUser().call({from: this.account}).then()
		},

		async completeContract (contractID, agencyCompanyCommision, dias) {
			console.log(contractID, agencyCompanyCommision, dias)
			return await this.contract.methods.completeContract(contractID, agencyCompanyCommision, dias).send({from: this.account, gasPrice: 0}).then()
		},

		async addContract (insuranceCompanyAddress, agentAddress, agentCommission, amount) {
			return await this.contract.methods.addContract(insuranceCompanyAddress, agentAddress, agentCommission, amount).send({from: this.account, gasPrice: 0}).then()
		},

		async addUser (name, property, iban, micropayments) {
			await this.contract.methods.addUser(name, property, iban, micropayments).send({from: this.account, gasPrice: 0}).then()
		}
}

export default smartInsurance
