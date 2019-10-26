pragma solidity 0.5.12;

contract ComicAccount  {

  bool public initialized = false;
  uint256 public signerNum = 0;
  event Initialized();

  constructor() public {}

  // The fallback function for this contract.
  function() external payable {
    require(msg.data.length == 0, "msg.data is not empty.");
    emit Funded(address(this).balance);
  }

  function initialize(address[] memory _owners, uint256 _signerNum) public {
    require(!initialized, "This contract has already been initialized.");

    address zeroAddress = address(0);

    //for (uint i = 0; i < _owners.length; i++) {
      //require(_owners[i] != zeroAddress, "Owner address cannot be zero address.");
      //require(!owners[_owners[i]], "Owners must be different address.");
      //owners[_owners[i]] = true;
    //}

    //// TODO MofNの順序を考えて直感的なvalidationをかける
    //require(_signerNum > 0, "SignerNum has to be greater than zero.");
    //require(_signerNum <= _owners.length, "SignerNum cannot be greater than owners.");
    //signerNum = _signerNum;

    initialized = true;
    emit Initialized();
  }

  // Generates the message to sign given the output destination address and amount.
  // includes this contract's address and a nonce for replay protection.
  // One option to independently verify:
  //     https://leventozturk.com/engineering/sha3/ and select keccak
  //function generateMessageToSign(
    //address _destination,
    //uint256 _value,
    //address _tokenAddress,
    //uint256 _nonce
  //)
  //public view returns (bytes32)
  //{
    //require(_destination != address(this), "Destination cannot be this contract.");

    //bytes32 message = keccak256(
      //abi.encodePacked(
        //this,
        //_destination,
        //_value,
        //_tokenAddress,
        //_nonce
      //)
    //);
    //return message;
  //}

  //// generate message for ERC721
  //function generateMessageToSign(
    //address _destination,
    //address _tokenAddress,
    //uint256 _tokenId,
    //uint256 _nonce
  //)
  //public view returns (bytes32)
  //{
    //require(_destination != address(this), "Destination cannot be this contract.");

    //bytes32 message = keccak256(
      //abi.encodePacked(
        //this,
        //_destination,
        //_tokenAddress,
        //_tokenId,
        //_nonce
      //)
    //);
    //return message;
  //}

  //// Send the given amount of ETH to the given destination using
  //// the two triplets (v1, r1, s1) and (v2, r2, s2) as signatures.
  //// s1 and s2 should be 0x00 or 0x01 corresponding to 0x1b and 0x1c respectively.
  //function spend(
    //address payable _destination,
    //uint256 _value,
    //address _tokenAddress,
    //uint8[] memory _v,
    //bytes32[] memory _r,
    //bytes32[] memory _s
  //)
  //public
  //{
    //// This require is handled by generateMessageToSign()
    //// require(destination != address(this));
    //require(
      //_validSignature(
        //_destination,
        //_value,
        //_tokenAddress,
        //_v, _r, _s
    //),
    //"Invalid signature.");
    //spendNonce = spendNonce + 1;

    //if(_tokenAddress == ETH_ADDRESS) {
      //require(address(this).balance >= _value, "Insufficient balance to send.");
      //(bool success, bytes memory _) = _destination.call.value(_value).gas(10000)("");
      //require(success, "Ether transfer failed.");
      //_;
    //} else {
      //ERC20Interface instance = ERC20Interface(_tokenAddress);
      //require(instance.transfer(_destination, _value), "Token transfer failed.");
    //}
    //emit Spent(_destination, _value, _tokenAddress);
  //}


  //// Send the given amount of ETH to the given destination using
  //// the two triplets (v1, r1, s1) and (v2, r2, s2) as signatures.
  //// s1 and s2 should be 0x00 or 0x01 corresponding to 0x1b and 0x1c respectively.
  //function spend(
    //address payable _destination,
    //address _tokenAddress,
    //uint256  _tokenId,
    //uint8[] memory _v,
    //bytes32[] memory _r,
    //bytes32[] memory _s
  //)
  //public
  //{
    //// This require is handled by generateMessageToSign()
    //// require(destination != address(this));
    //require(
      //_validSignature(
        //_destination,
        //_tokenAddress,
        //_tokenId,
        //_v, _r, _s
    //),
    //"Invalid signature.");
    //spendNonce = spendNonce + 1;

    //ERC721Interface instance = ERC721Interface(_tokenAddress);
    //instance.safeTransferFrom(address(this), _destination, _tokenId);

    //emit Spent(_destination, _tokenAddress, _tokenId);
  //}

  //// Confirm that the two signature triplets (v1, r1, s1) and (v2, r2, s2)
  //// both authorize a spend of this contract's funds to the given
  //// destination address.
  //function _validSignature(
    //address _destination,
    //uint256 _value,
    //address _tokenAddress,
    //uint8[] memory _v,
    //bytes32[] memory _r,
    //bytes32[] memory _s
  //)
  //private returns (bool)
  //{
    //bytes32 message = _messageToRecover(_destination, _value, _tokenAddress);

    //require(_v.length == signerNum &&
            //_r.length == signerNum &&
            //_s.length == signerNum,
    //"Message was not signed by enough number of signers.");

    //address[] memory addrs = new address[](signerNum);
    //for (uint i = 0; i < signerNum; i++) {
      //addrs[i] = ecrecover(
        //message,
        //_v[i], _r[i], _s[i]
      //);
    //}

    //require(_distinctOwners(addrs), "Signing owners must be different.");

    //return true;
  //}

  //function _validSignature(
    //address _destination,
    //address _tokenAddress,
    //uint256 _tokenId,
    //uint8[] memory _v,
    //bytes32[] memory _r,
    //bytes32[] memory _s
  //)
  //private returns (bool)
  //{
    //bytes32 message = _messageToRecover(_destination, _tokenAddress, _tokenId);

    //require(_v.length == signerNum &&
            //_r.length == signerNum &&
            //_s.length == signerNum,
    //"Message was not signed by enough number of signers.");

    //address[] memory addrs = new address[](signerNum);
    //for (uint i = 0; i < signerNum; i++) {
      //addrs[i] = ecrecover(
        //message,
        //_v[i], _r[i], _s[i]
      //);
    //}

    //require(_distinctOwners(addrs), "Signing owners must be different.");

    //return true;
  //}


  //// Generate the the unsigned message (in bytes32) that each owner's
  //// wallet would have signed for the given destination and amount.
  ////
  //// The generated message from generateMessageToSign is converted to
  //// ascii when signed by a trezor.
  ////
  //// The required signing prefix, the length of this
  //// unsigned message, and the unsigned ascii message itself are
  //// then concatenated and hashed with keccak256.
  //function _messageToRecover(
    //address _destination,
    //uint256 _value,
    //address _tokenAddress
  //)
  //private view returns (bytes32)
  //{
    //bytes32 hashedUnsignedMessage = generateMessageToSign(
      //_destination,
      //_value,
      //_tokenAddress,
      //spendNonce
    //);
    //bytes memory prefix = "\x19Ethereum Signed Message:\n32";
    //return keccak256(abi.encodePacked(prefix, hashedUnsignedMessage));
  //}

  //function _messageToRecover(
    //address _destination,
    //address _tokenAddress,
    //uint256 _tokenId
  //)
  //private view returns (bytes32)
  //{
    //bytes32 hashedUnsignedMessage = generateMessageToSign(
      //_destination,
      //_tokenAddress,
      //_tokenId,
      //spendNonce
    //);
    //bytes memory prefix = "\x19Ethereum Signed Message:\n32";
    //return keccak256(abi.encodePacked(prefix, hashedUnsignedMessage));
  //}

  //// Confirm the pair of addresses as two distinct owners of this contract.
  //function _distinctOwners(
    //address[] memory _addrs
  //)
  //private returns (bool)
  //{
    //require(_addrs.length == signerNum, "Invalid number of signer.");

    //for (uint i = 0; i < _addrs.length; i++) {
      //require(_addrs[i] != address(0), "Invalid signature.");
      //require(owners[_addrs[i]], "Signer must be the owner.");
      //require(!checkedSigners[_addrs[i]], "Signing owners must be different.");
      //checkedSigners[_addrs[i]] = true;
    //}

    //// deleting the result
    //for (uint i = 0; i < _addrs.length; i++) {
      //delete checkedSigners[_addrs[i]];
    //}

    //return true;
  //}
}
