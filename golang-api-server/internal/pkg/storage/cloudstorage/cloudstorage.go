package cloudstorage

import (
	"context"

	cloud_storage "cloud.google.com/go/storage"
	"github.com/jphacks/TK_1907/golang-api-server/internal/pkg/storage"
)

// New ...
func New(cfg storage.Config) (storage.Storage, error) {
	client, err := cloud_storage.NewClient(context.Background())
	if err != nil {
		return nil, err
	}
	return &CloudStorage{bucket: client.Bucket(cfg.StorageBucket), config: cfg}, nil
}

// CloudStorage ...
type CloudStorage struct {
	bucket *cloud_storage.BucketHandle
	config storage.Config
}

func (c *CloudStorage) UploadImage() error {
	wc := c.bucket.Object("filename1").NewWriter(context.Background())
	wc.ContentType = "image/jpeg"
	wc.ACL = []cloud_storage.ACLRule{{Entity: cloud_storage.AllUsers, Role: cloud_storage.RoleReader}}
	if _, err := wc.Write([]byte("hello world")); err != nil {
		return err
	}
	if err := wc.Close(); err != nil {
		return err
	}
	return nil
}
