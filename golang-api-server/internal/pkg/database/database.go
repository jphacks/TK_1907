package database

import (
	"time"
)

// Database ...
type Database interface {
	SetPages(contractAddr, title, chapter string, pages []PageInfo) error
}

// Config ...
type Config struct {
	ProjectID string
	Keepalive time.Duration
}

// PageInfo ...
type PageInfo struct {
	Page       int64
	StorageURL string
}
