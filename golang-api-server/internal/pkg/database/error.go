package database

import "golang.org/x/xerrors"

// Error
var (
	ErrNotFound = xerrors.New("not found")
)
