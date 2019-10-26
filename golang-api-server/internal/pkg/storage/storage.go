package storage

// Storage ...
type Storage interface {
	UploadImage() error
}

// Config ...
type Config struct {
	StorageBucket string
}
