pragma solidity ^0.4.25;    // Tested on version 0.4.25

/*********************************
 * Smart contract created for Crowdhackathon Insurance3
 * https://crowdhackathon.com/insurance3
 * 
 * Code available on GitHub
 * https://github.com/crowdhackathon-insurance-3/SMARTINSURANCE
 ********************************/

contract smartInsurance {

    address owner; // Owner of this contract
    
    uint date; // Date in unix format
    
    // Keep users of the platform
    struct User {
        string name;
        // 0 -> Insurance Company 
        // 1 -> Agency Company
        // 2 -> Agent
        uint8 property;
        string iban;
        bool activeUser;
        bool micropayments;
    }
    mapping(address => User) private users;
    
    // Add new contract
    struct Contract {
        address insuranceCompanyAddress;
        address agencyCompanyAddress;
        address agentAddress;
        uint8 agencyCompanyCommission;
        uint8 agentCommission;
        uint16 amount;
        uint dias;
        uint date;
        bool micropayment;
        bool paid;
    }
    mapping(uint => Contract) private contracts;
    
    // Keep unpaid contracts for each user
    mapping(address => uint[]) public unpaidContracts;
    
    // Keep paid contracts for each user
    mapping(address => uint[]) private paidContracts;
    
    // Keep depending contracts for Insurance Company
    mapping(address => uint[]) private pendingContracts;
    
    // Unique ID
    uint id;
    
    // Array of all unpaid contracts
    uint[] public unpaidContractsArray;
    
    // Array for contracts with _micropayments
    uint[] micropaymentContractsArray;
    
    // Constructor
    constructor(uint _date) public {
        owner = msg.sender;
        date = _date;
    }
    
    // Check if is the admin
    modifier isOwnable {
        require(msg.sender == owner);
        _;
    }
    
    // Add new user
    function addUser(string _name, uint8 _property, string _iban, bool _micropayments) public payable {
        users[msg.sender].name = _name;
        users[msg.sender].property = _property;
        users[msg.sender].activeUser = true;
        users[msg.sender].iban = _iban;
        users[msg.sender].micropayments = _micropayments;
    }
    
    // Edit user
    function editUser(address _userAddress, string _name, uint8 _property, bool _active, string _iban, bool _micropayments) public isOwnable payable {
        users[_userAddress].name = _name;
        users[_userAddress].property = _property;
        users[_userAddress].activeUser = _active;
        users[_userAddress].iban = _iban;
        users[_userAddress].micropayments = _micropayments;
    }
    
    // Agent Company inserts a new contract
    function addContract(address _insuranceCompanyAddress, address _agentAddress, uint8 _agentCommission, uint16 _amount) public payable returns(uint) {
        require(users[msg.sender].activeUser && users[msg.sender].property == 1);
        contracts[id].insuranceCompanyAddress = _insuranceCompanyAddress;
        contracts[id].agencyCompanyAddress = msg.sender;
        contracts[id].agentAddress = _agentAddress;
        contracts[id].agentCommission = _agentCommission;
        contracts[id].amount = _amount;
        
        if(users[msg.sender].micropayments && users[_agentAddress].micropayments) {
            contracts[id].micropayment = true;
        }
        
        pendingContracts[_insuranceCompanyAddress].push(id);
        
        id += 1;
        return id-1;
    }
    
    // Insurance Company adds commision to Agent and DIAS unique number (unless if all accept micropayments)
    function completeContract(uint _id, uint8 _agencyCompanyCommission, uint _dias) public payable {
        require(users[msg.sender].activeUser && users[msg.sender].property == 0 && contracts[_id].insuranceCompanyAddress == msg.sender);
        contracts[_id].agencyCompanyCommission = _agencyCompanyCommission;
        contracts[_id].dias = _dias;
        contracts[_id].date = getDate();
        
        // Add it as unpaid order
        unpaidContracts[contracts[_id].insuranceCompanyAddress].push(_id);
        unpaidContracts[contracts[_id].agencyCompanyAddress].push(_id);
        unpaidContracts[contracts[_id].agentAddress].push(_id);
        unpaidContractsArray.push(_id);
        
        // check if will use micropayments
        if(!(users[msg.sender].micropayments && contracts[_id].micropayment)) {
            contracts[_id].micropayment = false; 
        }
        
        if(contracts[_id].micropayment) {
            micropaymentContractsArray.push(_id);
        }
        
        // Remove it from pending orders
        deleteArrayElement(pendingContracts[contracts[_id].insuranceCompanyAddress], _id);
    }

    // Mark contract as paid
    function paidContract(uint _id) public payable {
        //require(users[msg.sender].active && users[msg.sender].property == 0 && contracts[_id].insuranceCompanyAddress == msg.sender);
        contracts[_id].paid = true;
        contracts[_id].date = getDate();
        
        // Add it as paid order
        paidContracts[contracts[_id].insuranceCompanyAddress].push(_id);
        paidContracts[contracts[_id].agencyCompanyAddress].push(_id);
        paidContracts[contracts[_id].agentAddress].push(_id);
        
        // Remove it from unpaid orders
        require(deleteArrayElement(unpaidContracts[contracts[_id].insuranceCompanyAddress], _id));
        require(deleteArrayElement(unpaidContracts[contracts[_id].agencyCompanyAddress], _id));
        require(deleteArrayElement(unpaidContracts[contracts[_id].agentAddress], _id));
        require(deleteArrayElement(unpaidContractsArray, _id));
        require(deleteArrayElement(micropaymentContractsArray, _id));
    }
    
    // Set date
    function setDate(uint _date) public isOwnable payable {
        date = _date;
    }
    
    // Get date
    function getDate() public view returns(uint) {
        return date;
    }
    
    // Get the paid contracts of the user
    function getPaidContractsOfUser() public view returns(uint[]) {
        return paidContracts[msg.sender];
    }
    
    // Get the unpaid contracts of the user
    function getUnpaidContractsOfUser() public view returns(uint[]) {
        return unpaidContracts[msg.sender];
    }
    
    // Get information of a specific contract
    function getContractDetail(uint _id) public view returns(uint, uint16, uint, uint8, uint, bool) {
        require(contracts[_id].insuranceCompanyAddress == msg.sender || contracts[_id].agencyCompanyAddress == msg.sender || contracts[_id].agentAddress == msg.sender );
        
        // Return Dias unique number, Amount, Date and Commission
        // Check if is an Insurance Company
        if(users[msg.sender].property == 0) {
            return(contracts[_id].dias, contracts[_id].amount, contracts[_id].date, contracts[_id].agencyCompanyCommission, 0, contracts[_id].micropayment);
        } else if (users[msg.sender].property == 1) {
            return(contracts[_id].dias, contracts[_id].amount, contracts[_id].date, contracts[_id].agencyCompanyCommission, contracts[_id].agentCommission, contracts[_id].micropayment);
        } else if (users[msg.sender].property == 2) {
            return(contracts[_id].dias, contracts[_id].amount, contracts[_id].date, 0, contracts[_id].agentCommission, contracts[_id].micropayment);
        }
    }
    
    // Get information of a specific user
    function getUserInfo(address _userAddress) public view returns(string, uint8, bool, bool) {
        return(users[_userAddress].name, users[_userAddress].property, users[_userAddress].activeUser, users[_userAddress].micropayments);
    }
    
    // Get pending contracts of an Insurance company
    function getPendingContractsOfUser() public view returns(uint[]) {
        return(pendingContracts[msg.sender]);
    }
    
    // Get all unpaid contracts
    function getUnpaidContracts() public view returns(uint[]) {
        return unpaidContractsArray;
    }
    
    // Get all contracts that will use micropayments to the users
    function getContractsWithMicropayments() public view returns(uint[]) {
        return micropaymentContractsArray;
    }
    
    // Get the commissions of a specific contract
    function getCommissions(uint _id) public view returns(uint8, uint8) {
        return(contracts[_id].agencyCompanyCommission, contracts[_id].agentCommission);
    }
    
    // Get the payment code
    function getPaymentCode(uint _id) public isOwnable view returns(uint256) {
        return contracts[_id].dias;
    }
    
    // Deletes a specific element from an array
    function deleteArrayElement(uint[] storage _array, uint _id) private returns(bool) {
        uint _index;
        if (_array.length == 1 || _array[_array.length-1] == _id) {
            _array.length--;
            return true;
        } else {
            for (uint i=0; i<_array.length; i++) {
                if (_array[i] == _id) {
                    _index = i;
                    _array[_index] = _array[_array.length-1];
                    _array.length--;
                    return true;
                }
            }
        }
        return false;
    }
}