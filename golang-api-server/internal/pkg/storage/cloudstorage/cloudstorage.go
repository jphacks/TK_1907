package cloudstorage

import (
	"archive/zip"
	"bytes"
	"context"
	"fmt"
	"io"
	"io/ioutil"
	"regexp"
	"strconv"

	"github.com/jphacks/TK_1907/golang-api-server/internal/pkg/logger"
	"go.uber.org/zap"

	"golang.org/x/xerrors"

	cloud_storage "cloud.google.com/go/storage"
	"github.com/jphacks/TK_1907/golang-api-server/internal/pkg/storage"
)

var (
	snRegex = regexp.MustCompile(`(\d{1,5})\.(jpg|jpeg)`)
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

// UploadImage ...
func (c *CloudStorage) UploadImage(file *zip.File, title, chapter, contractAddr string) (string, int64, error) {
	fileName := snRegex.FindAllStringSubmatch(file.Name, -1)
	if len(fileName) == 0 {
		return "", 0, xerrors.New("fileName is invalid")
	}
	sn, err := strconv.ParseInt(fileName[0][1], 10, 64)
	if err != nil {
		return "", 0, xerrors.New(fmt.Sprintf("parse error: %s", fileName[0][1]))
	}
	bucketFileName := fmt.Sprintf("%s_%s_%d.jpeg", title, chapter, sn)
	wc := c.bucket.Object(bucketFileName).NewWriter(context.Background())
	wc.ContentType = "image/jpeg"
	wc.ACL = []cloud_storage.ACLRule{{Entity: cloud_storage.AllUsers, Role: cloud_storage.RoleReader}}
	rc, err := file.Open()
	if err != nil {
		logger.Error("file.Open() error", zap.Error(err))
		return "", 0, err
	}
	buf := new(bytes.Buffer)
	if _, err := io.Copy(buf, rc); err != nil {
		logger.Error("io.Copy() error", zap.Error(err))
		return "", 0, err
	}
	if _, err := wc.Write(buf.Bytes()); err != nil {
		return "", 0, err
	}
	if err := wc.Close(); err != nil {
		return "", 0, err
	}
	return fmt.Sprintf("https://storage.googleapis.com/%s/%s", c.config.StorageBucket, bucketFileName), sn, nil
}

// GetImage ...
func (c *CloudStorage) GetImage(title string, chapter, page int64) ([]byte, error) {
	bucketFileName := fmt.Sprintf("%s_%d_%d.jpeg", title, chapter, page)
	rc, err := c.bucket.Object(bucketFileName).NewReader(context.Background())
	if err != nil {
		return nil, err
	}
	defer rc.Close()

	slurp, err := ioutil.ReadAll(rc)
	if err != nil {
		return nil, err
	}
	return slurp, nil
}
