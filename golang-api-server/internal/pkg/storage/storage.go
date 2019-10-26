package storage

import "archive/zip"

// Storage ...
type Storage interface {
	UploadImage(file *zip.File, title, chapter, contractAddr string) (string, int64, error)
}



// Config ...
type Config struct {
	StorageBucket string
}
