package ethereum

import (
	"context"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/ethclient"
	"golang.org/x/xerrors"
)

// Client ...
type Client interface {
	Call(method string, params interface{}) (*RPCResponse, error)
	Close()
}

// Ethereum ...
type Ethereum struct {
	client *ethclient.Client
}

// NewEthereum ...
func NewEthereum(endpoint string) (*Ethereum, error) {
	client, err := ethclient.Dial(endpoint)
	if err != nil {
		return nil, err
	}
	return &Ethereum{
		client: client,
	}, nil
}

// Call ...
func (e *Ethereum) Call(ctx context.Context, method string, msg ethereum.CallMsg) ([]byte, error) {
	hex, err := e.client.CallContract(ctx, msg, nil)
	if err != nil {
		return nil, xerrors.Errorf("rpc.Call: %w", err)
	}
	return hex, nil
}

// Close ...
func (e *Ethereum) Close() {
	e.client.Close()
	// TODO defer client.Close()
}
