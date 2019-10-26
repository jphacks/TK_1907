pragma solidity 0.5.12;

import "./ComicAccount.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract MarineCore {
  using SafeMath for uint256;

  event ComicAccountCreated(address _comicAccount);

  bytes32 private contractCodeHash;
	mapping(address => uint256) public comicViews;
	uint256 public totalViews;
  ComicAccount[] public comics;

  constructor() public {
    contractCodeHash = keccak256(
      type(ComicAccount).creationCode
    );
  }

  function() external payable {
    for (uint256 i = 0; i < comics.length; i++) {
      address payable comic = address(comics[i]);
      uint256 reward = msg.value.div(totalViews).mul(comicViews[comic]);
      (bool success, bytes memory _) = comic.call.value(reward).gas(200000)("");
      require(success, "ether transfer failed");
      _;
    }
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
		comics.push(account);
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

  function setViews(address _comicAccount, uint256 _views) public {
    comicViews[_comicAccount] += _views;
		totalViews += _views;
  }
}
