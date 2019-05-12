pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

// import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol';
// import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
// import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract PayrollContract {
  uint256 public employee_id;
  uint256 public payroll_id;

  struct Employee {
    uint256 employee_id;
    string name;
    address payable public_address;
    uint256 hourly_rate;
    uint256 time_created;
  }

  struct Payroll {
    uint256 employee_id;
    uint256 hours_worked;
  }

  Payroll[] public currentPayroll;

  mapping (uint => Employee) public employees;
  mapping (uint => Payroll[]) public payrolls;
  mapping (address => uint256) public balanceOf;

  // todo: dont work
  // function getCurrentPayroll (uint i) public returns(Payroll) {
  //   return currentPayroll[i];
  // }
  

  function deposit() public payable {
    balanceOf[msg.sender] += msg.value;
  }

  function currentPayrollCount() public view returns(uint256) {
    return currentPayroll.length;
  }
  
  function createEmployee(address payable _employee_address, uint _hourly_rate, string memory _name) public returns(uint) {
    // we don't need to pass in employee_id as an argument to the mint function because of the line below:
    employee_id++;

    uint time_created = now;

    Employee memory employee = Employee({
      name: _name,
      employee_id: employee_id,
      public_address: _employee_address,
      hourly_rate: _hourly_rate,
      time_created: time_created
    });

    employees[employee_id] = employee;

    return employee_id;
  }

  function createNewPayroll() public returns(uint) {
    payroll_id++;

    currentPayroll.length = 0;

    payrolls[payroll_id] = currentPayroll;

    return payroll_id;
  }

  function getCurrentPayroll() public view returns(uint) {
    return payroll_id;
  }

  function getCurrentPayrollLength() public view returns(uint) {
    return currentPayroll.length;
  }

  function addEmployeeToPayroll(uint _employee_id, uint _hours_worked) public {
    Payroll memory newEmployeePayroll = Payroll({
      employee_id: _employee_id,
      hours_worked: _hours_worked
    });

    currentPayroll.push(newEmployeePayroll);
  }

  function updateHoursWorked(uint _employee_id, uint _hours_worked) public {
    uint arrayLength = currentPayroll.length;

    for (uint i=0; i<arrayLength; i++) {
      if(currentPayroll[i].employee_id == _employee_id) {
        currentPayroll[i].hours_worked = _hours_worked;
      }
    }
  }

  function checkLastEmployeePayment() public returns(address) {
    uint256 payment;
    address payable employee_address;
    payrolls[payroll_id] = currentPayroll;

    uint arrayLength = currentPayroll.length;

    for (uint i=0; i<arrayLength; i++) {
      payment = employees[currentPayroll[i].employee_id].hourly_rate*currentPayroll[i].hours_worked;
      employee_address = employees[currentPayroll[i].employee_id].public_address;
    }

    // return payment;
    return employee_address;
  }

  function payLastEmployeeOne() public returns(bool) {
    address payable employee_address;
    payrolls[payroll_id] = currentPayroll;

    uint arrayLength = currentPayroll.length;

    employee_address = employees[currentPayroll[arrayLength].employee_id].public_address;
    balanceOf[msg.sender] -= 1;
    return employee_address.send(1);
  }

  function runPayroll() public {
    // set current payroll
    payrolls[payroll_id] = currentPayroll;

    uint arrayLength = currentPayroll.length;

    for (uint i=0; i<arrayLength; i++) {
      uint256 payment;
      address payable employee_address;

      payment = employees[currentPayroll[i].employee_id].hourly_rate*currentPayroll[i].hours_worked;

      require(payment <= balanceOf[msg.sender]);

      employee_address = employees[currentPayroll[i].employee_id].public_address;
      employee_address.transfer(payment);
      balanceOf[msg.sender] -= payment;
    }

    // createNewPayroll();
  }
}
