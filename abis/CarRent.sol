// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";

/* 
 * @dev Interface for ERC-20 token functionality.
 */
interface IERC20Token {
    function transfer(address, uint256) external returns (bool);
    function approve(address, uint256) external returns (bool);
    function transferFrom(address, address, uint256) external returns (bool);
    function totalSupply() external view  returns (uint256);
    function balanceOf(address) external view  returns (uint256);
    function allowance(address, address) external view  returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract CarBooking is AccessControl {

    // celo cUsd address
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    /* 
    * @dev Address representing the admin of the CarBooking contract.
    */
    address admin;

    /* 
    * @notice Variable storing the total number of cars in the system.
    */
    uint256 public carLength;

    /* 
    * @notice Variable storing the total number of rents in the system.
    */
    uint256 public rentLength;

    /* 
    * @dev Enum representing the status of a car.
    * @param NOTACCEPT The car is not accepted for service.
    * @param ACCEPTED The car is accepted for service.
    * @param OUT_OF_SERVICE The car is marked as out of service.
    */
    enum CarStatus {
        NOTACCEPT,
        ACCEPTED,
        OUT_OF_SERVICE
    }

    /* 
    * @dev Enum representing the status of a car order.
    * @param OPEN The order is open and available for booking.
    * @param INPROGRESS The order is in progress, indicating the car is currently being rented.
    * @param CANCELLED The order has been cancelled.
    * @param COMPLETED The order has been successfully completed.
    */
    enum OrderStatus {
        OPEN,
        INPROGRESS,
        CANCELLED,
        COMPLETED
    }
    
    /* 
    * @dev Struct representing information about a rental.
    * @param carID The ID of the car associated with the rental.
    * @param carAddress The address of the car involved in the rental.
    * @param BookingAcount The address of the account that made the booking.
    * @param name The name associated with the rental.
    * @param destination The destination for the rental.
    * @param amount The amount paid for the rental.
    * @param paid A boolean indicating whether the rental payment has been made.
    */
    struct Rent {
        uint256 carID;
        address carAddress;
        address BookingAcount;
        string name;
        string destination;
        uint256 amount;
        bool paid;
    }
    
    /* 
    * @dev Struct representing information about a car.
    * @param owner The address of the car owner, payable for receiving payments.
    * @param admin The address of the admin who manages the car.
    * @param model The model of the car.
    * @param image The URL pointing to the image of the car.
    * @param plateNumber The license plate number of the car.
    * @param bookingPrice The price for booking the car.
    * @param rentCar The total number of times the car has been rented.
    * @param carStatus The current status of the car (NOTACCEPT, ACCEPTED, OUT_OF_SERVICE).
    * @param orderStatus The current status of the car order (OPEN, INPROGRESS, CANCELLED, COMPLETED).
    * @param carRent Array storing information about each rent instance associated with the car.
    *               Each element represents a Rent struct containing details about a specific rental.
    */
    struct Car {
        address payable owner;
        address admin;
        string model;
        string image;
        string plateNumber;
        uint256 bookingPrice;
        uint256 rentCar;
        CarStatus carStatus;
        OrderStatus orderStatus;
        Rent[] carRent; // Store the indices of rents for this car
    }

    /* 
    * @notice Event emitted when a new car is added to the system.
    * @dev Provides information about the added car, including the owner's address, model, image URL,
    * @dev plate number, booking price, and the initial car status.
    */
    event CarAdded(
        address indexed owner,
        string model,
        string image,
        string plateNumber,
        uint256 bookingPrice,
        CarStatus carStatus
    );

    /* 
    * @notice Event emitted when a car is approved by the admin.
    * @dev Provides information about the approved car, including the car ID and its new status.
    */
    event CarApproved(uint256 indexed carId, CarStatus carStatus);

    /* 
    * @notice Event emitted when a car is rejected by the admin.
    * @dev Provides information about the rejected car, including the car ID and its new status.
    */
    event CarRejected(uint256 indexed carId, CarStatus carStatus);

    /* 
    * @notice Event emitted when a car is marked as out of service by the admin.
    * @dev Provides information about the car marked as out of service, including the car ID and its new status.
    */
    event CarOutOfService(uint256 indexed carId, CarStatus carStatus);

    /* 
    * @notice Event emitted when a new rent is added for a car.
    * @dev Provides information about the added rent, including the car ID, car address,
    * @dev booking account, renter's name, destination, amount, and the order status.
    */
    event RentAdded(
        uint256 indexed carId,
        address indexed carAddress,
        address indexed bookingAccount,
        string name,
        string destination,
        uint256 amount,
        OrderStatus orderStatus
    );

    /* 
    * @notice Event emitted when a rent payment is processed successfully.
    * @dev This event provides information about the rent payment, including the car ID,
    * @dev the payer's address, the payee's address, and the amount paid.
    */
    event RentPayment(
        uint256 indexed carId,
        address indexed payer,
        address indexed payee,
        uint256 amount
    );

    /* 
    * @notice Contract constructor.
    * @dev Initializes the contract by granting the default admin role to the deployer (msg.sender).
    * @dev Sets the admin address for further reference.
    */
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        admin = msg.sender;
    }

    /**
     * @dev Modifier to restrict access to only the admin.
     */
    modifier onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Only admin can call this function");
        _;
    }
    
   /* Mapping to store information about cars.
   Each car is represented by a unique uint256 ID, and the corresponding value is a Car struct.
   This allows efficient access and retrieval of car information based on the car ID. */
    mapping (uint256 => Car) public cars;


    /**
     * @notice Add a new car to the system.
     * @param _model The model of the car.
     * @param _imageCar The URL of the car's image.
     * @param _plateNumber The plate number of the car.
     * @param _bookingPrice The booking price for the car.
     */
    function addCar(string memory _model, string memory _imageCar,string memory _plateNumber, uint256 _bookingPrice) public {
        require(bytes(_model).length > 0, "CarBooking: Model cannot be empty");
        require(bytes(_imageCar).length > 0, "CarBooking: Image URL cannot be empty");
        require(bytes(_plateNumber).length > 0, "CarBooking: Plate number cannot be empty");
        require(_bookingPrice > 0, "CarBooking: Booking price must be greater than zero");
         // Use carLength as the carID
        
        Car storage newCar = cars[carLength];
        newCar.owner = payable (msg.sender);
        newCar.admin = admin;
        newCar.model = _model;
        newCar.image = _imageCar;
        newCar.plateNumber = _plateNumber;
        newCar.bookingPrice = _bookingPrice;
        // newCar.carStatus = CarStatus.ACCEPTED;

        emit CarAdded(
            newCar.owner,
            newCar.model,
            newCar.image,
            newCar.plateNumber,
            newCar.bookingPrice,
            newCar.carStatus
        );
        
        carLength++;
    }

    /**
     * @dev Approve a car for usage.
     * @param _carId The ID of the car to be approved.
     */
    function carApprove (uint256 _carId) public onlyAdmin {
        require(_carId < carLength, "CarBooking: Invalid car index");
        Car storage car = cars[_carId];
        require(car.carStatus == CarStatus.NOTACCEPT, "car did not meetup to our service or already accepted");
        car.carStatus = CarStatus.ACCEPTED;
        emit CarApproved(_carId, car.carStatus);
    }

    /**
     * @dev Reject a previously approved car.
     * @param _carId The ID of the car to be rejected.
     */
    function rejectCar (uint256 _carId) public onlyAdmin {
        require(_carId < carLength, "CarBooking: Invalid car index");
        Car storage car = cars[_carId];
        require(car.carStatus == CarStatus.ACCEPTED, "car not Accept");
        car.carStatus = CarStatus.NOTACCEPT;
        emit CarRejected(_carId, car.carStatus);
    }

    /**
     * @dev Mark a car as out of service.
     * @param _carId The ID of the car to be marked as out of service.
     */
    function outOfServiceCar (uint256 _carId) public onlyAdmin {
        require(_carId < carLength, "CarBooking: Invalid car index");
        Car storage car = cars[_carId];
        require(car.carStatus == CarStatus.ACCEPTED, "Car is not approve");
        car.carStatus = CarStatus.OUT_OF_SERVICE;
        emit CarOutOfService(_carId, car.carStatus);
    }
    
    /**
     * @notice Add a new rent for a car.
     * @param _carID The ID of the car to be rented.
     * @param _name The name of the person renting the car.
     * @param _destination The destination for the car rental.
     */
    function addRent(uint256 _carID, string memory _name, string memory _destination) public {
        require(_carID < carLength, "Invalide Car index");
        Car storage car = cars[_carID];
        require(car.carStatus == CarStatus.ACCEPTED , "Car is not approve for useage");
        require(car.orderStatus == OrderStatus.OPEN , "Car is alreadly on hire");
        Rent memory newRent = Rent({
            carID: _carID,
            carAddress: car.owner,
            BookingAcount: msg.sender,
            name: _name,
            destination: _destination,
            amount: car.bookingPrice,
            paid: false
        });
        rentLength++;
        
        cars[_carID].orderStatus = OrderStatus.INPROGRESS; 
        cars[_carID].carRent.push(newRent);

        emit RentAdded(_carID, car.owner, msg.sender, _name, _destination, car.bookingPrice, car.orderStatus);

    }

    /**
     * @notice Get information about a car.
     * @param _index The index of the car.
     */
    function getCars(uint256 _index) public view returns (
        address, address, string memory, string memory,
        string memory, uint256,
        uint256,
        CarStatus, 
        OrderStatus
    ) {
        require(_index < carLength, "CarBooking: Invalid car index");
        Car storage car = cars[_index];
        return (
            car.owner,
            car.admin,
            car.model,
            car.image,
            car.plateNumber,
            car.bookingPrice,
            car.rentCar,
            car.carStatus,
            car.orderStatus
        );
    }

    /**
     * @notice Get information about a car rental.
     * @param _index The index of the car rental.
     */
    function getRent(uint256 _index) public view returns (
        uint256,
        address,
        address,
        string memory,
        string memory,
        uint256,
        bool
    ) {
        Car storage car = cars[_index];
        require(_index < car.carRent.length, "CarBooking: Invalid rent index");
        return (
            car.carRent[_index].carID,
            car.carRent[_index].carAddress,
            car.carRent[_index].BookingAcount,
            car.carRent[_index].name,
            car.carRent[_index].destination,
            car.carRent[_index].amount,
            car.carRent[_index].paid
        );
    }

    function getCarLength() public view returns(uint256) {
        return carLength;
    }

    function getRentLength() public view returns(uint256) {
        return rentLength;
    }

    
    /**
     * @dev Process payment for a car rental.
     * @param _index The index of the car rental.
     */
    function carRentPayment(uint256 _index) external payable  {
        Car storage car = cars[_index];
        require(msg.sender == car.carRent[_index].BookingAcount, "Must be the owner");
        require(IERC20Token(cUsdTokenAddress).transferFrom(
            msg.sender,
            cars[_index].owner,
            car.bookingPrice
         ), "Transfer failed");
        car.carRent[_index].paid = true;
        cars[_index].orderStatus = OrderStatus.OPEN; 
        emit RentPayment(_index, msg.sender, cars[_index].owner, car.bookingPrice);
    }
}