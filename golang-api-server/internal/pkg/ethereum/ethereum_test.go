package ethereum

import (
	"testing"

	"github.com/GincoInc/go-util/assert"
	"github.com/k0kubun/pp"
)

func TestNewEthereum(t *testing.T) {
	tests := []struct {
		name     string
		endpoint string
		err      error
	}{
		{
			name: "success 1",
			//endpoint: "ropsten.infura.io/v3/21a0bbd84cf24419be9b457e6399e15d",
			endpoint: "ropsten.infura.io",
			err:      nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			_, err := NewEthereum(tt.endpoint)
			assert.Cmp(t, tt.err, err)
		})
	}
}

func TestCall(t *testing.T) {
	tests := []struct {
		name     string
		endpoint string
		err      error
	}{
		{
			name:     "success 1",
			endpoint: "ropsten.infura.io",
			err:      nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			client, err := NewEthereum(tt.endpoint)
			assert.Cmp(t, tt.err, err)
			param := []interface{}{
				"0x1b4",
				true,
			}

			resp, err := client.Call("eth_getBlockByNumber", param)
			//var result string
			//resp.GetObject(&result)
			pp.Println(resp)
			pp.Println(err.Error())
		})
	}
}
