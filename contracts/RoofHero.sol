// UPLOAD FILES TO IPFS FROM BROWSER
// https://anarkrypto.github.io/upload-files-to-ipfs-from-browser-panel/public/
// https://nft.storage/

/*
El contrato  ERC721URIStorage es una implementación de ERC721 que incluye 
las extensiones estándar de metadatos (IERC721Metadata), así como un mecanismo 
para metadatos por token. De ahí viene el método _setTokenURI: lo usamos para almacenar los metadatos de un elemento.

https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol

A diferencia de ERC20, ERC721 carece de un campo de decimales, 
ya que cada token es distinto y no se puede particionar.

*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RooftopHero is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("RooftopHero", "RTH") {}

    function awardItem(address player, string memory tokenURI)
        public
        onlyOwner
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(player, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}