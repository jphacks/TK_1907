package ethereum

import (
	"context"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/ethclient"
	"golang.org/x/xerrors"
)

// Ethereum ...
type Ethereum interface {
	Call(ctx context.Context, msg ethereum.CallMsg) ([]byte, error)
	Close()
}

// Client ...
type Client struct {
	client *ethclient.Client
}

// New ...
func New(endpoint string) (*Client, error) {
	client, err := ethclient.Dial(endpoint)
	if err != nil {
		return nil, err
	}
	return &Client{
		client: client,
	}, nil
}

// Call ...
func (c *Client) Call(ctx context.Context, msg ethereum.CallMsg) ([]byte, error) {
	hex, err := c.client.CallContract(ctx, msg, nil)
	if err != nil {
		return nil, xerrors.Errorf("rpc.Call: %w", err)
	}
	return hex, nil
}

// Close ...
func (c *Client) Close() {
	c.client.Close()
}
