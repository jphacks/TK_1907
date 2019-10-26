package ethereum

import (
	"encoding/hex"
	"fmt"
	"strings"

	"github.com/ethereum/go-ethereum/common"
	"golang.org/x/crypto/sha3"
	"golang.org/x/xerrors"
)

// Const
const (
	// Methods
	GetDeploymentAddressMethod        string = "getDeploymentAddress(uint256,address)"
	CreateWalletMethod                string = "createWallet(uint256,address[],uint256)"
	CreateForwarderMethod             string = "createForwarder(uint256,address)"
	GenerateMessageToSignMethod       string = "generateMessageToSign(address,uint256,address,uint256)"
	GenerateERC721MessageToSignMethod string = "generateMessageToSign(address,address,uint256,uint256)"
	SpendMethod                       string = "spend(address,uint256,address,uint8[],bytes32[],bytes32[])"
	SpendERC721Method                 string = "spend(address,address,uint256,uint8,bytes32,bytes32,uint8,bytes32,bytes32)"
	FlushMethod                       string = "flush()"

	// Utils
	abiLength = 64
	abiBytes  = 32
)

// Config ...
type Config struct {
	Endpoint string
}

// Factory ...
type Factory string

// GetDeploymentAddress ...
func (f Factory) GetDeploymentAddress(client Client, salt uint64, senderAddr string) (string, error) {
	data := fmt.Sprintf("0x%s", GetMethodID(GetDeploymentAddressMethod))

	//concatenate salt to data
	data += fmt.Sprintf("%064x", salt)

	//concatenate sender address to data
	encodedSenderAddr, err := EncodeAddressParameter(senderAddr)
	if err != nil {
		return "", xerrors.Errorf("EncodeAddressParameter: %w", err)
	}
	data += encodedSenderAddr

	param := []interface{}{
		map[string]interface{}{
			"to":   f,
			"data": data,
		},
		"latest",
	}

	resp, err := client.Call("eth_call", param)
	if err != nil {
		return "", xerrors.Errorf("client.Call: %w", err)
	}

	if resp.Error != nil {
		return "", xerrors.New(resp.Error.Message)
	}

	var result string
	resp.GetObject(&result)

	deploymentAddr, err := ParseAbi(result, "address")
	if err != nil {
		return "", xerrors.Errorf("ParseAbi: %w", err)
	}
	checkSumDeploymentAddr := common.HexToAddress(deploymentAddr).Hex()

	return checkSumDeploymentAddr, nil
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

// GetCreateWalletTxData ...
func GetCreateWalletTxData(salt uint64, ownerAddrs []string, signerNum uint64) ([]byte, error) {
	data := fmt.Sprintf("0x%s", GetMethodID(CreateWalletMethod))

	//concatenate salt to data
	data += fmt.Sprintf("%064x", salt)

	//concatenate the location of second argument to data
	data += fmt.Sprintf("%064x", abiBytes*3)

	//concatenate signerNum to data
	data += fmt.Sprintf("%064x", signerNum)

	//concatenate array length to data
	data += fmt.Sprintf("%064x", len(ownerAddrs))

	//concatenate owners addresses to data
	for _, v := range ownerAddrs {
		encodedOwnerAddr, err := EncodeAddressParameter(v)
		if err != nil {
			return nil, xerrors.Errorf("wrap: %w", err)
		}
		data += encodedOwnerAddr
	}

	dataByte, err := hex.DecodeString(data[2:])
	if err != nil {
		return nil, xerrors.Errorf("wrap: %w", err)
	}

	return dataByte, nil
}
