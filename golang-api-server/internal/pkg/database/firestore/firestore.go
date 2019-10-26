package firestore

import (
	"context"
	"time"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/option"
	"google.golang.org/grpc"
	"google.golang.org/grpc/keepalive"

	"github.com/jphacks/TK_1907/golang-api-server/internal/pkg/database"
)

// New ...
func New(cfg database.Config) (database.Database, error) {
	keepaliveOption := option.WithGRPCDialOption(grpc.WithKeepaliveParams(keepalive.ClientParameters{
		Time:                cfg.Keepalive * time.Second,
		PermitWithoutStream: true,
	}))

	client, err := firestore.NewClient(context.Background(), cfg.ProjectID, keepaliveOption)
	if err != nil {
		return nil, err
	}

	return &Firestore{client: client, config: cfg}, nil
}

// Firestore ...
type Firestore struct {
	client *firestore.Client
	config database.Config
}
