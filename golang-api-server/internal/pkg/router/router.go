package router

import (
	"github.com/jphacks/TK_1907/golang-api-server/internal/pkg/database"
	"github.com/jphacks/TK_1907/golang-api-server/internal/pkg/handler"
	"github.com/jphacks/TK_1907/golang-api-server/internal/pkg/storage"
	"github.com/labstack/echo"
)

// Init ...
func Init(db database.Database, s storage.Storage) *echo.Echo {

	e := echo.New()

	e.GET("/health", handler.HealthCheck())
	e.POST("/uploadMedia", handler.UploadImage(db, s))

	return e
}
