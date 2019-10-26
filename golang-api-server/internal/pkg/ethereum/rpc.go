package ethereum

import (
	"encoding/json"
	"fmt"
)

// RPCResponse ...
type RPCResponse struct {
	JSONRPC string      `json:"jsonrpc"`
	Result  interface{} `json:"result,omitempty"`
	Error   *RPCError   `json:"error,omitempty"`
	ID      uint        `json:"id"`
}

// GetObject ...
func (rpcResponse *RPCResponse) GetObject(toType interface{}) error {
	js, err := json.Marshal(rpcResponse.Result)
	if err != nil {
		return err
	}

	err = json.Unmarshal(js, toType)
	if err != nil {
		return err
	}

	return nil
}

// RPCError ...
type RPCError struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func (err RPCError) Error() string {
	return fmt.Sprintf("Error %d (%s)", err.Code, err.Message)
}
