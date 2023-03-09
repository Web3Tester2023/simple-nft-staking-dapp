// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

error NotOwner();
error ContractPaused();

contract NftStaking is ERC1155Holder {
        
    struct StakerInfo {
        uint256 totalNftStaked;
        uint256 rewardPending;
        uint256 lastUpdateAt;
    }

    /* ========== VARIABLES ========== */
    
    IERC20 immutable rewardToken;
    IERC1155 immutable NFT;

    address public owner;
    
    uint256 private _totalStaked;
    uint256 private blockReward;
    uint256 private tokenPool;
    
    uint256 public poolKEY; // NFT ID

    bool internal locked;
    bool public paused;
    
    mapping(address => StakerInfo) public stakers;

    /* ========== EVENTS ========== */

    event Staked(address indexed staker, uint256 amount, uint256 totalStaked);
    event Unstaked(address indexed staker, uint256 amount, uint256 totalStaked);
    event RewardsClaimed(address staker, uint256 amount);
    event KeyTokenChanged(uint256 oldID, uint256 newID);

    /* ========== MODIFIERS ========== */
    
    modifier noReentrant(){
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }

    // In case of emergency sets contract on pause
    modifier onlyWhenNotPaused() {
        if(paused){
            revert ContractPaused();
        }
        _;
    }

    modifier onlyOwner(){
        if (msg.sender != owner) {
            revert NotOwner();
        }
        _;
    }
    
    /**
     * @param rewardTokenAddress - ERC20 Reward Token Address
     * @param nftAddress - ERC1155 NFT Address
     * @param _tokenPool - ERC20 supply reward
     * @param _blockReward - reward per block in Wei
     * @param _key - pool key (NFT ID)
     */
    constructor(address rewardTokenAddress, address nftAddress, uint256 _tokenPool, uint256 _blockReward, uint256 _key) {
        owner = msg.sender;
        rewardToken  = IERC20(rewardTokenAddress);
        NFT = IERC1155(nftAddress);
        tokenPool = _tokenPool;
        blockReward = _blockReward;
        poolKEY = _key;
    }

    /* ========== FUNCTIONS ========== */

    /**
     * @dev stake selected amount of NFT
     */
    function stake(uint256 amount, bytes memory data) public noReentrant onlyWhenNotPaused {
        require(amount > 0, "Can't stake 0");
        require(tokenPool > 0, "no rewards left");
        
        StakerInfo storage staker = stakers[msg.sender];

        // update pending rewards
        if (staker.totalNftStaked > 0) {
            staker.rewardPending += calculateReward(staker.totalNftStaked, staker.lastUpdateAt);
        }
        
        // update user's Nft count
        staker.totalNftStaked += amount;
        _totalStaked += amount;

        // update block number
        staker.lastUpdateAt = block.number;
        
        NFT.safeTransferFrom(msg.sender, address(this), poolKEY, amount, data);
        
        emit Staked(msg.sender, amount, staker.totalNftStaked);
    }

    /**
     * @dev unstake selected amount of NFT
     */
    function unstake(uint256 amount, bytes memory data) public noReentrant onlyWhenNotPaused {
        require(msg.sender != address(0), "transfer from the zero address");
        require(stakers[msg.sender].totalNftStaked >= amount, "amount exceeds your total staked balance");
        
        StakerInfo storage staker = stakers[msg.sender];
       
        // update pending rewards
        staker.rewardPending += calculateReward(staker.totalNftStaked, staker.lastUpdateAt);
        
        // update user's Nft count
        staker.totalNftStaked -= amount;
        _totalStaked -= amount;

        // update block number
        staker.lastUpdateAt = block.number;
        
        NFT.safeTransferFrom(address(this),msg.sender, poolKEY, amount, data);
        
        emit Unstaked(msg.sender, amount, staker.totalNftStaked);
    }


    /**
     * @dev claim all pending rewards
     */
    function claim() public noReentrant onlyWhenNotPaused {

        require(earned(msg.sender) > 0, "stake to start earning rewards");
        require(tokenPool > 0, "no rewards left");
        
        StakerInfo storage staker = stakers[msg.sender];

        uint256 reward;

        // check if user's pending balance has exceeded token pool
        if (earned(msg.sender) > tokenPool) {
            reward = tokenPool;
            tokenPool = 0;
        } else {
            reward = earned(msg.sender);
            tokenPool -= reward;
        }
        
        rewardToken.transfer(msg.sender, reward);
        // rewardToken.transferFrom(address(this), msg.sender, reward);

        staker.lastUpdateAt = block.number;
        staker.rewardPending = 0;
        
        emit RewardsClaimed(msg.sender, reward);
    }

    /**
     * @dev returns number of NFTs staked in contract
     */
    function totalStaked() public view returns (uint256) {
        return _totalStaked;
    }

    /**
     * @dev returns number of NFTs staked by user
     */
    function totalStakedFor(address addr) public view returns (uint256) {
        return stakers[addr].totalNftStaked;
    }

    /**
     * @dev returns user's earned reward
     */
    function earned(address user) public view returns (uint256) {
        StakerInfo storage staker = stakers[user];
        return calculateReward(staker.totalNftStaked, staker.lastUpdateAt) + staker.rewardPending;
    }

    /**
     * @dev function that will calculate pending reward
     */
    function calculateReward(uint staked, uint lastUpdate)
        private
        view
        returns (uint256)
    {
        return (staked == 0) ? 0 : staked * blockReward * (block.number - lastUpdate);
    }

    function getPoolKeyToken() public view returns (uint256) {
        return poolKEY;
    }

    /* ========== ONLY-OWNER ========== */

    function changePoolKeyToken(uint256 id) external onlyOwner {       
        uint256 old = poolKEY;
        poolKEY = id;

        emit KeyTokenChanged(old, id);
    }
    
    function changeBlockReward (uint256 newBlockReward) external onlyOwner {
        blockReward = newBlockReward;
    }

    function transferOwnership (address newOwner) external onlyOwner {
        owner = newOwner;
    }

    /**
     * @dev pause contract in case of emergency
     */
    function setPaused(bool val) external onlyOwner {
        paused = val;
    }
}