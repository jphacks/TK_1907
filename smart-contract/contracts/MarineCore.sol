pragma solidity 0.5.12;

import "./ComicAccount.sol";
import "./Ownership/HasNoEther.sol";

contract MarineCore is HasNoEther {

    event ComicAccountCreated(address _comicAccount);

    bytes32 private contractCodeHash;

    constructor() public {
        contractCodeHash = keccak256(
            type(ComicAccount).creationCode
        );
    }

    function createComicAccount(uint256 _salt) public returns (address) {
        return _createComicAccount(_salt, msg.sender);
    }

    function getDeploymentAddress(uint256 _salt, address payable _sender) public view returns (address) {
        bytes32 salt = _getSalt(_salt, _sender);
        bytes32 rawAddress = keccak256(
            abi.encodePacked(
                bytes1(0xff),
                address(this),
                salt,
                contractCodeHash
            )
        );

        return address(bytes20(rawAddress << 96));
    }

    function _createComicAccount(uint256 _salt, address payable _sender) internal returns (address) {
        ComicAccount account = _deployComicAccount(_salt, _sender);
        account.initialize(_sender);
        emit ComicAccountCreated(address(account));
        return address(account);
    }

    function _deployComicAccount(uint256 _salt, address payable _sender) internal returns (ComicAccount) {
        address payable addr;
        bytes memory code = type(ComicAccount).creationCode;
        bytes32 salt = _getSalt(_salt, _sender);

        assembly {
            addr := create2(0, add(code, 0x20), mload(code), salt)
            if iszero(extcodesize(addr)) {
                revert(0, 0)
            }
        }

        return ComicAccount(addr);
    }

    function _getSalt(uint256 _salt, address _sender) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_salt, _sender));
    }
}