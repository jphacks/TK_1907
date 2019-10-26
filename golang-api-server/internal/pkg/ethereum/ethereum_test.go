package ethereum

import (
	"context"
	"testing"

	"github.com/GincoInc/go-util/assert"
)

var (
	ctx context.Context
)

func TestNewEthereum(t *testing.T) {
	tests := []struct {
		name     string
		endpoint string
		err      error
	}{
		{
			name:     "success 1",
			endpoint: "https://ropsten.infura.io/v3/21a0bbd84cf24419be9b457e6399e15d",
			err:      nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			_, err := New(tt.endpoint)
			assert.Cmp(t, tt.err, err)
		})
	}
}

func TestGetDeploymentAddress(t *testing.T) {
	tests := []struct {
		name     string
		endpoint string
		nonce    uint64
		sender   string
		err      error
	}{
		{
			name:     "success 1",
			endpoint: "https://ropsten.infura.io/v3/21a0bbd84cf24419be9b457e6399e15d",
			nonce:    0,
			sender:   "0xc633C8d9e80a5E10bB939812b548b821554c49A6",
			err:      nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			client, err := New(tt.endpoint)
			assert.Cmp(t, tt.err, err)
			_, err = GetDeploymentAddress(client, tt.nonce, tt.sender)
			assert.Cmp(t, tt.err, err)
		})
	}
}
