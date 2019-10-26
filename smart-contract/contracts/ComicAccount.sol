pragma solidity 0.5.12;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract ComicAccount  {
  using SafeMath for uint256;

  bool public initialized = false;
  address payable public uploader;
  address payable[] public candidates;
  mapping(address => bool) public isCandidate;
  mapping(address => uint256) public acquiredVotes;

  struct Status {
    bool alreadyVoted,
    address votedTo;
  }
  mapping(address => Status) public votingStatus;

  enum Recipients {
    Uploder,
    Creator,
    Voter,
  }
  mapping(Recipients => uint256) public balanceOf;

  event Initialized();

  constructor() public {}

  // The fallback function for this contract.
  function() external payable {
    // TODO refactor
    balanceOf[Recipients.Creator] = msg.value;
    if (uploader != address(0)) {
      balanceOf[Recipients.Uploder] += msg.value.div(10).mul(1);
      balanceOf[Recipients.Creator] -= msg.value.div(10).mul(1);
    }
    balanceOf[Recipients.Voter] += msg.value.div(10).mul(1);
    balanceOf[Recipients.Creator] -= msg.value.div(10).mul(1);
  }

  function initialize(address payable _uploader) public {
    require(!initialized, "This contract has already been initialized.");
    uploader = _uploader;
    initialized = true;
    emit Initialized();
  }

  function vote(address _candidate) public {
    require(isCandidate[_candidate], "specified address is not a candidate");
    require(!votingStatus[msg.sender].alreadyVoted, "msg.sender has already voted");

    acquiredVotes[_candidate] += 1;
    votingStatus[msg.sender].votedTo = _candidate;
    votingStatus[msg.sender].alreadyVoted = true;
  }

  function beCandidate() public {
    require(!isCandidate[msg.sender], "msg.sender is already a candidate");
    isCandidate[msg.sender] = true
    candidates.push(msg.sender);
  }

  function getCurrentCreator() public (address) {
    require(candidates.length != 0, "there is no candidates")
    uint256 highest = 0;
    address creator;
    for(uint256 i = 0; i < candidates.length; i++) {
      uint256 amount = acquiredVotes[candidates[i]];
      if highest < amount {
        highest = amount;
        creator = candidates[i];
      }
    }
    require(creator != address(0), "creator address is zero address")
    return creator;
  }

  function withdraw() public {
    require(uploader != address(0), "uploader is not yet defined")
    address creator = getCurrentCreator();
    if (uploader == msg.sender) {
      msg.sender.tranfer(balanceOf[Recipients.Uploder]);
    }
    if (creator == msg.sender) {
      msg.sender.tranfer(balanceOf[Recipients.Creator]);
    }
    if (creator == msg.sender) {
      msg.sender.tranfer(balanceOf[Recipients.Creator]);
    }
    if (votingStatus[msg.sender].votedTo == creator) {
      uint256 amount = balanceOf[Recipients.Voter].div(acquiredVotes[creator]);
      msg.sender.tranfer(amount);
    }
  }
}
