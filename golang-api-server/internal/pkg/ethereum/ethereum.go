package ethereum

import (
	"context"
	"encoding/hex"
	"fmt"
	"strings"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/common"
	"golang.org/x/crypto/sha3"
	"golang.org/x/xerrors"
)

// Const
const (
	// Methods
	GetDeploymentAddressMethod string = "getDeploymentAddress(uint256,address)"

	// Contract Address
	MarineCoreContractAddress string = "0x803e9aD57c90d48FA9F9e3F11dEd6970B9c52D09"

	// Utils
	abiLength = 64
	abiBytes  = 32
)

// Config ...
type Config struct {
	Endpoint string
}

// GetDeploymentAddress ...
func GetDeploymentAddress(eth Ethereum, salt uint64, senderAddr string) (string, error) {
	data := fmt.Sprintf("0x%s", GetMethodID(GetDeploymentAddressMethod))

	//concatenate salt to data
	data += fmt.Sprintf("%064x", salt)

	//concatenate sender address to data
	encodedSenderAddr, err := EncodeAddressParameter(senderAddr)
	if err != nil {
		return "", xerrors.Errorf("EncodeAddressParameter: %w", err)
	}
	data += encodedSenderAddr

	toAddress := common.HexToAddress(MarineCoreContractAddress)
	resp, err := eth.Call(context.Background(), ethereum.CallMsg{
		//From     common.Address  // the sender of the 'transaction'
		To: &toAddress,
		//Gas      uint64          // if 0, the call executes with near-infinite gas
		//GasPrice *big.Int        // wei <-> gas exchange ratio
		//Value    *big.Int        // amount of wei sent along with the call
		Data: common.FromHex(data),
	})

	return common.BytesToAddress(resp).Hex(), nil
}

// GetMethodID ...
func GetMethodID(methodString string) string {
	hash := sha3.NewLegacyKeccak256()
	hash.Write([]byte(methodString))
	var buffer []byte
	digest := hash.Sum(buffer)
	return hex.EncodeToString(digest[:4])
}

// ParseAbi ...
func ParseAbi(abiStr, abiType string) (abi string, err error) {
	if len(abiStr) < abiLength {
		return abiStr, xerrors.Errorf("ParseAbi: %s", "invalid length of abi string")
	}
	if strings.HasPrefix(abiStr, "0x") {
		abi = strings.TrimLeft(abiStr, "0x")
	} else {
		abi = abiStr
	}

	switch abiType {
	case "hex":
		abi = fmt.Sprintf("0x%s", strings.TrimLeft(abi, "0"))
		if abi == "0x" {
			return "0x0", nil
		}
		return
	case "address":
		trimZero := strings.Repeat("0", 24) //24 zeros
		abi = strings.TrimLeft(abi, trimZero)
		if len(abi) < 40 {
			abi = fmt.Sprintf("0x%s%s", strings.Repeat("0", 40-len(abi)), abi)
			return
		}
		abi = fmt.Sprintf("0x%s", abi)
		return
	default:
		return abi, xerrors.Errorf("ParseAbi: %s", "abiType is not valid")
	}
}

// EncodeAddressParameter ...
func EncodeAddressParameter(address string) (string, error) {
	hexString := strings.TrimPrefix(address, "0x")
	decoded, err := hex.DecodeString(hexString)
	if len(decoded) != 20 || err != nil {
		return "", xerrors.New("invalid address format")
	}
	encodedAddress := fmt.Sprintf("%064s", hexString)
	return encodedAddress, nil
}
