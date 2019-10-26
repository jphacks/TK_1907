package database

import (
	"time"
)

// Database ...
type Database interface{}

// Config ...
type Config struct {
	ProjectID string
	Keepalive time.Duration
}
