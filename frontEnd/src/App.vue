<template>
  <div id="app">
    <b-container>
      <h3 v-if="userInfo.property >= 0">Welcome, {{ userInfo.name }}</h3>
      <b-row v-if="userInfo.property === -1">
        <b-col class="box p-3">
          <h3>
            Register
          </h3>
          <b-row>
            <b-col class="text-center mb-3">
              <b-form-input
                          type="text"
                          v-model="registerForm.name"
                          placeholder="Name">
              </b-form-input>
              <b-form-input
                          type="text"
                          v-model="registerForm.iban"
                          placeholder="IBAN">
              </b-form-input>
              <b-form-select v-model="registerForm.property" :options="[
              {
                value: 0, text: 'Insurance Company'
              },
              {
                value: 1, text: 'Agency Company'
              },
              {
                value: 2, text: 'Agent'
              }
              ]" />
              <b-form-select v-model="registerForm.micropayments" :options="[
              {
                value: true, text: 'Micropayments'
              },
              {
                value: false, text: 'No Micropayments'
              }
              ]" class="mb-3" />
              <b-button @click="register()" variant="primary" class="mt-2" ref="registerButton">Register</b-button>
            </b-col>
          </b-row>
        </b-col>
      </b-row>

      <b-row v-if="userInfo.property === 1">
        <b-col class="box p-3">
          <h3>
            Add Contract
          </h3>
          <b-row>
            <b-col class="text-center mb-3">
              <b-form-input
                          type="text"
                          v-model="addContractForm.insuranceCompanyAddress"
                          placeholder="Insurance Company Address">
              </b-form-input>
              <b-form-input
                          type="text"
                          v-model="addContractForm.agentAddress"
                          placeholder="Agent Address">
              </b-form-input>
              <b-form-input
                          type="text"
                          v-model="addContractForm.agentCommission"
                          placeholder="Agent Commision">
              </b-form-input>
              <b-form-input
                          type="text"
                          v-model="addContractForm.amount"
                          placeholder="Amount">
              </b-form-input>
              <b-button @click="addContract()" variant="primary" class="mt-2" ref="addContractButton">Add Contract</b-button>
            </b-col>
          </b-row>
        </b-col>
      </b-row>

      <b-row v-if="userInfo.property === 0">
        <b-col class="box p-3">
          <h3>
            Pending Contracts
          </h3>
          <b-row class="scrollable">
            <b-col class="text-center mb-3">
              <b-row v-for="contract in pendingContracts" :key="contract.id">
                <b-col cols="1">
                  #{{contract.id}}
                </b-col>
                <b-col cols="3">
                  <b-form-input
                          type="text"
                          v-model="contract.agencyCompanyCommision"
                          placeholder="Agency Company Commission">
                  </b-form-input>
                </b-col>
                <b-col cols="4">
                  <b-form-input
                          type="text"
                          v-model="contract.dias"
                          placeholder="DIAS">
                  </b-form-input>
                </b-col>
                <b-col cols="4">
                  <b-button @click="completeContract(contract.id, contract.agencyCompanyCommision, contract.dias)" variant="primary" class="mt-2">OK</b-button>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-col>
      </b-row>

      <b-row>
        <b-col class="box p-3">
          <h3>
            Contracts
          </h3>
          <b-tabs>
            <b-tab title="Paid Contracts" active>
              <div class="p-2 scrollable">
                <b-table striped hover :items="paidContracts"></b-table>
              </div>
            </b-tab>
            <b-tab title="Unpaid Contracts">
              <div class="p-2 scrollable">
                <b-table striped hover :items="unPaidContracts"></b-table>
              </div>
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import smartInsurance from './services/smartInsurance'

export default {
  name: 'App',
  data () {
    return {
      registerForm: {
        name: '',
        property: 0,
        micropayments: false,
        iban: ''
      },
      addContractForm: {
        insuranceCompanyAddress: '',
        agentAddress: '',
        agentCommission: '',
        amount: ''
      },
      userInfo: {name: '', property: -1, active: false},
      contracts: {
        paid: [],
        unpaid: [],
        pending: []
      },
      paidContracts: [],
      unPaidContracts: [],
      pendingContracts: []
    }
  },
  created () {
    smartInsurance.init((userInfo) => {
      this.userInfo = userInfo
      this.init()
    })
  },
  mounted () {
  },
  methods: {
    register () {
      this.$refs.registerButton.disabled = true
      smartInsurance.addUser(this.registerForm.name, this.registerForm.property, this.registerForm.iban, this.registerForm.micropayments).then(() => {
        this.$notify({
          title: 'Registration',
          message: 'Successfuly registered',
          type: 'success'
        })
        this.$refs.registerButton.disabled = false
      })
    },
    addContract () {
      smartInsurance.addContract(this.addContractForm.insuranceCompanyAddress, this.addContractForm.agentAddress, parseInt(this.addContractForm.agentCommission), parseInt(this.addContractForm.amount))
        .then(() => {
          this.$notify({
            title: 'New Contract',
            message: 'New contract successfully added',
            type: 'success'
          })
        })
    },
    completeContract (id, agencyCompanyCommision, dias) {
      smartInsurance.completeContract(parseInt(id), parseInt(agencyCompanyCommision), parseInt(dias)).then(() => {
        this.$notify({
          title: 'Pending Contract',
          message: 'Contract have been details updated',
          type: 'success'
        })
      })
    },
    init () {
      this.getPendingContracts()
      setInterval(this.fetchContracts, 1800)
    },
    getPendingContracts () {
      if (this.userInfo.property === 0) {
        let tpendingContracts = []
        smartInsurance.getPendingContracts().then((pendingContracts) => {
          pendingContracts.forEach((contract, idx) => {
            tpendingContracts.push({
              id: contract,
              agencyCompanyCommision: '',
              dias: ''
            })
            if (idx === pendingContracts.length - 1) {
              this.pendingContracts = tpendingContracts
            }
          })
        })
      }
    },
    fetchContracts () {
      // Paid Contracts
      let paid = []
      let unpaid = []
      smartInsurance.getPaidContracts().then((contracts) => {
        contracts.forEach((contract, idx) => {
          smartInsurance.getOrdersDetail(contract).then((contractDetails) => {
            paid.push({
              id: contract,
              dias: contractDetails.dias,
              amount: contractDetails.amount,
              date: new Date(parseInt(contractDetails.date)).toDateString(),
              comission1: contractDetails.Comission1,
              commision2: contractDetails.Comission2
            })
            if (idx === contracts.length - 1) {
              this.paidContracts = paid
            }
          })
        })
      })
      // Unpaid
      smartInsurance.getUnpaidContracts().then((contracts) => {
        contracts.forEach((contract, idx) => {
          smartInsurance.getOrdersDetail(parseInt(contract)).then((contractDetails) => {
            unpaid.push({
              id: contract,
              dias: contractDetails.dias,
              amount: contractDetails.amount,
              date: new Date(parseInt(contractDetails.date)).toDateString(),
              comission1: contractDetails.Comission1,
              commision2: contractDetails.Comission2
            })
            if (idx === contracts.length - 1) {
              this.unPaidContracts = unpaid
            }
          })
        })
      })
    }
  }
}
</script>

<style scoped>
.eth_address {
  font-size: .7em;
  color: rgb(216, 216, 216);
}
.box {
  border: solid 1px #ebebeb;
  background: #f9fafc;
}
.scrollable {
  max-height: 600px;
  overflow-y: scroll;
}
</style>
