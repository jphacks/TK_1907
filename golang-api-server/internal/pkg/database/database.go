package database

import (
	"time"
)

// Database ...
type Database interface {
	GetTitle(contractAddr string) (string, error)
	IncreasePV(contractAddr string) error
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

// Book ...
type Book struct {
	PV        int64
	Thumbnail string
	Title     string
}
